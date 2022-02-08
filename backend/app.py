from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


FILENAME = 'data.csv'

@app.post('/save_data')
def save_data():
    times = request.json['times']

    with open(FILENAME, 'w') as _f:
        _f.write("Pomiary \n")
        csv = ('\n').join([str(t) for t in times])
        _f.write(csv)


    # return jsonify({
    #     'status': 'ok'
    # })


if __name__ == "__main__":
    app.run(debug=True)