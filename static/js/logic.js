function getColor(d) {
    return d > 5 ? 'lightcoral' :
        d > 4 ? 'lightsalmon' :
        d > 3 ? 'orange' :
        d > 2 ? 'gold' :
        d > 1 ? 'yellowgreen' :
        'greenyellow';
}

function createMap(quakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Grayscale": lightmap,
        "Satellite": satellitemap,
        "Outdoors": outdoorsmap
    };

    var overlayMaps = {
        "Earthquakes": quakes
    };

    var map = L.map("map", {
        center: [36.7949999, 10.0732369],
        zoom: 2,
        layers: [lightmap, satellitemap, outdoorsmap, quakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);


    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var mag = [0, 1, 2, 3, 4, 5];
        var labels = [];

        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // // Adding legend to the map
    legend.addTo(map);

}

function createMarkers(response) {

    var QuakeMarkers = [];
    var features = response.features;

    for (var i = 0; i < features.length; i++) {
        var coordinates = features[i].geometry.coordinates;

        var QuakeMarker = L.circleMarker([coordinates[1], coordinates[0]], {
            color: 'black',
            fillColor: getColor(features[i].properties.mag),
            weight: 0.4,
            opacity: 1,
            fillOpacity: 0.7,
            radius: features[i].properties.mag * 3
        }).bindPopup("<h3>" + features[i].properties.place + "<hr>Magnitude: " + features[i].properties.mag);


        QuakeMarkers.push(QuakeMarker);
    }

    createMap(L.layerGroup(QuakeMarkers));
}
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers)