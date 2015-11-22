$(function() {

  L.mapbox.accessToken = 'pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA';

  var $container = $('#container');
  var $map = $('#map');
  var $body = $('body');
  var $window = $(window);
  var $infoContainer = $('#info-container');
  var idCounter = 1;

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

  (function localStorageRestore() {
    for (var layer in layerSelectorObject) {
      if (localStorage.getItem(layer) !== null) {
        var localStorageArray = JSON.parse(localStorage[layer]);
        localStorageArray.forEach(function(marker) {
          marker = L.geoJson(JSON.parse(marker), {
            pointToLayer: function (geoJsonMarker, latlng) {
              return L.marker(latlng, singleMarkerMaker(layer));
            },
            onEachFeature: function(geoJsonMarker, marker) {
              marker.id = idCounter;
              idCounter++;

              savedMarkerInfo[marker.id] = {};
              savedMarkerInfo[marker.id].layer = layer;
              savedMarkerInfo[marker.id].location = geoJsonMarker.properties.location;
              savedMarkerInfo[marker.id].items = geoJsonMarker.properties.items;
              savedMarkerInfo[marker.id].prices = geoJsonMarker.properties.prices;

              layerSelectorObject[layer].layerGroup.addLayer(marker);

              layerSelectorObject[layer].array[marker.id] = marker;

              bindPopupToMarker(marker, layer);

              addDragendEventListenerToMarker(marker);

            }
          });
        });
      }
    }
  })();

  function addMarkerToMap(layer, marker) {
    layerSelectorObject[layer].layerGroup.addLayer(marker);
    var id = marker.id;
    //create an object that stores .location, label info...
    savedMarkerInfo[id] = {};
    savedMarkerInfo[id].layer = layer;
    reverseGeocode(marker._latlng.lat, marker._latlng.lng, true, id);

    layerSelectorObject[layer].array[id] = marker;

    bindPopupToMarker(marker, layer);

    addDragendEventListenerToMarker(marker);

  }

  function bindPopupToMarker(marker, layer) {
    marker.bindPopup(layer + " id: " + marker.id + "<br/><input type='button' " +
                    "value='Delete' class='remove' id='" + marker.id +
                    "' data-layer='" + layer + "'/>");
  }

  function addDragendEventListenerToMarker(marker) {
    marker.on("dragend", function(e) {
      var newLoc = e.target._latlng;
      var id = e.target.id;
      reverseGeocode(newLoc.lat, newLoc.lng, true, id);
    });
  }


  //event handlers
  map.on("singleclick", createMarkerAndInfoLabelHandler);
  $map.on("click", ".remove", deleteMarkerAndInfoLabelOnPopupClickHandler);
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
    var marker = L.marker(e.latlng, singleMarkerMaker(currentLayerSelected));
    marker.id = idCounter;
    idCounter++;
    addMarkerToMap(currentLayerSelected, marker);
    addMarkerLabelInfoOnMarkerCreation(currentLayerSelected, marker, e);
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

  function deleteMarkerAndInfoLabelOnPopupClickHandler() {
    deleteMarker.call(this, this.dataset.layer, true);
    deleteInfoLabel.call(this, true);
  }

  //on popup open
  function addInfoLabelToScreenHandler(e) {
    var id = e.popup._source.id;
    populateMarkerLableInfoFromExistingSavedInfoOnPopupOpen.call(this, id);
  }

  function findLayerOfInfoLabelAndDelete() {
    var layer = $(this).parent().parent().data('layer');
    deleteMarker.call(this, layer, false);
    deleteInfoLabel.call(this);
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
  function markerGroupMaker(layer, iconSize, iconAnchor) {
    layerSelectorObject[layer] = {
      icon: produceIcon(layer, iconSize, iconAnchor),
      array: [],
      layerGroup: L.layerGroup(this.array)
    };
    if (layer === "cops") {}
    else {
      overlayMaps[layer] = layerSelectorObject[layer].layerGroup;
    }
    return layerSelectorObject[layer];
  }

  //for adding layers to map automatically
  function loopLayerGroups() {
    var newArray = [];
    for (var layer in layerSelectorObject) {
      if (layer === "cops") {}
      else {
        newArray.push(layerSelectorObject[layer].layerGroup);
      }
    }
    return newArray;
  }

  //Create Marker and Info Label functions (3)
  function singleMarkerMaker(layer) {
    return {
      icon: layerSelectorObject[layer].icon,
      draggable: true,
      title: layer,
      riseOnHover: true,
    };
  }

  function addMarkerToMap(layer, marker) {
    layerSelectorObject[layer].layerGroup.addLayer(marker);
    var id = marker.id;
    //create an object that stores .location, label info...
    savedMarkerInfo[id] = {};
    savedMarkerInfo[id].layer = layer;
    reverseGeocode(marker._latlng.lat, marker._latlng.lng, true, id);

    layerSelectorObject[layer].array[id] = marker;

    bindPopupToMarker(marker, layer);

    addDragendEventListenerToMarker(marker);

  }

  function bindPopupToMarker(marker, layer) {
    marker.bindPopup(layer + " id: " + marker.id + "<br/><input type='button' " +
                    "value='Delete' class='remove' id='" + marker.id +
                    "' data-layer='" + layer + "'/>");
  }

  function addDragendEventListenerToMarker(marker) {
    marker.on("dragend", function(e) {
      var newLoc = e.target._latlng;
      var id = e.target.id;
      reverseGeocode(newLoc.lat, newLoc.lng, true, id);
    });
  }

  function addMarkerLabelInfoOnMarkerCreation(layer, marker, e) {
    var id = marker.id;
    $infoContainer.children('.label-info').remove();
    $infoContainer.children('#select-layer-message').remove();
    var $labelInfo = $("<div class='label-info' data-layer='" + layer + "'></div>");
    $infoContainer.append($labelInfo);
    $labelInfo.prepend("<p>Peddler Type: " + layer + " - ID: " + id + "</p><br/>");
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
   function deleteMarker(layer, OnPopup) {
    if (OnPopup) {
      //remove from layerGroup (map)
      layerSelectorObject[layer].layerGroup.removeLayer(layerSelectorObject[layer].array[$(this).attr('id')]);
      //remove record of layer
      delete layerSelectorObject[layer].array[$(this).attr('id')];
    }
    else {
      layerSelectorObject[layer].layerGroup.removeLayer(layerSelectorObject[layer].array[$(this).parent().attr('id')]);
      delete layerSelectorObject[layer].array[$(this).parent().attr('id')];
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
    for (var layer in layerSelectorObject) {
      layerSelectorObject[layer].array = [];
      layerSelectorObject[layer].layerGroup.clearLayers();
      delete localStorage[layer];
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

  $window.on("beforeunload", function() {
    for (var layer in layerSelectorObject) {
      if (layerSelectorObject[layer].array.length !== 0) {
        var layerArrayForLocalStorage = [];
        layerSelectorObject[layer].array.forEach(function(marker) {
          console.log(marker);
          var geoJSONedMarker = marker.toGeoJSON();
          var savedMarker = savedMarkerInfo[marker.id];
          geoJSONedMarker.properties = {
            location: savedMarker.location,
            items: savedMarker.items,
            prices: savedMarker.prices,
          };
          layerArrayForLocalStorage.push(JSON.stringify(geoJSONedMarker));
        });
        localStorage[layer] = JSON.stringify(layerArrayForLocalStorage);
      }
    }
  });

});