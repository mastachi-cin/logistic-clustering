// Get reference to the sample button 
var routifyBtn = d3.select("#btn-routify");

// Click handler inline
routifyBtn.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the size input field
  var inputSizeFld = d3.select("#size");

  // Get the value property of the input element
  var inputSize = inputSizeFld.property("value");

  // Assign demo value if input size is empty
  if (inputSize == "") {
    inputSize = 100;
  }

  console.log(inputSize);

  // Select the seed input field
  var inputSeedFld = d3.select("#seed");

  // Get the value property of the input element
  var inputSeed = inputSeedFld.property("value");

  // Assign demo value if input size is empty
  if (inputSeed == "") {
    inputSeed = 42;
  }

  console.log(inputSeed);

  // Select the cargo max input field
  var inputCargoMxFld = d3.select("#cargomax");

  // Get the value property of the input element
  var inputCargomax = inputCargoMxFld.property("value");

  // Assign demo value if input size is empty
  if (inputCargomax == "") {
    inputCargomax = 6;
  }

  console.log(inputCargomax);

  // Select the number of vehicules input field
  var inputVehicleFld = d3.select("#vehicle");

  // Get the value property of the input element
  var inputVehicle = inputVehicleFld.property("value");

  // Assign demo value if input size is empty
  if (inputVehicle == "") {
    inputVehicle = 20;
  }

  console.log(inputVehicle);

  if (inputCargomax * inputVehicle < inputSize ) {
    alert('If you want more accurate results, please keep in mind that the number of vehicles by their maximum cargo capacity shouldn´t be higher than the number of destinations')
  }

  // Map routes
  mapRoutes(inputSize, inputSeed, inputCargomax, inputVehicle);
});

function mapRoutes(size, seed, cargomax, vehicules) {

  d3.select("#prueba").html('<div id="map-id"></div>');

  // Create the map object with options
  var map = L.map("map-id", {
    worldCopyJump: true,
    center: [25.5091232, -100.2628439],
    zoom: 11
  });

  // Create the tile layer that will be the background of our map
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "streets-v11",
    accessToken: API_KEY
  }).addTo(map);

  // Perform a GET request to the URL
  var url = "/api/map/" + size + "/" + seed + "/" + cargomax + "/" + vehicules;
  
  var markers = [];

  d3.json(url, function(data) {

    colors_ls = ['#ff0088','#ff80d5','#3db6f2','#eaf279','#91e673','#bf8f8f','#8c004b','#7f2200','#00734d','#434359','#401010','#1a1d33','#44ff00','#ff8080','#ce3df2','#e50000','#e5b073','#b0b386','#8c7723','#007780','#73396f','#004d3d','#402910','#ff0000','#ffbffb','#f2b63d','#e5003d','#d90000','#266399','#46758c','#770080','#66000e','#00334d','#402031','#ff8800','#f26100','#79f2ca','#3939e6','#7b6cd9','#994d4d','#698c73','#468020','#665e4d','#4d3c39','#303f40','#00ffaa','#c2f200','#79eaf2','#e59173','#8f8fbf','#997387','#7f4400','#392080','#56592d','#330040','#003307'];
    var routes = [];

    for (var i = 0; i < data.length; i++) {
      var destData = data[i];

      console.log(destData);

      if (i==0) {
        routes.push(destData.Route);
      }
      else if (routes[routes.length-1]!=destData.Route) {
        routes.push(destData.Route);
      }
      
      color = colors_ls[destData.Route]

      // Add circles to map
      markers.push(L.circleMarker([destData.latitude, destData.longitude], {
        fillOpacity: 0.75,
        color: "black",
        weight: 1,
        fillColor: color,
        radius: 7, 
      }).bindPopup('<h6 style="font-family:arial; font-weight: bold;"> Route: ' + destData.Route + 
        '</h6> <hr> <h6 style="font-family:arial;">Dest. ID: ' + destData.dest_id + 
        '</h6> <h6 style="font-family:arial;">Address: ' + destData.address + 
        "</h6>"));
    }

    var markerLayer = L.layerGroup(markers);
    markerLayer.addTo(map);

    // Add legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var limits = routes;
    var colors = colors_ls.slice(0,routes.length);
    var labels = [];
    var routes_lbls = [];

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      routes_lbls.push("<li>" + limits[index] + "</li>");
    });

    // Add routes labels
    var legendInfo = "<h1></h1>" +
        "<div class=\"labels\">" +
        "<ul>" + routes_lbls.join("") + "</ul>" +
        "</div>";

    div.innerHTML = legendInfo;

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";    
    return div;
    };

    // Adding legend to the map
    legend.addTo(map);
  });
}


