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


@app.route("/client")
def client():
    return render_template("client.html")


@app.route("/initialForm")
def initialForm():
    return render_template("initialForm.html")


@app.route("/cataloge")
def cataloge():
    return render_template("cataloge.html")


@app.route("/appointment")
def appointment():
    return render_template("appointment.html")


@app.route("/adm")
def adm():
    return render_template("adm.html")

@app.route("/appointments")
def appointments():
    return render_template("appointments.html")

@app.route("/patients")
def patients():
    return render_template("patients.html")

if __name__ == "__main__":
    app.run(debug=True)
