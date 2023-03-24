# file for threaded processes from flask
# initializes location and other data for use for
# other features
import time

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


    # implement nearby biking suggestions

    def testhelp(self, dataset):
        logger.info("testhelp checking dataset:" + str(dataset))