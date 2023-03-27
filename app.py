import logging
import sys, os
import traceback
import requests
from flask import Flask, render_template, request, jsonify
from maps import GeoHandler
import _thread
from config import logconfig, apiConfig

logger = logging.getLogger()
logger.propagate = False
logger.setLevel(logging.INFO)
file_handler = loggingfile_handler = logging.FileHandler(os.path.join(logconfig.logPath, (
    logconfig.logFilename).replace('event', 'ILS')))
file_handler.setFormatter(logconfig.logFormat)
logger.addHandler(file_handler)

datag = None
app = Flask(__name__, template_folder='templates')
import geocoder
geodata = geocoder.ip('me')



# Handle the get requests to app (site server)
@app.route('/', methods=["GET"])
def index():
    # thread for the location data transfer
    return render_template("index.html")


# Handle POST requests (backend server)
# Remember to switch the button for a constant feature and the acq() while loop out
@app.route('/post', methods=["POST"])
def post():
    global datag
    try:
        data = request.get_json(force=True)
        logger.info("Post data: " + str(data))
        datag = data
        if data['flag'] == 'const':
            new_thread = _thread(target=GeoHandler.testhelp, args=(datag,))
            new_thread.daemon = True
            new_thread.start()
            logger.info("Starting the call transfer thread")
        elif data['flag'] == 'place_details':
            # make placedetails api call
            details = GeoHandler.placeDetails(GeoHandler, datag['place_id'])
            logger.info("Placedetails post request received")
    # return data
    except Exception as e:
        logger.error("Error in post request " + str(e) + traceback.format())
        sys.exit(-1)

    # parallel thread for the location processing
    # init for the location data transfer
    # const to send position to python backend
    # place_details for the place_id transfer
    


@app.route('/count')
def count():
    # GeoHandler.acq(GeoHandler, )
    data = {'lat': geodata.latlng[0], 'lng': geodata.latlng[1]}
    logger.info("Location data by count(): " + str(data))
    return jsonify(data)

@app.route('/nearby')
def nearby():
    return GeoHandler.nearbyPlaces(GeoHandler, geodata.latlng[0], geodata.latlng[1])

if __name__ == "__main__":
    app.run(debug=True)