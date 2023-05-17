import mimetypes

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

import logging
import sys, os
import traceback, json
from flask import Flask, render_template, request, jsonify, send_from_directory
from maps import GeoHandler
from flask_socketio import SocketIO, emit
from config import logconfig

logger = logging.getLogger()
logger.propagate = False
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(os.path.join(logconfig.logPath, (
    logconfig.logFilename).replace('event', 'ILS')))
file_handler.setFormatter(logconfig.logFormat)
logger.addHandler(file_handler)

datag = None
placeDeets = None
placeName = None
picref = None
app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')
socketio = SocketIO(app)

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
    global placeDeets
    print("post works")
    try:
        data = request.json
        if data is None:
            data = json.loads(request.json)
        logger.info("Post data: " + str(data))
        datag = data
        if data['flag'] == 'place_details':
            # make placedetails api call
            global placeDeets
            placeDeets = GeoHandler.placeDetails(GeoHandler, data['pid'])
            logger.info("Placedetails post request received")
        elif data['flag'] == 'place_name':
            placeDeets = GeoHandler.nameSearch(GeoHandler, data['place_name'])
            logger.info("Place nameSearch post request received")
        elif data['flag'] == 'get_images':
            global picref
            picref = data['data']
            logger.info("Place get_images post request received")
        GeoHandler.placeImages(GeoHandler, picref)
        picref = None
        return jsonify({"message": "Request received successfully"})
    except Exception as e:
        logger.error("Error in post request " + str(e) + traceback.format_exc())
        sys.exit(-1)


@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)


@app.route('/locate')
def count():
    # GeoHandler.acq(GeoHandler, )
    data = {'lat': geodata.latlng[0], 'lng': geodata.latlng[1]}
    logger.info("Location data by count(): " + str(data))
    return jsonify(data)


@app.route('/nearby')
def nearby():
    return GeoHandler.nearbyPlaces(GeoHandler, geodata.latlng[0], geodata.latlng[1])


@app.route('/details')
def details():
    return placeDeets


@app.route('/nameSearch')
def name():
    return placeName


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if data is None:
        data = json.loads(request.json)
    logger.info("Post data: " + str(data))
    return placeName


@app.route('/location_daemon', methods=['POST'])
def handle_location_data():
    try:
        data = request.json
        # do something with the location data, e.g. print it
        print(data['latitude'], data['longitude'])
        return 'OK'
    except Exception as e:
        logger.error(f"Location Daemon error: {e}")
        return 'NOT OK'



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
