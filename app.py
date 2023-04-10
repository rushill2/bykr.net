import logging
import sys, os
import traceback,json
from flask import Flask, render_template, request, jsonify
from maps import GeoHandler
print(GeoHandler.test(GeoHandler))
import _thread
from config import logconfig

logger = logging.getLogger()
logger.propagate = False
logger.setLevel(logging.INFO)
file_handler = loggingfile_handler = logging.FileHandler(os.path.join(logconfig.logPath, (
    logconfig.logFilename).replace('event', 'ILS')))
file_handler.setFormatter(logconfig.logFormat)
logger.addHandler(file_handler)

datag = None
placeDeets = None
placeName = None
picref = None
app = Flask(__name__, template_folder='templates')
import geocoder
geodata = geocoder.ip('me')



# Handle the get requests to app (site server)
@app.route('/', methods=["GET"])
def index():
    # thread for the location data transfer
    print('this works')
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
        if data['flag'] == 'const':
            new_thread = _thread(target=GeoHandler.testhelp, args=(datag,))
            new_thread.daemon = True
            new_thread.start()
            logger.info("Starting the call transfer thread")
        elif data['flag'] == 'place_details':
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
        GeoHandler.placeImages(GeoHandler,picref)
        picref = None
        return jsonify({"message": "Request received successfully"})
    except Exception as e:
        logger.error("Error in post request " + str(e) + traceback.format_exc())
        sys.exit(-1)

@app.route('/locate')
def count():
    # GeoHandler.acq(GeoHandler, )
    data = {'lat': geodata.latlng[0], 'lng': geodata.latlng[1]}
    logger.info("Location data by count(): " + str(data))
    return jsonify(data)

@app.route('/nearby')
def nearby():
    print('reached nearby')
    return GeoHandler.nearbyPlaces(GeoHandler, geodata.latlng[0], geodata.latlng[1])

@app.route('/details')
def details():
    print('reached details')
    return placeDeets

@app.route('/nameSearch')
def name():
    print('reached name')
    return placeName

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')