$(function() {





  // function showMap(position) {
  //   var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
  // }
  // navigator.geolocation.getCurrentPosition(showMap);
  // var map = L.map('map').setView([47.679223, -122.196983], 15);
  L.mapbox.accessToken = 'pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA';

  var $container = $('#container');
  var $map = $('#map');
  var $body = $('body');
  var $window = $(window);
  var $infoContainer = $('#info-container');
  var currentSelection;

  var savedInfo = {};
  var selectorObject = {};

  var overlayMaps = {};


  function categoryMaker(catName, iconSize, iconAnchor) {
    selectorObject[catName] = {
      name: catName,
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

  var fruits = categoryMaker("fruits", [31,40], [17, 0]);
  var flowers = categoryMaker("flowers", [28, 40], [14, 40]);
  var trees = categoryMaker("trees", [31,43], [15, 43]);
  var seahawks = categoryMaker("seahawks", [51,22],[47,22]);
  var lemonde = categoryMaker("lemonade", [20, 30], [13, 30]);
  var fireworks = categoryMaker("fireworks", [30, 30], [20, 25]);
  var sale = categoryMaker("sale", [28, 40], [14, 35]);
  var cops = categoryMaker("cops", [26,32], [13, 32]);




  var map = L.map('map', {
    center: [47.679223, -122.196983],
    zoom: 15,
    layers: [selectorObject["fruits"].layerGroup, selectorObject["flowers"].layerGroup,
            selectorObject["trees"].layerGroup, selectorObject["seahawks"].layerGroup,
            selectorObject["lemonade"].layerGroup, selectorObject["fireworks"].layerGroup,
            selectorObject["sale"].layerGroup]
  });

  // function scrollMap(position) {
  //     map.setView([position.coords.latitude, position.coords.longitude], 15);
  //     marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
  //     marker.bindPopup("Your location").openPopup();
  //   }

  //   // Request repeated updates.
  //   var watchId = navigator.geolocation.watchPosition(scrollMap);

  //   function buttonClickHandler() {
  //     // Cancel the updates when the user clicks a button.
  //     navigator.geolocation.clearWatch(watchId);
  //   }

  // map.removeLayer(cops);

//   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'your.mapbox.project.id',
//     accessToken: 'your.mapbox.public.access.token'
// }).addTo(map);

  //https://a.tiles.mapbox.com/v4/dgempler.4a7eb7cb/{z}/{x}/{y}.html?access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#4

  var base = L.tileLayer('https://a.tiles.mapbox.com/v4/dgempler.4a7eb7cb/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#4', {
    attribution: 'Map data &#169 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map);

  var baseSat = L.tileLayer('https://a.tiles.mapbox.com/v4/dgempler.n947bfnn/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGdlbXBsZXIiLCJhIjoiYTk4ZTgxMjBhNzUyMmRjZThhYzBkMDQ3MzdlOWMxZjkifQ.Uw-FNsJvZm-5JDPBRv06fA#19/', {
    attribution: 'Map data &#169 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  });

  // var selectorObject = {
  //   "seahawks": [seahawks, seahawksArray, seahawksIcon],
  //   "fruits": [fruits, fruitsArray, fruitsIcon],
  //   "flowers": [flowers, flowersArray, flowersIcon],
  //   "trees": [trees, treesArray, treesIcon],
  //   "cops": [cops, copsArray, copsIcon],
  //   "lemonade": [lemonade, lemonadeArray, lemonadeIcon],
  //   "fireworks": [fireworks, fireworksArray, fireworksIcon],
  //   "sale": [sale, saleArray, saleIcon]
  // };



  function onMapClick(e) {
    // popup.setLatLng(e.latlng);
    // popup.setContent("You clicked the map at " + e.latlng.toString());
    // popup.openOn(map);
    for (var key in selectorObject) {
      if (currentSelection === key) {
        var marker = L.marker(e.latlng, {
          icon: selectorObject[key].icon,
          draggable: true,
          title: key,
          riseOnHover: true,
        });
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
    }
  }

  $map.on("click", ".remove", function() {
    for (var key in selectorObject) {
      if (this.dataset.layer === key) {
        selectorObject[key].layerGroup.removeLayer(selectorObject[key].array[$(this).attr('id')]);
        delete selectorObject[key].array[$(this).attr('id')];
        $('input#' + $(this).attr('id')).remove();
        $('form#' + $(this).attr('id')).parent().fadeOut('slow', function() {
            $(this).remove();
          });
        delete savedInfo[$(this).attr('id')];
      }
    }
  });

  //definitely put most of this code into a separate function!!!!
  map.on("popupopen", function(e) {
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
  });

  $infoContainer.on("click", "button", function(e) {
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
  });


    // var marker = new L.Marker(e.latlng, {draggable:true});
    //     map.addLayer(marker);
    //     markers[marker._leaflet_id] = marker;
    //     console.log(markers);
    //     $('#overlay > ul').append('<li>Marker '+ marker._leaflet_id + ' - <a href="#" class="remove" id="' + marker._leaflet_id + '">remove</a></li>');


   // // Remove a marker
   //  $('.remove').on("click", function() {
   //      // Remove the marker
   //      map.removeLayer(markers[$(this).attr('id')]);

   //      // Remove the link
   //      $(this).parent('li').remove();

   //      // Remove the marker from the array
   //      delete markers[$(this).attr('id')];

   //  });



    // seahawksArray.push(L.marker(e.latlng, {icon: seahawksIcon}));
    // seahawksArray[seahawksArray.length-1].addTo(map);
    // seahawks.addLayer(seahawksArray[seahawksArray.length-1]);

  map.on("click", onMapClick);


//for this function, either use a trackable poPoOn variable, or you have to actually remove
//layers and add layers back in to track if a map has a layer (as your conditional).
//eg, !map.hasLayer(cops)

  $(window).on("keydown", function(e) {
    if(e.keyCode === 27) {
      currentSelection = "";
    }
    if (e.keyCode === 8 && e.shiftKey === true) {
      if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
      }
    }
  });

  $window.on("keypress", function(e) {
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
  });

  function iconMaker(url, size, iconAnchor) {
    var icon = new IconMaker(url, size, iconAnchor);
    return L.icon(icon);
  }

  function IconMaker(url, size, iconAnchor) {
    this.iconUrl = "images/" + url + ".png";
    // this.shadowUrl = url + "Shadow.png";
    this.iconSize = size;
    // this.shadowSize = shadowSize;
    this.iconAnchor = iconAnchor;
    // this.shadowAnchor = shadowAnchor;
    // this.popupAnchor = popupAnchor;
  }




  // var seahawksIcon = L.icon({
  //   iconUrl: 'seahawks',
  //   shadowUrl: 'seahawksShadow',

  //   iconSize: [64,28],
  //   shadowSize: [72, 32],
  //   iconAnchor: [59, 28],
  //   shadowAnchor: [76, 36],
  //   popupAnchor: [-3, 76]
  // });

  var baseMaps = {
    "Street": base,
    "Aerial": baseSat,
  };



  var control = L.control.layers(baseMaps, overlayMaps);
  control.addTo(map);

  var locate = L.control.locate().addTo(map);

  locate.start();

  map.on('startfollowing', function() {
    map.on('dragstart', locate._stopFollowing, locate);
  }).on('stopfollowing', function() {
    map.off('dragstart', locate._stopFollowing, locate);
  });

  $container.on("click", "div", function() {
    if ($(this).attr('id') === "delete") {
      if (confirm("Are you sure you want to delete all data?")) {
        deleteAll();
      }
    }
    currentSelection = $(this).attr('id');
  });

  function deleteAll() {
    for (var key in selectorObject) {
      selectorObject[key].array = [];
      selectorObject[key].layerGroup.clearLayers();
    }
    $('.label-info').remove();
    savedInfo = {};
  }

  // Initialize the geocoder control and add it to the map.
  var geocoderControl = L.mapbox.geocoderControl('mapbox.places');
  geocoderControl.addTo(map);

  // var geocoder = L.mapbox.geocoder('mapbox.places');

  // geocoder.query('12319 Chain Lake Rd, Snohomish, WA 98290', function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

    //acceptable reverseQuery first arguments
    //   [lon, lat] // an array of lon, lat
    //  { lat: 0, lon: 0 } // a lon, lat object
    // { lat: 0, lng: 0 } // a lng, lat object

  // geocoder.reverseQuery([47.68118337573163, -122.19596564769745], function(err, data) {
  //   console.log(err);
  //   console.log(data);
  //   console.log(data.features[0]);
  // });

// Listen for the `found` result and display the first result
// in the output container. For all available events, see
// https://www.mapbox.com/mapbox.js/api/v2.2.1/l-mapbox-geocodercontrol/#section-geocodercontrol-on
  // geocoderControl.on('found', function(res) {
  //   var result = res.results.features[0];
  // });



});