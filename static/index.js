// Main Page for Ryder static html
var map, infoWindow;
var ps;
var homemarker, destmarker;
var directionsDisplay;
var currPos;
//----------------------------------------------------------------------------------------------------------------------
// handle logger

//----------------------------------------------------------------------------------------------------------------------
// Map Init
/* Function - initMap
   Input - None
   Purpose - Initialize map with bike routes and the bike icon for indicator. */

   // refactor this to assign all variables here and then call the function that does this stuff
function initMap() {
  var opt = {
    zoom: 14,
    clickableIcons: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }
  window.mp = new google.maps.Map(document.getElementById("map"), opt);
  homemarker = new google.maps.Marker({
    icon: {url: "https://cdn.pixabay.com/photo/2014/04/03/10/53/bicycle-311656_960_720.png",
      scaledSize: new google.maps.Size(60, 50),
      fillOpacity: 1,
      strokeWeight: 5,
      fillColor: '#5384ED',
      strokeColor: '#ffffff',
    }, 
    map: window.mp
  });
  destmarker = new google.maps.Marker({map:window.mp});
  window.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, suppressBicyclingLayer: true});

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

  $.ajax({
    url: "/locate",
  }).done(function(res, data) {
    var fetchit = res;
    flag = 1
    try{
      var latlng = new google.maps.LatLng(fetchit.lat, fetchit.lng);
      window.mp.setCenter(latlng);
      currPos = fetchit;
      var pos = latlng;
      console.log('pos', res);
      homemarker.setPosition(pos);
      homemarker.setVisible(true);
      window.mp.setCenter(pos);
      window.mp.panTo(pos);
    }
    catch(err){
      console.log(err);
    } 
    });
    console.log(document.getElementById('bike-routes').style);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(window.mp);
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
    document.getElementById("suggest").style.visibility = "hidden";

    function error(){
        alert("Error in start ride");}

    function success(pos){
            $.ajax({
            type : "POST",
            contentType: "application/json", 
            url : "/post",
            dataType: "json",
            data: JSON.stringify({'data':pos, 'flag': 'const'}),
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
  document.getElementById("suggest").style.visibility = "visible";
  directionsDisplay.setMap(null);
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
    // get the actual latitude and longitude from the place name
    var place1 = comp.getPlace();
    usearr = fetchmoredeets(place1.name);
    console.log('usearr:', usearr);
    destmarker = new google.maps.Marker({map:window.mp});
    destmarker.setPosition(place1.geometry.location);
    destmarker.setVisible(true);
    findRoute(place1.geometry.location);
  }
}

function findRoute(coord){
    var dest;
    var l, ln;
    console.log('window.directionsDisplay:', window.directionsDisplay);
    var dest_coord;     // for get directions
    var el = document.getElementById("dest-text");
    console.log('findRoute directionsdisplay:', window.directionsDisplay);
    console.log('map:', window.mp);  
    document.getElementById('directions-form').setAttribute("style","height:400px");
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': el.value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK)
      {
        dest_coord = results[0].geometry.location;
        console.log('dest_coord:', dest_coord);
        // get location of bike now
        $.ajax({
          type:'GET', 
          url: '/locate'
        }).done(function(location, status){
          console.log(location, status);
          destmarker = new google.maps.Marker({map:window.mp});
          destmarker.setPosition(dest_coord);
          destmarker.setVisible(true);
          destmarker.setMap(window.mp);
          var latlngbounds = new google.maps.LatLngBounds();
          
          // scalr map
          var curr_coords = new google.maps.LatLng(location.lat, location.lng);
          console.log(curr_coords);
          latlngbounds.extend(curr_coords);
          console.log(dest_coord);
          latlngbounds.extend(dest_coord);
          window.mp.fitBounds(latlngbounds);

          // call directions service
          var directionsService = new google.maps.DirectionsService();

          document.getElementById("directions-form").style.display = "none";
          document.getElementById("deets-modal").style.display = "block";
          var deetsreq = {
            placeId: "ChIJ7XUlvEHXDIgRZ-s1ZkNU2yg",
            fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'international_phone_number', 'address_component']
          };

          // send places service request
          var service = new google.maps.places.PlacesService(window.mp);
          // service.getDetails(deetsreq, callback);
          window.directionsDisplay.setMap(window.mp);
          console.log('location:', location);
          var request =  { 
          origin: curr_coords,
          destination: dest_coord,
          travelMode: google.maps.TravelMode.BICYCLING
            };
          window.directionsDisplay.setOptions({
            polylineOptions: {
              strokeColor: 'green',
            }
          });
          // actual directions
          directionsService.route(request, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  window.directionsDisplay.setDirections(response);
                  window.directionsDisplay.setMap(window.mp);
              }
    });
        });
        
      }
    });

}



/* Function Interface - cross_dir
   Inputs - None
   Purpose -  Close button for directions form
*/
document.getElementById("cross-dir").onclick = function() {
  document.getElementById("directions-form").style.display = "none";

}

document.getElementById("cross-details").onclick = function() {
  document.getElementById("trip-details").style.display = "none";

  document.getElementById("start").style.visibility = "visible";
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
    var dict = new Array();
    var lt, ln;
    document.getElementById("start").style.visibility = "hidden";
    $.ajax({
      url: "/locate"
    }).done(function(res, data) {
      lt = res['lat'];
      ln = res['lng'];
      
      // gets list of nearby places for suggestions
      var suggestions;
      $.ajax({
        url: "/nearby"
    }).done(function(res, data) {
      // once we have the list of nearby places
        suggestions = res;
        var req = suggestions;
      // get basic data from here
        for(var i=0; i<req.results.length; i++){
          var res = req.results[i];
          try{
            if(res['photos'] && res['opening_hours']){
                dict.push({'place_id': res.place_id, 'name': res.name, 'rating': res.rating, 'icon': res['icon'], 'open_now': res.opening_hours.open_now});
            }
            else if(res['opening_hours']){
                dict.push({'place_id': res.place_id,'name': res.name, 'rating': res.rating, 'pic_id': res.opening_hours.open_now});
            }
            else{
                dict.push({'place_id': res.place_id,'name': res.name, 'rating': res.rating});
          }}
          catch(err){
            console.log(err);
          }
        // insert into the table
        var tbody = document.getElementById("sugg-entries")
        var row = tbody.insertRow();
        row.id = 'suggestion'.concat(String(i));
        var cell_name = row.insertCell();
        var cell_rating = row.insertCell();
        var cell_hours = row.insertCell();
        cell_name.innerHTML = dict[i]['name'];
        cell_rating.innerHTML = dict[i]['rating'];
        cell_hours.innerHTML = dict[i]['open_now'];
        var tbl = document.getElementById("near-tbl");
        var rows = tbl.getElementsByTagName("tr");
        }
        for (i = 0; i < rows.length; i++) {
          var currentRow = tbl.rows[i];
          // // responsible for highlighting hovered row
          // if (currentRow.id != 'desc-row'){
          //   currentRow.onmouseover = function() {
          //     this.style.backgroundColor = "#00000046";
          //   }
          //   currentRow.onmouseout = function() {
          //     this.style.backgroundColor = rgba(0,0,0,0.5);  
          //   }
          // }
          
          var createClickHandler = function(row, cnt) {
            return function() {
              console.log("createClickHandler");
              var cell = row.getElementsByTagName("td");
              modal.style.display = "none";
              // make call to places details for maps api from backend
              var place_id = dict[cnt-1].place_id;
              // send clicked place to backed, so we can get the place details
              $.ajax({
                type : "POST",
                url : "/post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({pid:place_id, flag: 'place_details'}),
                success: function(result) {
                  console.log(result);
                  $.ajax({
                    type: 'GET',
                    url: '/details'
                  }).done(function(res, data) {
                    // get the place details and create info page
                    // console.log(data, res.result);
                    var detailspopup = document.getElementById("trip-details"); 
                    detailspopup.style.display = "block";
                    tripDetails(res.result);

                  })
                },error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log("ERRRR");
            }
                });
            };
          };
          currentRow.onclick = createClickHandler(currentRow, i);
        }


      });
      // table display
      var modal = document.getElementById("nearby-srch");
      modal.style.display = "block";
    });
    
}


/* Function Interface - cross-srch
   Inputs - None
   Purpose - Close button for the suggestions
*/
document.getElementById("cross-srch").onclick = function() {
  document.getElementById("nearby-srch").style.display = "none";
  document.getElementById("start").style.visibility = "visible";

}

document.getElementById("deets_cross").onclick = function() {
    document.getElementById("rating").innerHTML = '';
    document.getElementById("phone").innerHTML = '';
    document.getElementById("addr").innerHTML = '';
    document.getElementById("deets-modal").style.display = "none";

}

document.getElementById("stop-trip").onclick = function() {
  var infomodal = document.getElementById("deets-modal");
  infomodal.style.display = "none";
  var detailspopup = document.getElementById("trip-details"); 
  detailspopup.style.display = "block";
  // document.getElementById("deets-modal").style.display = "none";
  // destmarker = new google.maps.Marker({map:window.mp});
  // destmarker.setVisible(false);
  // directionsDisplay.setMap(null);
  // window.mp.setCenter(homemarker.position);
}

/* Inputs- None;
   Outputs - None;
   Description - Handler for Get Directions button, that creates an autocomplete widget from google maps API */


function fetchmoredeets(addr) {
    var loc = addr.split(' ').join('+')
    console.log(loc);
    // replace with backend api call
    try{
      $.ajax({
        type : "POST",
        url : "/post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({place_name:loc, flag: 'place_name'}),
        success: function(result) {
          // console.log(result);
          $.ajax({
            type: 'GET',
            url: '/details'
          }).done(function(res, data) {
            // get the place details and create info page
            
            // console.log("fetchmoredeets", res, data);
            var picref;
            // console.log(res.results[0].place_id);
            var deetsreq = {placeId: res.results[0].place_id};

            var service = new google.maps.places.PlacesService(window.mp);
            service.getDetails(deetsreq, callback);


            function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                      document.getElementById("addr").innerHTML  =  "Address: " + place.address_components[1].short_name + ' ' + place.address_components[2].short_name; // addr
                      document.getElementById("rating").innerHTML = "Rating: " + place.rating;
                      var ref = place.photos[0].getUrl();
                      document.getElementById("loc-img").src = ref;
                if(place.formatted_phone_number==null){
                    document.getElementById("phone").innerHTML= "Phone Number: NA";
                }
                else{
                    document.getElementById("phone").innerHTML= "Phone Number: " + place.international_phone_number;
                }
              }
            }
            return res.results;
            // var detailspopup = document.getElementById("sugg-details"); 
            // detailspopup.style.display = "block";
          }).fail(function(err){
            console.log('fetchmoredeets error:', err);
          })
        },error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown, textStatus);
    }
        });
    }
    catch(err){
      console.log('fetch error:', err);
    }
    
    

}
/* Function Interface - bike-route-btn
   Inputs - None
   Outputs - None;
   Description - Toggle for showing bike routes */
var bikeLayer;
var layerCnt = 0;
document.getElementById("bike-routes-btn").onclick=function(){
    // implies show bike routes
    if (layerCnt % 2 == 0) {
      document.getElementById('bike-routes-btn').innerHTML= "Hide Bike Routes";
      try{
        bikeLayer = new google.maps.BicyclingLayer();
        bikeLayer.setMap(window.mp);
      }
      catch(err){
        console.log(err);
      }
      
    }
    else {
      document.getElementById('bike-routes-btn').innerHTML= "Show Bike Routes";
      try{
        bikeLayer.setMap(null);
      }
      catch(err){
        console.log(err);
      }
    }
    layerCnt++;
}


const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  // Use watchPosition instead.
  return navigator.geolocation.watchPosition(onSuccess, onError);
};

// document.getElementById("recenter").onclick=function(){
//     var latlng = new google.maps.LatLng(fetchit.lat, fetchit.lng);
//     window.mp.setCenter(latlng, 20);
// }

document.getElementById("logo").onclick=function(){
  window.location.href = '/';
  window.location.reload();
}

function tripDetails(place){
  console.log('place', place);
  var modal = document.getElementById("trip-details");
  const name = place.name;
  const address = place.formatted_address;
  const phone = place.formatted_phone_number;
  const summary = place.editorial_summary.overview;
  const website = place.website;
  const wheelchair = place.wheelchar_accessible_entrance;

  // Get references to the elements in the modal
  const nameEl = modal.querySelector(".place-name");
  const addressEl = modal.querySelector(".place-address");
  const phoneEl = modal.querySelector(".place-phone");
  const summaryEl = modal.querySelector(".place-summary");
  const websiteE1 = modal.querySelector(".place-website");
  const wheelchairE1 = modal.querySelector(".place-wheelchair");
  var destmarker = new google.maps.Marker({map: window.mp});
  destmarker.setPosition(new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng));
  destmarker.setVisible(true);
  var latlngbounds = new google.maps.LatLngBounds();
  var dest_coord = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
  // latlngbounds.extend(curr_coords);
  latlngbounds.extend(dest_coord);
  window.mp.fitBounds(latlngbounds);
  window.mp.setZoom(15)

  // Populate the elements with the data
  nameEl.textContent = name;
  addressEl.textContent = address;
  phoneEl.textContent = phone;
  summaryEl.textContent = summary;
  websiteE1.textContent = website;
  websiteE1.href = website;
  wheelchairE1.textContent = wheelchair;

  $(document).ready(function() {
  const carouselDiv = document.getElementById('carousel');

  var carousel = document.querySelector('.owl-carousel');

// Initialize the Owl Carousel plugin
  $(carousel).owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
    }
});
  });
  const carouselDiv = document.getElementById('carousel');
  for (let i = 0; i < place.photos.length; i++) {
    var pic = place.photos[i];
    const img = document.createElement('img');
    postHelper(pic.photo_reference)
    try{
        
        img.setAttribute('src', './static/images/' + pic.photo_reference + '.jpg');
        // Add the image element to the carousel
        carouselDiv.appendChild(img);
                }
    catch(err){
      console.log(err);
    }

}


  var carousel = document.querySelector('.owl-carousel');

// Initialize the Owl Carousel plugin
  $(carousel).owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
    }
});
  // Open the modal
  modal.style.display = "block";


}

function postHelper(data=null){
  $.ajax({
    type : "POST",
    contentType: "application/json", 
    url : '/post',
    dataType: "json",
    data: JSON.stringify({'data':data, 'flag': 'get_images'}),
    success: function(result) {
      return;
},error: function(XMLHttpRequest, textStatus, errorThrown) {
  console.log("Status: " + textStatus);
  console.log("Error: " + errorThrown);
}
});
}