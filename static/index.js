// Main Page for Ryder static html


var map, infoWindow;
var ps;
var homemarker, destmarker;
var directionsDisplay;

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
    center: latlng,
    zoom: 14,
    clickableIcons: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
}

  var latlng = new google.maps.LatLng(fetchit.lat, fetchit.lng);
  map = new google.maps.Map(document.getElementById("map"), opt);
  window.mp = map;
  var lat_coord = fetchit.lat;
  var lng_coord = fetchit.lng;
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, suppressBicyclingLayer: true});
  destmarker = new google.maps.Marker({position: null,map: map});
  destmarker.setVisible(false);
  const pos = latlng;
  homemarker = new google.maps.Marker({
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
  map.panTo(pos);

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
document.getElementById("dir-btn").onclick = function(map) {
  document.getElementById("dest-text").value = "";
  var modal = document.getElementById("directions-form");
  var loc;
  var usearr = [];
  modal.style.display = "block";
  document.getElementById("myModal").style.display = "none";
  const comp = new google.maps.places.Autocomplete(document.getElementById("dest-text"));
  comp.addListener('place_changed', fillInAddress);
                function fillInAddress() {
                    var place1 = comp.getPlace();
                    var param = document.getElementById("dest-text").value;
                    usearr = fetchmoredeets(param);
                    console.log(usearr)
                    destmarker.position = place1.geometry.location;
                    findRoute(place1.geometry.location, usearr);

                }


}

function findRoute(coord, usearr){
    var dest;
    var l, ln;
    var dest_coord;     // for get directions
    var el = document.getElementById("dest-text");

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': el.value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK)
      {
        dest_coord = results[0].geometry.location;
        destmarker.setPosition(dest_coord);
        destmarker.setVisible(true);
        destmarker.setMap(map);
        var latlngbounds = new google.maps.LatLngBounds();
        latlngbounds.extend(homemarker.position);
        latlngbounds.extend(destmarker.position);
        map.fitBounds(latlngbounds);
        var directionsService = new google.maps.DirectionsService();
        var revsearch;

          document.getElementById("directions-form").style.display = "none";
          document.getElementById("deets-modal").style.display = "block";
            var deetsreq = {
              placeId: "ChIJ7XUlvEHXDIgRZ-s1ZkNU2yg",
              fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'international_phone_number', 'address_component']
            };

            var service = new google.maps.places.PlacesService(map);
            service.getDetails(deetsreq, callback);

            function callback(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {


              }
            }



        directionsDisplay.setMap(map);
        var send = new google.maps.LatLng(coord['lat'], coord['lng']);
        var test = new google.maps.LatLng(fetchit['lat'], fetchit['lng']);



        var request = {
                origin: homemarker.position,
                destination: destmarker.position,
                travelMode: google.maps.TravelMode.BICYCLING
            };
        directionsDisplay.setOptions({
          polylineOptions: {
            strokeColor: 'red',
          }
        });
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
            }
        });
      }
    });

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
    const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lt},${ln}&radius=5000&sensor=true&type=park&rankBy=distance&key=AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA`
    // First get and parse the nearby regions

    async function fetcher(URL){
        const resp = await fetch(URL);
        return await resp.json()
    }

    var res, req;
    (async () => {
      req = await fetcher(URL);
      res = req.results;
      console.log(res);
      for(var i=0; i<req.results.length; i++){
        var res = req.results[i];
        if(res['photos'] && res['opening_hours']){
            dict.push({'name': res.name, 'rating': res.rating, 'pic_id': res['photos'][0]['photo_reference'], 'open_now': res.opening_hours.open_now});
        }
        else if(res['opening_hours']){
             dict.push({'name': res.name, 'rating': res.rating, 'pic_id': res.opening_hours.open_now});
        }
        else{
            dict.push({'name': res.name, 'rating': res.rating});
        }
      console.log(dict)

      console.log(dict.length);
      var tbody = document.getElementById("sugg-entries")
      var row = tbody.insertRow();
      var cell_name = row.insertCell();
      var cell_rating = row.insertCell();
      var cell_hours = row.insertCell();
      cell_name.innerHTML = dict[i]['name'];
      cell_rating.innerHTML = dict[i]['rating'];
      cell_hours.innerHTML = dict[i]['open_now'];

    }
})()

    var modal = document.getElementById("nearby-srch");
    modal.style.display = "block";
}

/* Function Interface - cross-srch
   Inputs - None
   Purpose - Close button for the suggestions
*/
document.getElementById("cross-srch").onclick = function() {
  document.getElementById("nearby-srch").style.display = "none";
}

document.getElementById("deets_cross").onclick = function() {
    document.getElementById("rating").innerHTML = '';
    document.getElementById("phone").innerHTML = '';
    document.getElementById("addr").innerHTML = '';
    document.getElementById("deets-modal").style.display = "none";

}

document.getElementById("stop-trip").onclick = function() {
  document.getElementById("deets-modal").style.display = "none";
  destmarker.setVisible(false);
  directionsDisplay.setMap(null);
  map.setCenter(homemarker.position);
}

/* Inputs- None;
   Outputs - None;
   Description - Handler for Get Directions button, that creates an autocomplete widget from google maps API */


function fetchmoredeets(addr) {
    var loc = addr.split(' ').join('+')
    const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${loc}&key=AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA`
    // First get and parse the nearby regions

    async function fetcher(URL){
        const resp = await fetch(URL);
        return await resp.json()
    }

    var res, req;
    var picref;
    (async () => {
      req = await fetcher(URL);
      res = req.results;
      var deetsreq = {placeId: res[0].place_id};

      var service = new google.maps.places.PlacesService(map);
      service.getDetails(deetsreq, callback);


      function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
                document.getElementById("addr").innerHTML  =  "Address: " + place.address_components[1].short_name + ' ' + place.address_components[2].short_name; // addr
                document.getElementById("rating").innerHTML = "Rating: " + place.rating;
                var ref = place.photos[0].getUrl();
//                console.log("photos:", )
                document.getElementById("loc-img").src = ref;
                if(place.formatted_phone_number==null){
                    document.getElementById("phone").innerHTML= "Phone Number: NA";
                }
                else{
                    document.getElementById("phone").innerHTML= "Phone Number: " + place.international_phone_number;
                }
//                var url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA`

              }
            }
          }
        )()
}

var bikeLayer;
document.getElementById("recalib").onclick=function(){
    bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
}

document.getElementById("remove-bike").onclick=function(){
    bikeLayer.setMap(null);
}

const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  // Use watchPosition instead.
  return navigator.geolocation.watchPosition(onSuccess, onError);
};

document.getElementById("recenter").onclick=function(){
    var latlng = new google.maps.LatLng(fetchit.lat, fetchit.lng);
    map.setCenter(latlng, 20);
}