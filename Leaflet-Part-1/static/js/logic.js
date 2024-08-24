/************************************************************************
 Part 1: Create the Earthquake Visualization
 In this section I referenced Moduule 15.1  for the starting zoom level.
 ************************************************************************/
 
  // Create our map, giving it the streetmap and earthquakes layers to display on load. Reference Module 15- 10-Stu-GeoJson
 let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });
  
// Adding a tile layer (the background map image) to our map: Reference Module 15- 10-Stu-GeoJson
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// We use the addTo() method to add objects to our map.
}).addTo(myMap);

// Query the Geo Data for the earthquake data.  ("All Earthquakes from the Past 7 Days") JSON representation of the data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Load the GEOJSON data with D3 and then create markers on map: Reference Module 15- 10-Stu-GeoJson
d3.json(geoData).then(function (data) {

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Call the pointToLayer function
        pointToLayer: function(feature, coordinates){ 
            // Create marker's style
            return L.circleMarker(coordinates, {    
                // Call the markerSize() function 
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.5,
                fillOpacity: 0.5
            });
        },

        // Popup additional Information for each marker
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.title}</h3><hr>
            <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
            <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(myMap);

    // Set up the legend
    let legend = L.control({position: "bottomright"});

    // Generate legend information. Reference Module 15- 10-Stu-GeoJson
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        // Define legend labels and colors, respectively
        let labels = ["< -10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        // Reference https://www.w3schools.com/colors/colors_picker.asp for colors
        let colors = ["#00ff00", "#ccff33", "#ffd700", "#ffa500", "#ff8c00", "#dc143c"];
        
        // Iterate labels and colors to create the legend items. Reference Module 15- 10-Stu-GeoJson
        for (let i = 0; i < labels.length; i++){
            div.innerHTML += `<i style=\"background:${colors[i]}"></i>${labels[i]}<br>`;
        }
        return div;
    };
    // Add the legend to the map
    legend.addTo(myMap);
});

// Define a function to determine the marker size based on the earthquake magnitude: Reference Module 15- 10-Stu-GeoJson
function markerSize(magnitude) {
    return magnitude * 3;
}

// Define a function to determine the marker color based on the earthquake depth. Reference Module 15- 10-Stu-GeoJson
// Reference https://www.w3schools.com/colors/colors_picker.asp for colors
function markerColor(depth) {
    if (depth >= 90)return "#dc143c";
    else if (depth >= 70) return "#ff8c00";
    else if (depth >= 50) return "#ffa500";
    else if (depth >= 30) return "#ffd700";
    else if (depth >= 10) return "#ccff33";
    else return "#00ff00";
}


