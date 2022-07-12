import csrf as csrf
from flask import Flask, render_template, request, jsonify
import maps
from threading import Thread

datag = None
app = Flask(__name__, template_folder='templates')


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
            data = {}
            print(e)

    # parallel thread for the location processing
    if (data.to_dict()['flag'] == 'init'):
        new_thread = Thread(target=maps.acq, args=(datag,))
        new_thread.daemon = True
        new_thread.start()
        print("Starting the init transfer thread")

    elif data.to_dict()['flag'] == 'const':
        new_thread = Thread(target=maps.testhelp, args=(datag,))
        new_thread.daemon = True
        new_thread.start()
        print("Starting the call transfer thread")

    return data


@app.route('/count')
def count():
    print(maps.INIT)
    data = {'lat': maps.INIT[0], 'lng': maps.INIT[1]}
    print(data)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
