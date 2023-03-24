import logging
import sys, os
import traceback
from flask import Flask, render_template, request, jsonify
from maps import GeoHandler
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
    if request.method == 'POST':
        try:
            data = request.form
            datag = data
        except Exception as e:
            logger.error("Error in post request " + str(e) + traceback.format())
            sys.exit(-1)

    # parallel thread for the location processing
    logger.info("whatever the fuck datag is: " + str(datag))
    if (data.to_dict()['flag'] == 'init'):
        new_thread = _thread(target=GeoHandler.acq, args=(datag,))
        new_thread.daemon = True
        new_thread.start()
        logger.info("Starting the init transfer thread")

    elif data.to_dict()['flag'] == 'const':
        new_thread = _thread(target=GeoHandler.testhelp, args=(datag,))
        new_thread.daemon = True
        new_thread.start()
        print("Starting the call transfer thread")

    return data


@app.route('/count')
def count():
    # GeoHandler.acq(GeoHandler, )
    data = {'lat': geodata.latlng[0], 'lng': geodata.latlng[1]}
    logger.info("Location data by count(): " + str(data))
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
