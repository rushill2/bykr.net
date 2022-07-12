// Main Page for Ryder static html
var map, infoWindow;
var ps;

// gets the starting position of the marker.
if(flag==1){console.log(fetchit);}

//----------------------------------------------------------------------------------------------------------------------
// Map Init
/* Function - initMap
   Input - None
   Purpose - Initialize map with bike routes and the bike icon for indicator. */
window.initMap= function initMap() {

//  position = getCurrentPosition();
var sty = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]

var opt = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
}
  map = new google.maps.Map(document.getElementById("map"), opt);
  window.mp = map;
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

// tester
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
          ps = posi
          alert(posi.lat)
          $.ajax({
            type : "POST",
            url : "/post",
            data: {'data':posi, 'flag':'init'},
            dataType: 'json',
            success: function(result) {
                alert(posi.lng);
        },error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus); alert("Error: " + errorThrown);
    }
    });
        }

    function error(){
        alert("Error in transfer");}

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);



}
//----------------------------------------------------------------------------------------------------------------------
/* Class of Start Ride functionality
   Purpose - Provide functionality to the Track and Get Directions buttons, with autocomplete for Get Directions.
*/

/* Function Interface - start-btn
   Inputs - ps (original position of bike)
*/
document.getElementById("start-btn").onclick = function(ps){
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function error(){
        alert("Error in start ride");}

    function success(pos){
            alert(pos);
            $.ajax({
            type : "POST",
            url : "/post",
            data: {'data':pos, 'flag': 'const'},
            dataType: 'json',
            success: function(result) {
        },error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus); alert("Error: " + errorThrown);
    }
    });

    }
    navigator.geolocation.getCurrentPosition(success, error, options);

}

/* Function Interface - start-btn
   Inputs - None
   Purpose -  Handler for the modal popup.
*/
document.getElementById("start-btn").onclick = function() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  document.getElementById("directions-form").style.display = "none";
  var modal2 = document.getElementById("nearby-srch");
  modal2.style.display = "none";
}

/* Function Interface - cross
   Inputs - None
   Purpose -  Close button for popup
*/
document.getElementById("cross").onclick = function() {
  document.getElementById("myModal").style.display = "none";
}


/* Function Interface - dir-btn
   Inputs - None
   Purpose -  Directions form with suggestions
*/
document.getElementById("dir-btn").onclick = function() {
  var modal = document.getElementById("directions-form");
  modal.style.display = "block";
  document.getElementById("myModal").style.display = "none";
  const comp = new google.maps.places.Autocomplete(
      document.getElementById("dest-text"));

}

/* Function Interface - cross_dir
   Inputs - None
   Purpose -  Close button for directions form
*/
document.getElementById("cross_dir").onclick = function() {
  document.getElementById("directions-form").style.display = "none";
}

/* Function Interface - track-btn
   Inputs - map (map that is displayed on the webpage)
   Purpose - Start Tracking Session
*/
document.getElementById("track-btn").onclick = function(map){
   document.getElementById("directions-form").style.display = "none";
   document.getElementById("map").style.width = "400px";
   window.mp.setZoom(16);
}

//----------------------------------------------------------------------------------------------------------------------
/* Class of Suggest Ride functionality
   Purpose - Provide functionality to the table of nearby search buttons, with ratings and images.
*/

/* Function Interface - sugg-btn
   Inputs - None
   Purpose - Scrape Places API based on LatLng Bounds
*/
document.getElementById("sugg-btn").onclick = function(){
    var lt, ln;
    var dict = new Array();
    var save;
    lt = fetchit['lat'];
    ln = fetchit['lng'];
    const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lt},${ln}&radius=5000&sensor=true&type=park&rankBy=distance&key=AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA`

    // First get and parse the nearby regions
    fetch(URL).then(data=> {
      return data.json();
    }).then(jsonData => {

     for(var i=0; i<jsonData.results.length; i++){
        var res = jsonData.results[i];
        console.log(typeof res)
        setTimeout(function() {
         if(res['photos']){
            dict.push({'name': res.name, 'rating': res.rating, 'pic_id': res['photos'][0]['photo_reference']});
        }
        else{
            dict.push({'name': res.name, 'rating': res.rating});
        }
        }, 1000);
        console.log(dict[i])
    }
    }).catch(error=> {
      console.log(error);
    })
    // Now to put them onto a table in a modal
    var modal = document.getElementById("nearby-srch");
    modal.style.display = "block";

    // inserting into table
//       console.log("Entered loop");
//       console.log(dict);
//       var tbody = document.getElementById("sugg-entries")
//       var row = tbody.insertRow();
//       var cell = row.insertCell();
//       cell.innerHTML = dict[0]['name'];
//       console.log(value);
}
/* Function Interface - cross-srch
   Inputs - None
   Purpose - Close button for the suggestions
*/
document.getElementById("cross-srch").onclick = function() {
  document.getElementById("nearby-srch").style.display = "none";
}


// When the user clicks on the button, open the modal




//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}

/* Inputs- None;
   Outputs - None;
   Description - Handler for Get Directions button, that creates an autocomplete widget from google maps API */

