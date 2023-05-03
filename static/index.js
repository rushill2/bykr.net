// Main Page for Ryder static html
var map, infoWindow;
var ps;
var homemarker, destmarker;
var currPos;
//----------------------------------------------------------------------------------------------------------------------
// location constantly acquired here

document.getElementById("loading-indicator").style.display = "block";

const currentLocationPromise = new Promise((resolve, reject) => {
  if ("geolocation" in navigator) {
    // geolocation is available
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // update location
        document.getElementById("loading-indicator").style.display = "none";
        const { latitude, longitude } = position.coords;
        const currentLocation = new google.maps.LatLng(latitude, longitude);
        resolve(currentLocation);
      },
      (error) => {
        // handle errors
        document.getElementById("loading-indicator").style.display = "none";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        }
        reject(error);
      },
      {
        maximumAge: 30000, // 5 minutes in milliseconds
      }
    );
  } else {
    // geolocation is not available
    document.getElementById("loading-indicator").style.display = "none";
    console.log("Geolocation is not supported by this browser.");
    reject(new Error("Geolocation is not supported by this browser."));
  }
});


currentLocationPromise.then(function(currentLocation) {
  console.log("Current location: " + currentLocation.toString());
  // do something with currentLocation
}).catch(function(error) {
  console.log("Error getting current location: " + error.message);
});

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
  google.maps.event.addListenerOnce(window.mp, 'idle', function() {
    // Load the file with your heatmap code
    var script = document.createElement('script');
    script.src = '/static/crimeMap.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  });
  

  // Create an array to hold the features

// Load the JSON data from the file

fetch('/static/crimedata/parsedNeighborHoods.json')
.then(function(response) {
  return response.json();
})
.then(function(data) {
  var features = [];

  // Loop through the data and create Point features with the latitude and longitude coordinates
  for (var key in data) {
    var item = data[key];
    var coordinate = ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)]);
    var feature = new ol.Feature(new ol.geom.Point(coordinate));
    features.push(feature);
  }

  // Create a vector source with the features
  var vectorSource = new ol.source.Vector({
    features: features
  });

  // Create a heatmap layer
  var heatmapLayer = new ol.layer.Heatmap({
    source: vectorSource, // Set the source to the vector source
    radius: 7, // Set the radius of the heatmap points
    gradient: ['blue', 'lime', 'yellow', 'red'], // Set the gradient colors
    overlay: true
  });

  // Add the heatmap layer to the OpenLayers map
  var olMap = new ol.Map({
    target: 'map', // Set the target DOM element
    layers: [
      // Add any other layers you may have
      heatmapLayer // Add the heatmap layer
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-87.623177, 41.881832]), // Set the initial center
      zoom: 12 // Set the initial zoom level
    }),
    useInterimTilesOnError: false
  });

  // Disable interactions on the map
  olMap.getInteractions().clear();

  // Convert the OpenLayers map to a Google Maps overlay
  olMap.once('ready', function() {
    var olOverlay = new ol.Overlay({
      element: document.getElementById('mapOverlay'), // Use a different parent element
      position: ol.proj.fromLonLat([-87.623177, 41.881832]),
      positioning: 'center-center',
      stopEvent: true, // Allow events to propagate through the overlay
      insertFirst: false // Append the overlay element as the last child of its parent
    });

    // Set the position of the overlay element to be fixed
    olOverlay.getElement().style.position = 'fixed';

    // Set the map viewport to ignore pointer events
    olMap.getViewport().style.pointerEvents = 'auto';

    // Use the olMap instance as the map for the overlay
    olOverlay.setMap(window.mp);

    // Hide the overlay
    olOverlay.setPosition(undefined);

    // Disable pointer events on the heatmap layer's source
    heatmapLayer.getSource().set('pointerEvents', 'none');

    // Add an event listener to the overlay close button to re-enable the heatmap layer
    document.getElementById('closeOverlay').addEventListener('click', function() {
      olOverlay.setPosition(undefined);
      heatmapLayer.getSource().set('pointerEvents', 'none'); // Re-enable pointer events on the heatmap layer's source
    });
  });
})
.catch(function(error) {
  console.error('Error: ', error);
});


  // Add the heatmap layer to the map
  currentLocationPromise.then(function(currentLocation) {
    console.log("Current location: " + currentLocation.toString());
    // do something with currentLocation
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

    flag = 1
    try{
      var latlng = new google.maps.LatLng(currentLocation.lat(), currentLocation.lng());
      var pos = latlng;
      homemarker.setPosition(pos);
      homemarker.setVisible(true);
      window.mp.setCenter(pos);
      window.mp.panTo(pos);
    }
    catch(err){
      console.log(err);
    } 
  }).catch(function(error) {
    console.log("Error getting current location: " + error.message);
  });
  
  destmarker = new google.maps.Marker({map:window.mp});
  window.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, suppressBicyclingLayer: true});

  // Use the Promise to ensure the google.charts library is loaded 
}

//----------------------------------------------------------------------------------------------------------------------
/* Class of Start Ride functionality
   Purpose - Provide functionality to the Track and Get Directions buttons, with autocomplete for Get Directions.
*/

function findRoute(place){
    var coord = place.geometry.location;
    var dest;
    var l, ln;
    console.log('window.window.directionsDisplay:', window.directionsDisplay);
    var dest_coord;     // for get directions
    var el = document.getElementById("dest-text");
    console.log('findRoute window.directionsDisplay:', window.directionsDisplay);
    console.log('map:', window.mp);  
    document.getElementById('directions-form').setAttribute("style","height:400px");
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': el.value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK)
      {
        dest_coord = results[0].geometry.location;
        console.log('coord:', dest_coord);
        // get location of bike now
          destmarker = new google.maps.Marker({map:window.mp});
          destmarker.setPosition(dest_coord);
          destmarker.setVisible(true);
          destmarker.setMap(window.mp);
          document.getElementById('deets_cross').marker = destmarker;
          var latlngbounds = new google.maps.LatLngBounds();
          
          // scalr map
          // console.log(1, currentLocation.lat(), currentLocation.lng());
          currentLocationPromise.then(function(currentLocation) {
            console.log("Current location: " + currentLocation.toString());
            // do something with currentLocation
            console.log(2, currentLocation);
            var curr_coords = new google.maps.LatLng(currentLocation.lat(), currentLocation.lng());
            console.log('findroute curr', curr_coords);
            latlngbounds.extend(curr_coords);
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
            window.window.directionsDisplay.setMap(window.mp);
            console.log('location:', location);
            var request =  { 
            origin: curr_coords,
            destination: dest_coord,
            travelMode: google.maps.TravelMode.BICYCLING
              };
            window.window.directionsDisplay.setOptions({
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
          }).catch(function(error) {
            console.log("Error getting current location: " + error.message);
          });
         
        
      }
  });

}

//----------------------------------------------------------------------------------------------------------------------
/* Class of Suggest Ride functionality
   Purpose - Provide functionality to the table of nearby search buttons, with ratings and images.
*/


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


const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  // Use watchPosition instead.
  return navigator.geolocation.watchPosition(onSuccess, onError);
};


function tripDetails(place){
  console.log('place', place);
  var modal = document.getElementById("trip-details");
  const name = place.name;
  const address = place.formatted_address;
  const phone = place.formatted_phone_number;
  const website = place.website;
  const wheelchair = place.wheelchar_accessible_entrance;

  // Get references to the elements in the modal
  const nameEl = modal.querySelector(".place-name");
  const addressEl = modal.querySelector(".place-address");
  const phoneEl = modal.querySelector(".place-phone");
  const websiteE1 = modal.querySelector(".place-website");
  const wheelchairE1 = modal.querySelector(".place-wheelchair");
  var destmarker = new google.maps.Marker({map: window.mp});
  document.getElementById("cross-details").marker = destmarker;
  var dest_coord = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
  destmarker.setPosition(dest_coord);
  destmarker.setVisible(true);
  var latlngbounds = new google.maps.LatLngBounds();
  $.ajax({
    type: "GET",
    url: '/locate'
  }).done(function(data, response) {
    var curr_coord = new google.maps.LatLng(data.lat, data.lng);
    latlngbounds.extend(curr_coord);
    latlngbounds.extend(dest_coord);
    window.mp.fitBounds(latlngbounds);
    window.mp.setZoom(15)
  });
  

  // Populate the elements with the data
  nameEl.textContent = name;
  addressEl.textContent = address;
  phoneEl.textContent = phone;
  websiteE1.textContent = website
  websiteE1.href = website;
  wheelchairE1.textContent = wheelchair;
  const carouselDiv = document.querySelector('.swiper-container');
  const swiper = new Swiper(carouselDiv, {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  
  for (let i = 0; i < place.photos.length; i++) {
    const pic = place.photos[i];
    const img = document.createElement('img');
    postHelper(pic.photo_reference);
    img.onload = () => {
      img.src = './static/images/' + pic.photo_reference + '.jpg';
      img.className = 'insertedImg';
      carouselDiv.appendChild(img);
      // Update Swiper instance
      swiper.update();
    };
  
    img.onerror = (e) => {
      console.log('Error loading image: ', img.src, e);
    };
  }
  // Get the carousel slides
  const carouselSlides = document.querySelectorAll('.swiper-slide');
  
  // Populate the slides with images and captions
  carouselSlides.forEach((slide, index) => {
    slide.querySelector('img').src = './static/images/' + place.photos[index].photo_reference + '.jpg';
  });
  
  modal.style.display = 'block';
  
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