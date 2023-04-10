
var hMap = [];

// Wait for the Maps API to finish loading
window.addEventListener('load', function() {
  google.charts.load('current', {packages: ['corechart', 'table', 'geochart', 'map', 'visualization']});
  fetch('/static/crimedata/parsedNeighborhoods.json')
    .then(response => response.json())
    .then(data => {
      [data].forEach(item => {
        hMap.push({location: new google.maps.LatLng(item.latitude, item.longitude), weight: item.count});
        // Do something with each item in the JSON array
      });

      // Create the heatmap layer and set it on the map
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: hMap
      });
      heatmap.setMap(map);
    })
    .catch(error => console.error(error));
});
