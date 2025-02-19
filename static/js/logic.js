// Make a map object
let myMap = L.map("map", {
  center: [44.967243, -103.771556],
  zoom: 5,
});

// Create a satellite map background layer on top of the map object
// Make sure to define this one as the default map
let baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Add a dark theme map background 
let darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

// Add a simpler background theme to the map options
let basicLayer = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
  maxZoom: 20
});

// Add the satelite base layer to the baseMap object for default map population
baseLayer.addTo(myMap);

// Create an object to hold the different layers
let maps = {
  "Satellite": baseLayer,
  "Dark Map": darkLayer,
  "Basic Map": basicLayer
}

// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
let earthquakeLayer = L.layerGroup();
let tectonicPlatesLayer = L.layerGroup();

// Add a control to the map that will allow the user to change which layers are visible.
let overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

// Add both the map background options and the overlaying data plots in a control panel
L.control.layers(maps, overlayMaps, {collapsed: false}).addTo(myMap);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // Make a function that both pulls the relevent depth and magnitude for size and color, and plots each earthquake 
  function styleInfo(feature) {
    return{
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 1
    };
  }

  // Make a function to determine the color of the point being plotted
  function getColor(depth) {
    if (depth > 90) return "#990000";
    if (depth > 70) return "#cc3300";
    if (depth > 50) return "#ff6600";
    if (depth > 30) return "#ffcc00";
    if (depth > 10) return "#ccff33";
    return "#99ff99";
  }

  // Create a function to determine the size of the circle being plotted
  function getRadius(magnitude) {

    // Make sure to multiply the size for a visually easier way of discerning the data
    return magnitude > 0 ? magnitude * 3 : 1;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {

    // Turn each feature from the dataset into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
  
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
  
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `<strong>Location:</storng> ${feature.properties.place}<br>
        <storng>Magnitude:</strong> ${feature.properties.mag}<br>
        <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
      );
    }
  }).addTo(earthquakeLayer);

  // Add this layer to the map object
  earthquakeLayer.addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Add both the depth and magnitude legends to the legend object
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Apply background styling to the legend to make it pop
    div.style.background = "#cccccc";
    div.style.padding = "8px";
    div.style.border = "1px solid black";
    div.style.borderRadius = "5px";
    div.style.fontSize = "12px";
    div.style.hieght = "35vh";

    // Initialize depth intervals
    let depths = [-10, 10, 30, 50, 70, 90]; // The example picture starts at -10

    // Give the depth section a title for this part of the legend
    div.innerHTML += "<strong>Depth (km)</strong><br>";

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        // Call the getColor function while styling the background color
        `<i style="background: ${getColor(depths[i])}; width: 100%; height: 10px; display: inline-block;"></i>`
        + depths[i] + (depths[i + 1] ? " &ndash; " + depths[i + 1] + "<br>": "+");
    }

    // Now, repeat the same process for the magnitudes legend
    // Initialize magnitudes intervals
    let magnitudes = [5.4, 5.5, 6.0, 6.1, 6.9, 7.0, 7.9, 8.0]; // I got my intervals from https://www.mtu.edu/geo/community/seismology/learn/earthquake-measure/magnitude/

    // Give the magnitude section a title
    div.innerHTML += "<br><strong>Magnitude</strong><br>";

    // Loop through our magnitude intervals to generate circles sizes for each interval
    for (let i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        // Make sure to multiply the variables by the same amount found in the getRadius function
        `<i style="width: ${magnitudes[i] * 3}px; height: ${magnitudes[i] * 3}px; background: black; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>`
        + magnitudes[i] + "<br>";
    }

    return div;

  };

  // Add the legend to the map object
  legend.addTo(myMap);

});

// Make a request to get our Tectonic Plate geoJSON data.
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {

  // Use the geoJSON data to create a new layer to add to the map
  L.geoJson(plate_data, {
    color: "orange",
    weight: 2
  
  // Then add this layer to the value that I already created
  }).addTo(tectonicPlatesLayer);

});


