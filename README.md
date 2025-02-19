# leaflet-challenge
---

https://github.com/user-attachments/assets/dc3cd52b-b856-47e4-96c4-b621fb4f6cf0

I used this project to create a map of all earthquakes from the past 7 days from this [site](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) for easily discovering visual trends in the frequency of certain parameters of the earthquake. 

## Process
--- 

I started out by creating a [Leaflet](https://leafletjs.com/) layer for displaying a map. I then loaded in 3 different map backgrounds along with options for toggling earthquake and tectonic plate displays.

Next, I make a call to the data using [d3.json](https://www.geeksforgeeks.org/d3-js-json-function/) method. Then I created several functions inside this call that creates a circle for each point, calculates the color and size for each circle due to their depth and magnitude respectively, plots each earthquake with those parameters defined, and finally, binds popups to each point which display relevant information. I also used the same data to create a legend depicting how the colors and sizes are defined. I used [this](https://www.mtu.edu/geo/community/seismology/learn/earthquake-measure/magnitude/) to create the magnitude intervals. I then added the legend to the map object and created a new data call to [tectonic plate data](https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json). After receiving the plate data, I then added a new map layer to hold and plot this data.

## Citations
I used [this](https://www.mtu.edu/geo/community/seismology/learn/earthquake-measure/magnitude/) to check the meanings behind the magnitude values of earthquake effects which helped guide my magnitude legend on my map.

I found this [resource](https://leaflet-extras.github.io/leaflet-providers/preview/) after finding it in this [stack overflow chat](https://stackoverflow.com/questions/62923809/list-of-all-available-tile-layers-for-leaflet) to find complementary map backgrounds.
