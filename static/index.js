// Main Page for Ryder static html
//----------------------------------------------------------------------------------------------------------------------
// location constantly acquired here

document.getElementById("loading-indicator").style.display = "block";

if ('geolocation' in navigator) {
  const options = {
    enableHighAccuracy: true,
    timeout: Infinity,
    maximumAge: 0
  };

  const currentLocationPromise = new Promise((resolve, reject) => {
    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      document.getElementById("loading-indicator").style.display = "none";
      var latlng = new google.maps.LatLng(latitude, longitude);
      if (window.homemarker){
        window.homemarker.setPosition(latlng);
      }
      else{
        window.homemarker = new google.maps.Marker({
          icon: {
            url: "https://cdn.pixabay.com/photo/2014/04/03/10/53/bicycle-311656_960_720.png",
            scaledSize: new google.maps.Size(60, 50),
            fillOpacity: 1,
            strokeWeight: 5,
            fillColor: '#5384ED',
            strokeColor: '#ffffff',
          },
          map: window.mp
        });
      }
      const data = { latitude, longitude };
      $.ajax({
        type: "POST",
        url: "/location_daemon",
        data: JSON.stringify(data),
        contentType: "application/json",
        error: function(error) {
          console.error("Failed to update location:", error);
        }
      });
      resolve(position);
    };

    const onError = (error) => {
      console.error(`Error getting location: ${error.message}`);
      reject(error);
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
  });

  window.currentLocationPromise = currentLocationPromise;
} else {
  console.error('Geolocation is not supported by this browser.');
  // Handle lack of geolocation support appropriately
}

//----------------------------------------------------------------------------------------------------------------------
// Map Init
/* Function - initMap
   Input - None
   Purpose - Initialize map with bike routes and the bike icon for indicator. */

 window.initMap=function() {
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
}


  // Create an array to hold the features

// Load the JSON data from the file

// fetch('/static/crimedata/parsedNeighborHoods.json')
// .then(function(response) {
//   return response.json();
// })
// .then(function(data) {
//   var features = [];

//   // Loop through the data and create Point features with the latitude and longitude coordinates
//   for (var key in data) {
//     var item = data[key];
//     var coordinate = ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)]);
//     var feature = new ol.Feature(new ol.geom.Point(coordinate));
//     features.push(feature);
//   }

//   // Create a vector source with the features
//   var vectorSource = new ol.source.Vector({
//     features: features
//   });

//   // Create a heatmap layer
//   var heatmapLayer = new ol.layer.Heatmap({
//     source: vectorSource, // Set the source to the vector source
//     radius: 7, // Set the radius of the heatmap points
//     gradient: ['blue', 'lime', 'yellow', 'red'], // Set the gradient colors
//     overlay: true,
//   });

//   // Add the heatmap layer to the OpenLayers map
//   var olMap = new ol.Map({
//     target: 'map', // Set the target DOM element
//     layers: [
//       // Add any other layers you may have
//       heatmapLayer // Add the heatmap layer
//     ],
//     view: new ol.View({
//       center: ol.proj.fromLonLat([-87.623177, 41.881832]), // Set the initial center
//       zoom: 12 // Set the initial zoom level
//     }),
//     useInterimTilesOnError: false
//   });

//   // Disable interactions on the map
//   olMap.getInteractions().clear();

//   // Convert the OpenLayers map to a Google Maps overlay
//   olMap.once('ready', function() {
//     window.olOverlay = new ol.Overlay({
//       element: document.getElementById('mapOverlay'), // Use a different parent element
//       position: ol.proj.fromLonLat([-87.623177, 41.881832]),
//       positioning: 'center-center',
//       stopEvent: true, // Allow events to propagate through the overlay
//       insertFirst: false // Append the overlay element as the last child of its parent
//     });

//     // Set the position of the overlay element to be fixed
//     window.olOverlay.getElement().style.position = 'fixed';

//     // Set the map viewport to ignore pointer events
//     olMap.getViewport().style.pointerEvents = 'auto';

//     // Use the olMap instance as the map for the overlay
//     window.olOverlay.setMap(window.mp);

//     // Hide the overlay
//     window.olOverlay.setPosition(undefined);

//     // Disable pointer events on the heatmap layer's source
//     heatmapLayer.getSource().set('pointerEvents', 'none');

//     // Add an event listener to the overlay close button to re-enable the heatmap layer
//     document.getElementById('closeOverlay').addEventListener('click', function() {
//       window.olOverlay.setPosition(undefined);
//       heatmapLayer.getSource().set('pointerEvents', 'none'); // Re-enable pointer events on the heatmap layer's source
//     });
//   });
// })
// .catch(function(error) {
//   console.error('Error: ', error);
// });


// Add the heatmap layer to the map
window.currentLocationPromise.then(function(position) {
  const { latitude, longitude } = position.coords;
  document.getElementById('markers').marker = new google.maps.Marker({map:window.mp});
  window.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, suppressBicyclingLayer: true});
  try{
    var latlng = new google.maps.LatLng(latitude, longitude);
    var pos = latlng;
    // console.log('locationPromise pos: ' + pos);
    window.homemarker.setPosition(pos);
    window.homemarker.setVisible(true);
    window.mp.setCenter(pos);
    window.mp.panTo(pos);
  }
  catch(err){
    console.error(err);
  }
}).catch(function(error) {
  console.error(" LocationPromise Error getting current location: " + error.message);
});



//----------------------------------------------------------------------------------------------------------------------
/* Class of Start Ride functionality
   Purpose - Provide functionality to the Track and Get Directions buttons, with autocomplete for Get Directions.
*/

window.findRoute = function(place){
    var coord = place.geometry.location;
    var dest;
    var l, ln;
    var dest_coord;     // for get directions
    var el = document.getElementById("dest-text");
    document.getElementById('directions-form').setAttribute("style","height:400px");
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': el.value}, function(results, status) {
      console.log("status: " + status)
      if (status == google.maps.GeocoderStatus.OK)
      {
        dest_coord = results[0].geometry.location;
        console.log('coord:', dest_coord);
        // get location of bike now
          document.getElementById('markers').marker = new google.maps.Marker({map:window.mp});
          document.getElementById('markers').marker.setPosition(dest_coord);
          document.getElementById('markers').marker.setVisible(true);
          document.getElementById('markers').marker.setMap(window.mp);
          var latlngbounds = new google.maps.LatLngBounds();
          
          // scalr map
          // console.log(1, currentLocation.lat(), currentLocation.lng());
          window.currentLocationPromise.then(function(currentLocation) {
            // do something with currentLocation
            var curr_coords = new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude);
            latlngbounds.extend(curr_coords);
            latlngbounds.extend(dest_coord);
            window.mp.fitBounds(latlngbounds);
  
            // call directions service
            var directionsService = new google.maps.DirectionsService();
  
            document.getElementById("directions-form").style.display = "none";
            var deetsreq = {
              placeId: "ChIJ7XUlvEHXDIgRZ-s1ZkNU2yg",
              fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'international_phone_number', 'address_component']
            };
  
            // send places service request
            var service = new google.maps.places.PlacesService(window.mp);
            // service.getDetails(deetsreq, callback);
            window.window.directionsDisplay.setMap(window.mp);
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
            console.error("findRoute Error getting current location: " + error.message);
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


window.additionalDetails = function(addr) {
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


window.tripDetails = function(place){
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
  document.getElementById('markers').marker = new google.maps.Marker({map: window.mp});
  var dest_coord = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
  document.getElementById('markers').marker.setPosition(dest_coord);
  document.getElementById('markers').marker.setVisible(true);
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
