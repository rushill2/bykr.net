# file for threaded processes from flask
# initializes location and other data for use for
# other features
import time
import traceback
from config import apiConfig
import requests
from geopy.geocoders import Nominatim
import logging

logger = logging.getLogger()

key = "AIzaSyAEGNwybqtkhb7f2HXEDGkWYqrkc9oRqNA"
INIT = (0,0)

# overseer of all things in this one
class GeoHandler:
    location = (0,0)
    def acq(self, datag):
        t = time.time()
        loc = self.coordToPlace(datag.to_dict())
        logger.info("Time taken to get location data : " + str(time.time()-t))
        logger.info("Location data is: " + str(loc))

    # find the smallest possible unit that would have some news
    # Would likely have to scrap this due to api ratelimits
    # Replace with recommendations for bikimg locations, and setting paths for those?
    def coordToPlace(self, usedict):
            payload = ""
            blacklist = ['building', 'house', 'house_number', 'road', 'quarter']
            geolocator = Nominatim(user_agent="BikeTes")

            if('data[lat]' in usedict.keys() and 'data[lng]' in usedict.keys()):
                payload =usedict['data[lat]'] + "," + usedict['data[lng]']
            self.location = (float(usedict['data[lat]']), float(usedict['data[lng]']))
            loc = geolocator.reverse(payload)
            addr = loc.raw['address']
            arr = list(addr.keys())

            # naive filtration
            if(all(x!=arr[1] for x in blacklist)):
                return addr[arr[1]]
            elif(all(x!=arr[2] for x in blacklist)):
                return addr[arr[2]]
            elif(all(x!=arr[3] for x in blacklist)):
                return addr[arr[3]]
            else:
                return addr[arr[4]]

    def placeDetails(self, place_id):
        url = apiConfig.urls['place_details'].replace('{_key}', apiConfig.maps_key).replace('{_pid}', place_id)
        logger.info("placeDetails() suggestions url: " + str(url))
        try:
            response = requests.get(url)
            data = response.json()
            # logger.info("placeDetails() suggestions response: " + str(data))
            return data
        except Exception as e:
            logger.error("Error in placeDetails(): " + str(e) + traceback.format_exc())

    def nearbyPlaces(self, lat, lng):
        url = apiConfig.urls['nearby_places'].replace('${lt}', str(lat)).replace('${ln}', str(lng)).replace('{_key}', apiConfig.maps_key)
        logger.info("nearbySearch() suggestions url: " + str(url))
        try:
            response = requests.get(url)
            data = response.json()
            # logger.info("nearbySearch() suggestions response: " + str(data))
            return data
        except Exception as e:
            logger.error("Error in nearbySearch(): " + str(e) + traceback.format_exc())

    # implement nearby biking suggestions

    def nameSearch(self, name):
        url = apiConfig.urls['text_search'].replace('${_name}', str(name)).replace('{_key}', apiConfig.maps_key)
        logger.info("nameSearch() suggestions url: " + str(url))
        try:
            response = requests.get(url)
            data = response.json()
            # logger.info("nearbySearch() suggestions response: " + str(data))
            return data
        except Exception as e:
            logger.error("Error in nearbySearch(): " + str(e) + traceback.format_exc())

    def testhelp(self, dataset):
        logger.info("testhelp checking dataset:" + str(dataset))