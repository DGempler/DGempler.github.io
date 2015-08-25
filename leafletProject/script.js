$(function() {

  var map;
  function showMap(position) {
    map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
  }
  navigator.geolocation.getCurrentPosition(showMap);

  // var map = L.map('map').setView([47.679223, -122.196983], 15);

  var $container = $('#container');
  var $map = $('#map');
  var $body = $('body');
  var currentSelection;

  var seahawksIcon = iconMaker('seahawks', [51,22],[47,22]);
  var flowersIcon = iconMaker('flowers', [28, 40], [14, 40]);
  var fruitsIcon = iconMaker('cherry', [31,40], [17, 0]);
  var treesIcon = iconMaker('tree', [31,43], [15, 43]);
  var copsIcon = iconMaker('chiefWiggum', [26,32], [13, 32]);


  var seahawksArray = [L.marker({lat: 47.67928362728518, lng: -122.19530582427977}, {icon: seahawksIcon}), L.marker({lat: 47.677203215032385, lng: -122.19281673431396}, {icon: seahawksIcon})];
  var seahawks = L.layerGroup(seahawksArray);
  var fruitsArray = [];
  var fruits = L.layerGroup(fruitsArray);
  var flowersArray = [];
  var flowers = L.layerGroup(flowersArray);
  var treesArray = [];
  var trees = L.layerGroup(treesArray);
  var copsArray = [];
  var cops = L.layerGroup(copsArray);

  var poPoOn = false;

  // var map = L.map('map', {
  //   center: [47.679223, -122.196983],
  //   zoom: 15,
  //   layers: [seahawks, fruits, flowers, trees, cops],
  // });

  // map.removeLayer(cops);

  // var overlayMaps = {
  //   "fruits": fruits,
  //   "seahawks": seahawks,
  //   "flowers": flowers,
  //   "cops": cops,
  //   "trees": trees
  // };

  var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&#169 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  var selectorObject = {
    "seahawks": [seahawks, seahawksArray, seahawksIcon],
    "fruits": [fruits, fruitsArray, fruitsIcon],
    "flowers": [flowers, flowersArray, flowersIcon],
    "trees": [trees, treesArray, treesIcon],
    "cops": [cops, copsArray, copsIcon]
  };

  function onMapClick(e) {
    // popup.setLatLng(e.latlng);
    // popup.setContent("You clicked the map at " + e.latlng.toString());
    // popup.openOn(map);
    for (var key in selectorObject) {
      if (currentSelection === key) {
        selectorObject[key][1].push(L.marker(e.latlng, {icon: selectorObject[key][2]}));
        selectorObject[key][0].addLayer(selectorObject[key][1][selectorObject[key][1].length-1]);
      }
    }
    // seahawksArray.push(L.marker(e.latlng, {icon: seahawksIcon}));
    // seahawksArray[seahawksArray.length-1].addTo(map);
    // seahawks.addLayer(seahawksArray[seahawksArray.length-1]);
  }

  map.on("click", onMapClick);


//for this function, either use a trackable poPoOn variable, or you have to actually remove
//layers and add layers back in to track if a map has a layer (as your conditional).
//eg, !map.hasLayer(cops)

  $(window).on("keypress", function(e) {
    if (e.keyCode === 960) {
      currentSelection = "cops";
    }
    if (e.keyCode === 16 && e.altKey === true && e.shiftKey === true) {
      if (!poPoOn) {
        map.addLayer(cops);
        control.addOverlay(cops, "po-po");
        currentSelection = "cops";
        poPoOn = true;
        $secretMsg = $('<p display="none">ACTIVATED secret po-po mode</p>');
        $secretMsg.css("color", "gray");
        $body.append($secretMsg);
        $secretMsg.fadeIn('slow').fadeOut('slow');
        $body.remove($secretMsg);
      }
      else {
        control.removeLayer(cops);
        map.removeLayer(cops);
        currentSelection = "";
        poPoOn = false;
        $secretMsg = $('<p display="none">DEACTIVATED secret po-po mode</p>');
        $secretMsg.css("color", "gray");
        $body.append($secretMsg);
        $secretMsg.fadeIn('slow').fadeOut('slow');
        $body.remove($secretMsg);
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
    "base": base,
  };

  var overlayMaps = {
    "seahawks": seahawks,
    "fruits": fruits,
    "flowers": flowers,
    "trees": trees,
  };

  var control = L.control.layers(null, overlayMaps);
  control.addTo(map);



  $container.on("click", "div", function() {
    currentSelection = $(this).attr('id');
  });

});