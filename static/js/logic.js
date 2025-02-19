// Create the 'basemap' tile layer that will be the background of our map.
// Create the map object with center and zoom options.
let baseMap = L.map("map", {
  center: [44.967243, -103.771556],
  zoom: 5,
});

// Create the 'street' tile layer as a second background of the map
let baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Then add the 'basemap' tile layer to the map.
baseLayer.addTo(baseMap);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
let earthquakeLayer = L.layerGroup();
let tectonicPlatesLayer = L.layerGroup();

// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  console.log(data)

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return{
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90) return "#ff0000";
    if (depth > 70) return "#ff6600";
    if (depth > 50) return "#ffcc00";
    if (depth > 30) return "#ccff33";
    if (depth > 10) return "#66ff66";
    return "#00ff00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude > 0 ? magnitude * 3 : 1;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
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

  earthquakeLayer.addTo(baseMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Apply background styling to make it stand out
    div.style.background = "rgba(255, 255, 255, 0.8)";
    div.style.padding = "8px";
    div.style.border = "1px solid black";
    div.style.borderRadius = "5px";
    div.style.fontSize = "12px";

    // Initialize depth intervals and colors for the legend
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["#00ff00", "#66ff66", "#ccff33", "#ffcc00", "#ff6600", "#ff0000"];

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    div.innerHTML += "<strong>Depth (km)</strong><br>";
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        `<i style="background: ${colors[i]}; width: 10px; height: 10px; display: inline-block;"></i>`
        + depths[i] + (depths[i + 1] ? " &ndash; " + depths[i + 1] + "<br>": "+");
    }

    let magnitudes = [5.4, 5.5, 6.0, 6.1, 6.9, 7.0, 7.9, 8.0];
    div.innerHTML += "<br><strong>Magnitude</strong><br>";
    for (let i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        `<i style="width: ${magnitudes[i] * 3}px; height: ${magnitudes[i] * 3}px; background: black; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>`
        + magnitudes[i] + "<br>";
    }

    return div;
  };

  // Finally, add the legend to the map.
legend.addTo(baseMap);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.
    L.geoJson(plate_data, {
      color: "orange",
      weight: 2
    
    // Then add the tectonic_plates layer to the map.
    }).addTo(tectonicPlatesLayer);
  });

let overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

L.control.layers(null, overlayMaps, {collapsed: false}).addTo(baseMap);

});
