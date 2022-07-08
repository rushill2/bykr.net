// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

let map, infoWindow;
let followflag;
let ps;

function initMap() {

//  position = getCurrentPosition();

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    backgroundColor: '#000000'
  });




//  map.setMapTypeId(f542205a5d7ba6ac);
//  const legend = {
//    dgreen: {
//      name: "dgreen",
//      icon: iconBase + "parking_lot_maps.png",
//    },
//    lgreen: {
//      name: "lgreen",
//      icon: iconBase + "library_maps.png",
//    },
//    dash: {
//      name: "dash",
//      icon: iconBase + "info-i_maps.png",
//    },
//  };


   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };


          var marker = new google.maps.Marker({
                      position: pos,
                      map: map,
                      icon: {
                        url: "https://cdn.pixabay.com/photo/2014/04/03/10/53/bicycle-311656_960_720.png",
                        scaledSize: new google.maps.Size(60, 50),
                        fillOpacity: 1,
                        strokeWeight: 5,
                        fillColor: '#5384ED',
                        strokeColor: '#ffffff',
  },
});
          map.setCenter(pos);
          const bikeLayer = new google.maps.BicyclingLayer();
          bikeLayer.setMap(map);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
document.getElementById("recalib").onclick = function(){

    const pos = {
            lat: 0.0,
            lng: 0.0,
          };

    function success(pos){
        const posi = {
            lat: (pos.coords.latitude),
            lng: (pos.coords.longitude),
          };
          alert(posi.lat)
          $.ajax({
            type : "POST",
            url : "/",
            data: {'data':posi},
            dataType: 'json',
            success: function(result) {
                alert(posi.lng);
        },error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus); alert("Error: " + errorThrown);
    }
    });
        }

    function error(){
        alert("Error");}

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);



}
