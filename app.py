from flask import Flask, jsonify, request
from flask import render_template
from server.data import DataPot

# creates a Flask application, named app
app = Flask(__name__, template_folder=".")
flex = DataPot()

# a route where we will display a welcome message via an HTML template
@app.route("/")
def hello():
    message = "Hello, World"
    return render_template('index.html', message=message)

@app.route("/js/<ext>")
def js(ext):
    n = "%s.js" %(ext)
    print (n, 'found the file')
    return render_template(n)

@app.route("/questions")
def questions():
    return jsonify({'data' :flex.questions()})

@app.route("/groups", methods=['GET', 'POST'])
def groups():
    content = request.json
    qs = content['question']
    return jsonify({'data' :list(flex.groups(qs).keys())})

@app.route("/filter", methods=['GET', 'POST'])
def filter():
    content = request.json
    fil = content['filter']
    return jsonify({'data' :flex.filter(fil)})

# run the application
if __name__ == "__main__":
    app.run(debug=True)
