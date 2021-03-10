from flask import Flask, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/register")
def register():
    return render_template("registration.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/initialForm")
def initialForm():
    return render_template("initialForm.html")

@app.route("/cataloge")
def cataloge():
    return render_template("cataloge.html")

@app.route("/agendarCitas")
def agendarCitas():
    return render_template("agendarCitas.html")

if __name__ == "__main__":
    app.run(debug=True)
