import fed
import time
from geopy.geocoders import Nominatim

key = "AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA"

target = "https://www.googleapis.com/geolocation/v1/geolocate?key="

src = "https://maps.googleapis.com/maps/api/js?key=" + key + "&callback=initMap"
localhost = "http://127.0.0.1:5000"
location = None


def acq(datag):
    loc = coordToPlace(datag.to_dict())
    print(loc)
    fed.scrape(loc)

def coordToPlace(usedict):
        blacklist = ['building', 'house', 'house_number', 'road', 'quarter']
        payload =usedict['data[lat]'] + "," + usedict['data[lng]']
        geolocator = Nominatim(user_agent="BikeTes")
        loc = geolocator.reverse(payload)
        addr = loc.raw['address']
        # print(retloc)
        arr = list(addr.keys())

        if(all(x!=arr[1] for x in blacklist)):
            return addr[arr[1]]
        elif(all(x!=arr[2] for x in blacklist)):
            return addr[arr[2]]
        elif(all(x!=arr[3] for x in blacklist)):
            return addr[arr[3]]
        else:
            return addr[arr[4]]


# implement nearby biking suggestions
