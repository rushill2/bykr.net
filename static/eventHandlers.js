
document.getElementById("cross-srch").onclick = function() {
    document.getElementById("nearby-srch").style.display = "none";
    document.getElementById("start").style.visibility = "visible";
  }
  
  document.getElementById("deets_cross").onclick = function() {
      document.getElementById('markers').marker.setMap(null);
      window.directionsDisplay.setMap(null);
      document.getElementById("deets-modal").style.display = "none";
  
  }
  
  let startTime;
  let timerInterval;
  
  // Function to start the timer
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
  }
  
  // Function to update the timer
  function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const formattedTime = formatTime(elapsedTime);
    document.getElementById("timer").textContent = "Time elapsed: " + formattedTime;
  }
  
  // Function to format the time
  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  
    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedHours = hours.toString().padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  // Call startTimer function whenever you want to start the timer  

  document.getElementById("go-to-details").onclick = function() {
    var infomodal = document.getElementById("deets-modal");
    var tripWindow = document.getElementById("trip-modal");
    tripWindow.style.display = "block";

    infomodal.style.display = "none";
    document.getElementById("suggest").style.visibility = "visible";
    window.tripDetails(document.getElementById("go-to-details").loc);

    var detailspopup = document.getElementById("trip-details");
    window.mp.setCenter(window.homemarker.getC)
    detailspopup.style.display = "block";
    console.log("Reached formatTime");
  }


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

    document.getElementById("logo").onclick=function(){
        window.location.href = '/';
        window.location.reload();
      }

    /* Function Interface - track-btn
   Inputs - map (map that is displayed on the webpage)
   Purpose - Start Tracking Session
*/
    document.getElementById("track-btn").onclick = function(map){
        document.getElementById("directions-form").style.display = "none";
        // document.getElementById("map").style.width = "400px";
        window.mp.setZoom(16);
    }

    /* Function Interface - cross_dir
   Inputs - None
   Purpose -  Close button for directions form
*/
document.getElementById("cross-dir").onclick = function() {
    document.getElementById("directions-form").style.display = "none";
  
  }

document.getElementById("trip_modal_close").onclick = function() {
  document.getElementById("trip-modal").style.display = "none";
  document.getElementById("start").style.display ="block";
  document.getElementById("markers").marker.setMap(null);
  window.mp.setCenter(window.homemarker.position);
  window.directionsDisplay.setMap(null);
  document.getElementById('start').style.visibility= "visible";
  console.log("MARKERS", document.getElementById("markers"), document.getElementById("markers").marker);
  clearInterval(window.timerInterval);
  var rideTime = Date.now()- startTime;
  console.log("This is the rideTime:", rideTime);
}
  
  document.getElementById("cross-details").onclick = function() {
    currentLocationPromise.then(function(currentLocation) {
      document.getElementById("trip-details").style.display = "none";
      document.getElementById("markers").marker.setMap(null);
      window.mp.setCenter(currentLocation);
      window.directionsDisplay.setMap(null);
      document.getElementById("start").style.visibility = "visible";
    }).catch(function(error) {
      console.log("cross-details Error getting current location: " + error.message);
    });
  
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
      window.currDest = comp.getPlace();
      usearr = window.additionalDetails(window.currDest.name);
      document.getElementById('markers').marker.setPosition(window.currDest.geometry.location);
      document.getElementById('markers').marker.setVisible(true);
      window.findRoute(window.currDest);
      document.getElementById("deets-modal").style.display = "block";
      document.getElementById("go-to-details").loc = window.currDest;
    }
  }

  /* Function Interface - cross
   Inputs - None
   Purpose -  Close button for popup
*/
    document.getElementById("cross").onclick = function() {
      if (document.getElementById('markers').marker) {
        document.getElementById('markers').marker.setMap(null);
      }
        window.directionsDisplay.setMap(null);
        document.getElementById("deets-modal").style.display = "none";
        document.getElementById("myModal").style.display = "none";
        document.getElementById("suggest").style.visibility = "visible";
        document.getElementById('markers').marker.setMap(null);
    }

    /* Function Interface - start-btn
   Inputs - ps (original position of bike)
*/
document.getElementById("start-btn").onclick = function(){
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    var modal = document.getElementById("myModal");
        modal.style.display = "block";
        document.getElementById("directions-form").style.display = "none";
        var modal2 = document.getElementById("nearby-srch");
        modal2.style.display = "none";
    document.getElementById("suggest").style.visibility = "hidden";
}


/* Function Interface - sugg-btn
   Inputs - None
   Purpose - Scrape Places API based on LatLng Bounds
*/
document.getElementById("sugg-btn").onclick = function(){
    var dict = new Array();
    var lt, ln;
    document.getElementById("start").style.visibility = "hidden";
    currentLocationPromise.then(function(currentLocation) {
      // do something with currentLocation
      lt = currentLocation.coords.latitude;
      ln = currentLocation.coords.longitude;
      
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
          var createClickHandler = function(row, cnt) {
            return function() {
              var cell = row.getElementsByTagName("td");
              modal.style.dispslay = "none";
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
                  console.log('suggestions post result:', result);
                  $.ajax({
                    type: 'GET',
                    url: '/details'
                  }).done(function(res, data) {
                    // get the place details and create info page
                    // console.log(data, res.result);
                    var detailspopup = document.getElementById("trip-details"); 
                    detailspopup.style.display = "block";
                    document.getElementById("nearby-srch").style.display = "none";

                    window.currDest = res.result;
                    console.log("CURRDEST", window.currDest);
                    document.getElementById("cross-dir").loc = new google.maps.LatLng(res.result.geometry.location.lat, res.result.geometry.location.lng);
                    window.tripDetails(res.result);

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
    }).catch(function(error) {
      console.log("sugg-btn Error getting current location: " + error.message);
    });
      
      // table display
      var modal = document.getElementById("nearby-srch");
      modal.style.display = "block";
    
}

document.getElementById("start-suggestion").onclick = function(){
  window.findRoute(window.currDest);
  document.getElementById("trip-details").style.display = "none";
  document.getElementById("deets-modal").style.display = "none";
  document.getElementById("nearby-srch").style.display = "none";
  document.getElementById("trip-modal").style.display = "block";
  console.log("DEST:", window.currDest);
  document.getElementById("trip-title").innerHTML = "Trip to: " + window.currDest.name;
  startTimer()
}


document.getElementById("google-login-button").onclick = function(ps){
  alert("Work in progress!")
}