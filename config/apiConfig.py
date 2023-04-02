maps_key = 'AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA'


urls = {
    'place_details': 'https://maps.googleapis.com/maps/api/place/details/json?place_id={_pid}&key={_key}',
    'nearby_places': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lt},${ln}&radius=5000&sensor=true&type=park&rankBy=distance&key={_key}',
    'text_search': 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=${_name}&key={_key}'
}