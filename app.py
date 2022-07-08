import csrf as csrf
from flask import Flask, render_template, request
import maps
from threading import Thread

datag = None
app = Flask(__name__, template_folder='templates')


@app.route('/', methods=["GET"])
def index():
    # thread for the location data transfer
    return render_template("index.html")

# Remember to switch the button for a constant feature and the acq() while loop out
@app.route('/', methods=["POST"])
def post():
    global datag
    if request.method == 'POST':
        try:
            data = request.form
            datag = data
        except Exception as e:
            data = {}
            print(e)

    new_thread = Thread(target=maps.acq, args=(datag,))
    new_thread.daemon = True
    print(new_thread.is_alive())
    new_thread.start()
    print("Starting the transfer thread")


    return data


if __name__ == "__main__":
    app.run(debug=True)



