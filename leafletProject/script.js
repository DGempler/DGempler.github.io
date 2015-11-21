$(function() {

  L.mapbox.accessToken = 'pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA';

  var $container = $('#container');
  var $map = $('#map');
  var $body = $('body');
  var $window = $(window);
  var $infoContainer = $('#info-container');

  var savedMarkerInfo = {};
  var layerSelectorObject = {};
  var overlayMaps = {};

  var map;
  var control;
  var locate;
  var geocoderControl;
  var base;
  var baseSat;
  var baseMaps;

  var currentLayerSelected;

  //create markers
  markerGroupMaker("fruits", [31,40], [17, 0]);
  markerGroupMaker("flowers", [28, 40], [14, 40]);
  markerGroupMaker("trees", [31,43], [15, 43]);
  markerGroupMaker("seahawks", [51,22],[47,22]);
  markerGroupMaker("lemonade", [20, 30], [13, 30]);
  markerGroupMaker("fireworks", [30, 30], [20, 25]);
  markerGroupMaker("sale", [28, 40], [14, 35]);
  markerGroupMaker("cops", [26,32], [13, 32]);


  //"click" to "singleclick" plugin - Alpstein's leaflet-singleclick_0.7
  L.Map.addInitHook(function () {
    var that = this, h ;
    if (that.on) {
      that.on( 'click',    check_later );
      that.on( 'dblclick', function () { setTimeout( clear_h, 0 ); } );
    }
    function check_later( e ) {
      clear_h();
      h = setTimeout( check, 200 );
      function check(){
          that.fire( 'singleclick', L.Util.extend( e, { type : 'singleclick' } ) );
      }
    }
    function clear_h()
    {
      if (h !== null)
      {
          clearTimeout( h );
          h = null;
      }
    }
  });

  //create map, add base & overlap layers, various controls to map
  map = L.map('map', {
    center: [47.679223, -122.196983],
    zoom: 15,
    layers: loopLayerGroups(),
  });

  base = L.tileLayer('https://a.tiles.mapbox.com/v4/dgempler.4a7eb7cb/{z}/{x}/{y}.png?' +
                      'access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmR' +
                      'jZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#4', {
    attribution: 'Map data &#169 <a href="http://openstreetmap.org">OpenStreetMap</a>' +
                      'contributors, <a href="http://creativecommons.org/licenses/by-sa' +
                      '/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
  })
  .addTo(map);

  baseSat = L.tileLayer('https://a.tiles.mapbox.com/v4/dgempler.n947bfnn/{z}/{x}/{y}.png?' +
                        'access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRj' +
                        'ZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#19/', {
    attribution: 'Map data &#169 <a href="http://openstreetmap.org">OpenStreetMap</a>' +
                  'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                  'CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
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





/*
  function geojsonMarkerOptions(key) {
    return {
      icon: layerSelectorObject[key].icon,
      draggable: true,
      title: key,
      riseOnHover: true,
    };
  }
  (function localStorageRestore() {
    for (var key in layerSelectorObject) {
      // localStorage.removeItem(key);
      if (localStorage.getItem(key) !== null) {
        layerSelectorObject[key].layerGroup = L.geoJson(JSON.parse(localStorage[key]), {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, geojsonMarkerOptions(key));
          }
        }).addTo(map);
        for (var index in layerSelectorObject[key].layerGroup._layers) {
          var object = layerSelectorObject[key].layerGroup._layers;
          var marker = object[index];
          layerSelectorObject[key].array[index] = marker;
          var name = object[index].options.title;
          marker.bindPopup(name + " id: " + marker._leaflet_id + "<br/><input type='button' " +
                            "value='Delete' class='remove' id='" + marker._leaflet_id +
                            "' data-layer='" + name + "'/>");
          marker.on("dragend", function(e) {
            var newLoc = e.target._latlng;
            var id = e.target._leaflet_id;
            // $('form#' + id + ' .location').val("Lat: " + newLoc.lat + ", Lng: " + newLoc.lng);
            reverseGeocode(newLoc.lat, newLoc.lng, true, id);
            if (savedMarkerInfo[id] === undefined) {
              return;
            }
          });
        }
        if (key === "cops") {
          control.removeLayer(layerSelectorObject["cops"].layerGroup);
          map.removeLayer(layerSelectorObject["cops"].layerGroup);
        }
      }
    }
    if (localStorage.getItem("savedMarkerInfo") !== null) {
      // localStorage.removeItem('savedMarkerInfo');
      savedMarkerInfo = JSON.parse(localStorage.savedMarkerInfo);
    }
  })();
*/

  //event handlers
  map.on("singleclick", createMarkerAndInfoLabelHandler);
  $map.on("click", ".remove", deleteMarkerOnPopupClickHandler);
  map.on("popupopen", addInfoLabelToScreenHandler);
  $infoContainer.on("click", "button", infoLabelDeleteSaveButtonHandler);
  $infoContainer.on("change", "input", infoLabelSaveHandler);
  $window.on("keydown", hotkeyClearDeleteHandler);
  $window.on("keypress", popoModeOnOffHandler);
  $container.on("click", "div", assignSelectionHandler);
  $('div.leaflet-control-layers-overlays').on("click",
                                              "input.leaflet-control-layers-selector",
                                              layerSelectorHandler);


  function createMarkerAndInfoLabelHandler(e) {
    var $layerSelector = $('.leaflet-control-layers-overlays input.leaflet-control-layers-selector');
    var $layerSelectorArray = $layerSelector.next();

    var index = getIndexOfSelectedLayerFromLayerSelectorArray($layerSelectorArray);

    if ($layerSelector.eq(index).is(':checked')) {
      createMarkerBasedOnCurrentLayerSelected(e);
    }
    else {
      notifyUserThatMarkerLayerIsOff();
    }
  }

  function getIndexOfSelectedLayerFromLayerSelectorArray(layerSelectorArray) {
    var foundIndex;
    layerSelectorArray.each(function(index, value) {
      if ($(value).html().trim() === currentLayerSelected) {
          foundIndex = index;
        }
      });
    return foundIndex;
  }

  function createMarkerBasedOnCurrentLayerSelected(e) {
    for (var layer in layerSelectorObject) {
      if (currentLayerSelected === layer) {
        var marker = singleMarkerMaker(e, layer);
        addMarkerToMap(layer, marker);
        addMarkerLabelInfoOnMarkerCreation(layer, marker, e);
      }
    }
  }

  function notifyUserThatMarkerLayerIsOff() {
    $infoContainer.children('.label-info').remove();
    var $selectLayerMessage = $("<br/><p id='select-layer-message'>" +
                                "This layer is currently turned off!</p>").hide();
    $selectLayerMessage.css('margin-top', '25px').css('font-size', '24px').css('color', 'white');
    $infoContainer.append($selectLayerMessage);
    $selectLayerMessage.fadeIn(600, function() {
      setTimeout(function () {
        $selectLayerMessage.fadeOut(600, function() {
          $(this).remove();
        });
      }, 1000);
    });
  }






  function deleteMarkerOnPopupClickHandler() {
    for (var layer in layerSelectorObject) {
      if (this.dataset.layer === layer) {
        deleteMarker.call(this, layer, true);
        deleteInfoLabel.call(this, true);
      }
    }
  }

  //on popup open
  function addInfoLabelToScreenHandler(e) {
    var id = e.popup._source._leaflet_id;
    populateMarkerLableInfoFromExistingSavedInfoOnPopupOpen.call(this, id);
  }

  function findLayerOfInfoLabelAndDelete() {
    for (var key in layerSelectorObject) {
      if ($(this).parent().parent().data('layer') === key) {
        deleteMarker.call(this, key, false);
        deleteInfoLabel.call(this);
      }
    }
  }

  function getIdSaveAndCloseInfoLabel() {
    var thisId = $(this).parent().attr('id');
    saveInfo.call(this, thisId);
    $(this).parent().parent().fadeOut('slow', removeThis.call(this));
  }

  function infoLabelDeleteSaveButtonHandler(e) {
    e.preventDefault();
    if ($(this).attr("class") === "delete") {
      findLayerOfInfoLabelAndDelete.call(this);
    }
    if ($(this).attr("class") === "close") {
      getIdSaveAndCloseInfoLabel.call(this);
    }
  }

  function infoLabelSaveHandler(e) {
    var thisId = $(this).parent().parent().attr('id');
    saveInfo.call(this, thisId);
  }

  function hotkeyClearDeleteHandler(e) {
    if(e.keyCode === 27) {
      currentLayerSelected = "";
    }
    if (e.keyCode === 8 && e.shiftKey === true) {
      if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
      }
    }
  }

  function popoModeOnOffHandler(e) {
    if (e.keyCode === 16 && e.altKey === true && e.shiftKey === true) {
      if (!map.hasLayer(layerSelectorObject["cops"].layerGroup)) {
        popoMode.call(this, true);
      }
      else {
        popoMode.call(this);
      }
    }
  }

  function assignSelectionHandler() {
    if ($(this).attr('id') === "delete") {
      if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
      }
    }
    else {
      currentLayerSelected = $(this).attr('id');
    }
  }

  //Functions used in event handler functions

  //creates markers & also adds them to overlapMaps, which is used in layer control
  function markerGroupMaker(catName, iconSize, iconAnchor) {
    layerSelectorObject[catName] = {
      icon: produceIcon(catName, iconSize, iconAnchor),
      array: [],
      layerGroup: L.layerGroup(this.array)
    };
    if (catName === "cops") {
    }
    else {
      overlayMaps[catName] = layerSelectorObject[catName].layerGroup;
    }
    return layerSelectorObject[catName];
  }

  //for adding layers to map automatically
  function loopLayerGroups() {
    var newArray = [];
    for (var key in layerSelectorObject) {
      if (key === "cops") {}
      else {
        newArray.push(layerSelectorObject[key].layerGroup);
      }
    }
    return newArray;
  }

  //Create Marker and Info Label functions (3)
  function singleMarkerMaker(event, currentKey) {
    return L.marker(event.latlng, {
      icon: layerSelectorObject[currentKey].icon,
      draggable: true,
      title: currentKey,
      riseOnHover: true,
    });
  }

  function addMarkerToMap(key, marker) {
    layerSelectorObject[key].layerGroup.addLayer(marker);
    var id = marker._leaflet_id;

    //create an object that stores .location, label info...
    //use own ID?
    savedMarkerInfo[id] = {};
    savedMarkerInfo[id].layer = key;
    reverseGeocode(marker._latlng.lat, marker._latlng.lng, true, id);

    //here's where we get into storing markers for localStorage I think
    layerSelectorObject[key].array[id] = marker;

    //use your own IDs that later get saved to geoJSON object???
    marker.bindPopup(key + " id: " + id + "<br/><input type='button' " +
                      "value='Delete' class='remove' id='" + id +
                      "' data-layer='" + key + "'/>");
    marker.on("dragend", function(e) {
      var newLoc = e.target._latlng;
      var id = e.target._leaflet_id;
      reverseGeocode(newLoc.lat, newLoc.lng, true, id);
      // if (savedMarkerInfo[id] === undefined) {
      //   return;
      // }
      // console.log(savedMarkerInfo[id].location);
    });
  }



  function addMarkerLabelInfoOnMarkerCreation(key, marker, e) {
    var id = marker._leaflet_id;
    $infoContainer.children('.label-info').remove();
    $infoContainer.children('#select-layer-message').remove();
    var $labelInfo = $("<div class='label-info' data-layer='" + key + "'></div>");
    $infoContainer.append($labelInfo);
    $labelInfo.prepend("<p>Peddler Type: " + key + " - ID: " + id + "</p><br/>");
    var $form = $("<form id='" + id + "'></form><br/>");
    $labelInfo.append($form);
    $form.prepend("<label>Location:<input type='text' class='location' style='width: 301px'/></label><br/>");
    $form.append("<label>Enter items for Sale:<input type='text' class='items' style='width: 230px'/></label><br/>");
    $form.append("<label>Enter Prices:<input type='text' class='prices' style='width: 280px'/></label><br/>");
    $form.append("<button class='close'>Close</button>");
    $form.append("<button class='delete'>Delete Marker</button>");
  }

  //addInfoLabeltoScreen function(1) can probably combine with V1 later
  function populateMarkerLableInfoFromExistingSavedInfoOnPopupOpen(id) {
    var items = savedMarkerInfo[id].items ? savedMarkerInfo[id].items : "";
    var prices = savedMarkerInfo[id].prices ? savedMarkerInfo[id].prices : "";

    $infoContainer.children('.label-info').remove();
    $infoContainer.children('#select-layer-message').remove();
    var $labelInfo = $("<div class='label-info' data-layer='" + savedMarkerInfo[id].layer + "'></div>");
    $infoContainer.append($labelInfo);
    $labelInfo.prepend("<p>Peddler Type: " + savedMarkerInfo[id].layer + " - ID: " + id + "</p><br/>");
    var $form = $("<form id='" + id + "'></form><br/>");
    $labelInfo.append($form);
    $form.prepend("<label>Location:<input type='text' class='location' value='" + savedMarkerInfo[id].location + "' style='width: 299px'/></label><br/>");
    $form.append("<label>Enter items for Sale:<input type='text' class='items' value='" + items + "' style='width: 228px'/></label><br/>");
    $form.append("<label>Enter Prices:<input type='text' class='prices' value='" + prices + "' style='width: 278px'/></label><br/>");
    $form.append("<button class='close'>Close</button>");
    $form.append("<button class='delete'>Delete Marker</button>");
  }

   //deleteMarkerOnPopupClick functions (2), "this" refers to popup or info label click handler
   function deleteMarker(key, OnPopup) {
    if (OnPopup) {
      //remove from layerGroup (map)
      layerSelectorObject[key].layerGroup.removeLayer(layerSelectorObject[key].array[$(this).attr('id')]);
      //remove record of layer
      delete layerSelectorObject[key].array[$(this).attr('id')];
    }
    else {
      layerSelectorObject[key].layerGroup.removeLayer(layerSelectorObject[key].array[$(this).parent().attr('id')]);
      delete layerSelectorObject[key].array[$(this).parent().attr('id')];
    }
  }

  // "this" refers to popup or info label click handler
  function deleteInfoLabel(OnPopup) {
    if (OnPopup) {
      $('input#' + $(this).attr('id')).remove();
      $('form#' + $(this).attr('id')).parent().fadeOut('slow', removeThis.call(this));
    }
    else {
      $(this).parent().parent().fadeOut('slow', removeThis.call(this));
    }
    //remove record of layer
    delete savedMarkerInfo[$(this).attr('id')];
  }

  function removeThis() {
    $(this).remove();
  }

  function saveInfo(id) {
    savedMarkerInfo[id].items = $(this).parent().find('.items').val();
    savedMarkerInfo[id].prices = $(this).parent().find('.prices').val();
  }

  function popoMode(on) {
    var $secretMsg;
    if (on) {
      map.addLayer(layerSelectorObject["cops"].layerGroup);
      control.addOverlay(layerSelectorObject["cops"].layerGroup, "cops");
      currentLayerSelected = "cops";
      $secretMsg = $('<p id="secret" display="none">ACTIVATED secret po-po mode</p>');
    }
    else {
      control.removeLayer(layerSelectorObject["cops"].layerGroup);
      map.removeLayer(layerSelectorObject["cops"].layerGroup);
      $infoContainer.children('.label-info').attr("data", "cops").remove();
      currentLayerSelected = "";
      $secretMsg = $('<p id="secret" display="none">DEACTIVATED secret po-po mode</p>');
    }
    $body.append($secretMsg);
    $secretMsg.css("color", "gray");
    $secretMsg.fadeIn(1200).fadeOut(1200, removeThis.call(this));
  }

  function layerSelectorHandler() {
    if (!($(this).is(':checked'))) {
      currentLayerSelected = "";
    }
    var chosenLayer = $(this).html().trim();
    $infoContainer.children('.label-info').attr("data", chosenLayer).remove();
  }


  //Other functions
  function produceIcon(url, size, iconAnchor) {
    var icon = new IconMaker(url, size, iconAnchor);
    return L.icon(icon);
  }

  function IconMaker(url, size, iconAnchor) {
    this.iconUrl = "images/" + url + ".png";
    this.iconSize = size;
    this.iconAnchor = iconAnchor;
  }

  function deleteAll() {
    for (var key in layerSelectorObject) {
      layerSelectorObject[key].array = [];
      layerSelectorObject[key].layerGroup.clearLayers();
    }
    $('.label-info').remove();
    savedMarkerInfo = {};
    currentLayerSelected = "";
  }

  function reverseGeocode(lat, lng, form, id) {
    $.ajax({
      url: 'https://api.mapbox.com/v4/geocode/mapbox.places/' + lng + ',' + lat +
            '.json?access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMj' +
            'BhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA',
      success: function(data) {
        var address = data.features[0].place_name;
        if (form) {
          $('form#' + id + ' .location').attr("value", address);
        }
        if (id) {
          savedMarkerInfo[id].location = address;
        }
      },
    });
  }

/*
  $window.on("beforeunload", function() {
    for (var key in layerSelectorObject) {
      if (layerSelectorObject[key].array !== [])
      localStorage[key] = JSON.stringify((layerSelectorObject[key].layerGroup).toGeoJSON());
    }
    localStorage.savedMarkerInfo = JSON.stringify(savedMarkerInfo);

    // console.log(localStorage.seahawks);
    // return "are you sure?";


    // localStorage.seahawksArray = JSON.stringify(layerSelectorObject['seahawks'].array);

  // localStorage.removeItem('seahawks');

  });
*/
// $.ajax({
//   url: 'https://api.mapbox.com/v4/geocode/{dataset}/{lon},{lat}.json?access_token=<your access token>',
//   sucess: function(data) {
//     console.log(data);
//   }
// })

});