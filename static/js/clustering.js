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
    inputSize = 10;
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
    inputCargomax = 5;
  }

  console.log(inputCargomax);

  // Select the number of vehicules input field
  var inputVehicleFld = d3.select("#vehicle");

  // Get the value property of the input element
  var inputVehicle = inputVehicleFld.property("value");

  // Assign demo value if input size is empty
  if (inputVehicle == "") {
    inputVehicle = 2;
  }

  console.log(inputVehicle);

  // Map routes
  mapRoutes(inputSize, inputSeed, inputCargomax, inputVehicle);
});

function mapRoutes(size, seed, cargomax, vehicules) {

  // Perform a GET request to the URL
  var url = "/api/map/" + size + "/" + seed + "/" + cargomax + "/" + vehicules;
  d3.json(url, function(data) {

    for (var i = 0; i < data.length; i++) {
      var destData = data[i];

      console.log(destData);

      // Add circles to map
      L.circleMarker([destData.latitude, destData.longitude], {
        fillOpacity: 0.75,
        color: "black",
        weight: 1,
        fillColor: "blue",
        radius: 7, 
      }).bindPopup("<h3>Dest. ID:" + destData.dest_id + 
        "</h3> <hr> <h4>Address: " + destData.address + 
        "</h4>").addTo(map);
    }
  });
}

// Create the map object with options
var map = L.map("map-id", {
  worldCopyJump: true,
  center: [25.6753609, -100.3470249],
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