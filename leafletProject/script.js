$(function() {

  L.mapbox.accessToken = 'pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA';

  var $container = $('#container');
  var $map = $('#map');
  var $body = $('body');
  var $window = $(window);
  var $infoContainer = $('#info-container');

  var savedInfo = {};
  var selectorObject = {};
  var overlayMaps = {};

  var map;
  var control;
  var locate;
  var geocoderControl;
  var base;
  var baseSat;
  var baseMaps;

  var currentSelection;

//create markers
  markerGroupMaker("fruits", [31,40], [17, 0]);
  markerGroupMaker("flowers", [28, 40], [14, 40]);
  markerGroupMaker("trees", [31,43], [15, 43]);
  markerGroupMaker("seahawks", [51,22],[47,22]);
  markerGroupMaker("lemonade", [20, 30], [13, 30]);
  markerGroupMaker("fireworks", [30, 30], [20, 25]);
  markerGroupMaker("sale", [28, 40], [14, 35]);
  markerGroupMaker("cops", [26,32], [13, 32]);

//create map, add base & overlap layers, various controls to map
  map = L.map('map', {
    center: [47.679223, -122.196983],
    zoom: 15,
    layers: loopLayerGroups(),
  });

  base = L.tileLayer('https://a.tiles.mapbox.com/v4/dgempler.4a7eb7cb/{z}/{x}/{y}.png?' +
                      'access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmR' +
                      'jZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#4', {
    attribution: 'Map data &#169 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
  }).addTo(map);

  baseSat = L.tileLayer('https://a.tiles.mapbox.com/v4/dgempler.n947bfnn/{z}/{x}/{y}.png?' +
                        'access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRj' +
                        'ZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#19/', {
    attribution: 'Map data &#169 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
  });

  baseMaps = {
    "Street": base,
    "Aerial": baseSat,
  };

  control = L.control.layers(baseMaps, overlayMaps);
  control.addTo(map);

  locate = L.control.locate().addTo(map);
  locate.start();

  map.on('startfollowing', function() {
    map.on('dragstart', locate._stopFollowing, locate);
  }).on('stopfollowing', function() {
    map.off('dragstart', locate._stopFollowing, locate);
  });

  geocoderControl = L.mapbox.geocoderControl('mapbox.places');
  geocoderControl.addTo(map);

//event handlers
  map.on("click", createMarkerAndInfoLabel);
  $map.on("click", ".remove", deleteMarkerOnPopupClick);
  map.on("popupopen", addInfoLabelToScreen);
  $infoContainer.on("click", "button", infoLabelDeleteSaveButtonHandler);
  $window.on("keydown", hotkeyClearDeleteHandler);
  $window.on("keypress", popoModeOnOff);
  $container.on("click", "div", clearDeleteButtonHandler);

  function createMarkerAndInfoLabel(e) {
    for (var key in selectorObject) {
      if (currentSelection === key) {
        var marker = singleMarkerMaker(e, key);
        addMarkerToMap.call(this, key, marker);
        addMarkerLabelInfo.call(this, key, marker, e);
      }
    }
  }

  function deleteMarkerOnPopupClick() {
    for (var key in selectorObject) {
      if (this.dataset.layer === key) {
        deleteMarker.call(this, key);
        deleteInfoLabel.call(this);
      }
    }
  }

  //definitely put most of this code into a separate function!!!!
  function addInfoLabelToScreen(e) {
    var id = e.popup._source._leaflet_id;
    if (savedInfo[id] === undefined) {
      return;
    }
    var $labelInfo = $("<div class='label-info' data-layer='" + savedInfo[id].layer + "'></div>");
    $infoContainer.append($labelInfo);
    $labelInfo.prepend("<p>Peddler Type: " + savedInfo[id].layer + " - ID: " + id + "</p><br/>");
    var $form = $("<form id='" + id + "'></form><br/>");
    $labelInfo.append($form);
    $form.prepend("<label>Location:<input type='text' class='location' value='" + savedInfo[id].location + "' style='width: 299px'/></label><br/>");
    $form.append("<label>Enter items for Sale:<input type='text' class='items' value='" + savedInfo[id].items + "' style='width: 228px'/></label><br/>");
    $form.append("<label>Enter Prices:<input type='text' class='prices' value='" + savedInfo[id].prices + "' style='width: 278px'/></label><br/>");
    $form.append("<button class='save'>Save & Close</button>");
    $form.append("<button class='delete'>Delete</button>");
  }

  function infoLabelDeleteSaveButtonHandler(e) {
    e.preventDefault();
    if ($(this).attr("class") === "delete") {
      for (var key in selectorObject) {
        if ($(this).parent().parent().data('layer') === key) {
          selectorObject[key].layerGroup.removeLayer(selectorObject[key].array[$(this).parent().attr('id')]);
          delete selectorObject[key].array[$(this).parent().attr('id')];
          $(this).parent().parent().fadeOut('slow', function() {
            $(this).remove();
          });
          delete savedInfo[$(this).attr('id')];
        }
      }
    }
    if ($(this).attr("class") === "save") {
      var thisId = $(this).parent().attr('id');
      savedInfo[thisId] = {};
      savedInfo[thisId].layer = $(this).parent().parent().data('layer');
      savedInfo[thisId].location = $(this).parent().find('.location').val();
      savedInfo[thisId].items = $(this).parent().find('.items').val();
      savedInfo[thisId].prices = $(this).parent().find('.prices').val();
      $(this).parent().parent().fadeOut('slow', function() {
        $(this).remove();
      });
    }
  }

  function hotkeyClearDeleteHandler(e) {
    if(e.keyCode === 27) {
      currentSelection = "";
    }
    if (e.keyCode === 8 && e.shiftKey === true) {
      if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
      }
    }
  }

  function popoModeOnOff(e) {
    if (e.keyCode === 16 && e.altKey === true && e.shiftKey === true) {
      if (!map.hasLayer(selectorObject["cops"].layerGroup)) {
        map.addLayer(selectorObject["cops"].layerGroup);
        control.addOverlay(selectorObject["cops"].layerGroup, "cops");
        currentSelection = "cops";
        var $secretMsg = $('<p id="secret" display="none">ACTIVATED secret po-po mode</p>');
        $body.append($secretMsg);
        $secretMsg.css("color", "gray");
        $secretMsg.fadeIn('slow').fadeOut('slow', function() {
          $(this).remove();
        });
      }
      else {
        control.removeLayer(selectorObject["cops"].layerGroup);
        map.removeLayer(selectorObject["cops"].layerGroup);
        currentSelection = "";
        var $secretMsg = $('<p id="secret" display="none">DEACTIVATED secret po-po mode</p>');
        $body.append($secretMsg);
        $secretMsg.css("color", "gray");
        $secretMsg.fadeIn('slow').fadeOut('slow', function() {
          $(this).remove();
        });
      }
    }
  }

  function clearDeleteButtonHandler() {
    if ($(this).attr('id') === "delete") {
      if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
      }
    }
    currentSelection = $(this).attr('id');
  }

  function iconMaker(url, size, iconAnchor) {
    var icon = new IconMaker(url, size, iconAnchor);
    return L.icon(icon);
  }

  function IconMaker(url, size, iconAnchor) {
    this.iconUrl = "images/" + url + ".png";
    this.iconSize = size;
    this.iconAnchor = iconAnchor;
  }

  function deleteAll() {
    for (var key in selectorObject) {
      selectorObject[key].array = [];
      selectorObject[key].layerGroup.clearLayers();
    }
    $('.label-info').remove();
    savedInfo = {};
  }

//creates markers & also adds them to overlapMaps, which is used in layer control
  function markerGroupMaker(catName, iconSize, iconAnchor) {
    selectorObject[catName] = {
      icon: iconMaker(catName, iconSize, iconAnchor),
      array: [],
      layerGroup: L.layerGroup(this.array)
    };
    if (catName === "cops") {
    }
    else {
      overlayMaps[catName] = selectorObject[catName].layerGroup;
    }
    return selectorObject[catName];
  }

//for adding layers to map automatically
  function loopLayerGroups() {
    var newArray = [];
    for (var key in selectorObject) {
      if (key === "cops") {}
      else {
        newArray.push(selectorObject[key].layerGroup);
      }
    }
    return newArray;
  }

//Create Marker and Info Label functions (3)
  function singleMarkerMaker(event, currentKey) {
    return L.marker(event.latlng, {
      icon: selectorObject[currentKey].icon,
      draggable: true,
      title: currentKey,
      riseOnHover: true,
    });
  }

  function addMarkerToMap(key, marker) {
    selectorObject[key].layerGroup.addLayer(marker);
    selectorObject[key].array[marker._leaflet_id] = marker;
    marker.bindPopup(key + " id: " + marker._leaflet_id + "<br/><input type='button' value='Delete' class='remove' id='" + marker._leaflet_id + "' data-layer='" + key + "'/>");
    marker.on("dragend", function(e) {
      var newLoc = e.target._latlng;
      var id = e.target._leaflet_id;
      $('form#' + id + ' .location').val("Lat: " + newLoc.lat + ", Lng: " + newLoc.lng);
      if (savedInfo[id] === undefined) {
        return;
      }
      savedInfo[id].location = "Lat: " + newLoc.lat + ", Lng: " + newLoc.lng;
    });
  }

  function addMarkerLabelInfo(key, marker, e) {
    var $labelInfo = $("<div class='label-info' data-layer='" + key + "'></div>");
      $infoContainer.append($labelInfo);
      $labelInfo.prepend("<p>Peddler Type: " + key + " - ID: " + marker._leaflet_id + "</p><br/>");
      var $form = $("<form id='" + marker._leaflet_id + "'></form><br/>");
      $labelInfo.append($form);
      $form.prepend("<label>Location:<input type='text' class='location' value=' Lat: " + e.latlng.lat + ", Lng: " + e.latlng.lng + "' style='width: 301px'/></label><br/>");
      $form.append("<label>Enter items for Sale:<input type='text' class='items' style='width: 230px'/></label><br/>");
      $form.append("<label>Enter Prices:<input type='text' class='prices' style='width: 280px'/></label><br/>");
      $form.append("<button class='save'>Save & Close</button>");
      $form.append("<button class='delete'>Delete</button>");
  }

 //deleteMarkerOnPopupClick functions (2)
   function deleteMarker(key, popupTrueFalse) {
    selectorObject[key].layerGroup.removeLayer(selectorObject[key].array[$(this).attr('id')]);
    delete selectorObject[key].array[$(this).attr('id')];
  };

  function deleteInfoLabel() {
    $('input#' + $(this).attr('id')).remove();
    $('form#' + $(this).attr('id')).parent().fadeOut('slow', function() {
        $(this).remove();
      });
    delete savedInfo[$(this).attr('id')];
  }
});