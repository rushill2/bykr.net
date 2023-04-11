// heatmap.js

function generateHeatmap(data) {
  var hMap = [];
  data.forEach(item => {
    hMap.push({location: new google.maps.LatLng(item.latitude, item.longitude), weight: item.count});
    // Do something with each item in the JSON array
  });

  // Create the heatmap layer and set it on the map
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: hMap
  });
  heatmap.setMap(map);
}
