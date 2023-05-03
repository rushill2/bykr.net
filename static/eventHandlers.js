document.getElementById("cross-srch").onclick = function() {
    document.getElementById("nearby-srch").style.display = "none";
    document.getElementById("start").style.visibility = "visible";
  
  }
  
  document.getElementById("deets_cross").onclick = function() {
      document.getElementById('deets_cross').marker.setMap(null);
      console.log('marker', document.getElementById('deets_cross').marker)
      window.directionsDisplay.setMap(null);
      document.getElementById("deets-modal").style.display = "none";
  
  }
  
  document.getElementById("go-to-details").onclick = function() {
    var infomodal = document.getElementById("deets-modal");
    infomodal.style.display = "none";
    console.log('pass to tripdetails', document.getElementById("go-to-details").loc)
    tripDetails(document.getElementById("go-to-details").loc);
    var detailspopup = document.getElementById("trip-details");
    detailspopup.style.display = "block";
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
        document.getElementById("map").style.width = "400px";
        window.mp.setZoom(16);
    }

    /* Function Interface - cross_dir
   Inputs - None
   Purpose -  Close button for directions form
*/
document.getElementById("cross-dir").onclick = function() {
    document.getElementById("directions-form").style.display = "none";
  
  }
  
  document.getElementById("cross-details").onclick = function() {
    currentLocationPromise.then(function(currentLocation) {
      console.log("Current location: " + currentLocation.toString());
      // do something with currentLocation
      document.getElementById("trip-details").style.display = "none";
      document.getElementById("cross-details").marker.setMap(null);
      window.mp.setCenter(currentLocation);
      window.directionsDisplay.setMap(null);
      document.getElementById("start").style.visibility = "visible";
    }).catch(function(error) {
      console.log("Error getting current location: " + error.message);
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
      var place1 = comp.getPlace();
      usearr = fetchmoredeets(place1.name);
      destmarker = new google.maps.Marker({map:window.mp});
      document.getElementById('deets_cross').marker = destmarker;
      destmarker.setPosition(place1.geometry.location);
      destmarker.setVisible(true);
      findRoute(place1);
      document.getElementById("go-to-details").loc = place1;
    }
  }

  /* Function Interface - cross
   Inputs - None
   Purpose -  Close button for popup
*/
    document.getElementById("cross").onclick = function() {
        document.getElementById('deets_cross').marker.setMap(null);
        window.directionsDisplay.setMap(null);
        document.getElementById("deets-modal").style.display = "none";
        document.getElementById("myModal").style.display = "none";
        document.getElementById("suggest").style.visibility = "visible";
        console.log('window.directionsDisplay', window.directionsDisplay);
        destmarker.setMap(null);
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

    function error(e){
        console.error(e)
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

/* Function Interface - sugg-btn
   Inputs - None
   Purpose - Scrape Places API based on LatLng Bounds
*/
document.getElementById("sugg-btn").onclick = function(){
    var dict = new Array();
    var lt, ln;
    document.getElementById("start").style.visibility = "hidden";
    currentLocationPromise.then(function(currentLocation) {
      console.log("Current location: " + currentLocation.toString());
      // do something with currentLocation
      lt = currentLocation.lat();
      ln = currentLocation.lng();
      
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
                    document.getElementById("cross-dir").loc = new google.maps.LatLng(res.result.geometry.location.lat, res.result.geometry.location.lng);
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
    }).catch(function(error) {
      console.log("Error getting current location: " + error.message);
    });
      
      // table display
      var modal = document.getElementById("nearby-srch");
      modal.style.display = "block";
    
}