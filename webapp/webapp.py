from flask import Flask, make_response, request, session
from models import User
app = Flask(__name__)

DEBUG_MODE=True

# Serve index.html
# Adapted from https://devcereal.com/setting-flask-angularjs/
@app.route("/")
@app.route("/login")
@app.route("/feed")
@app.route("/profile")
@app.route("/search")
def index():
    # make_response does not cache the page
    return make_response(open("templates/index.html").read())

@app.route("/register_user", methods=["POST"])
def register_user():
    name = request.form["nameSignUp"]
    email = request.form["emailSignUp"]
    password = request.form["passwordSignUp"]
    reEnterpassword = request.form["reEnterPasswordSignUp"]
    
    if len(name) < 1:
        return "Your name must be at least one character."
    elif len(password) < 8:
        return "Your password must be at least 8 characters."
    elif password != reEnterpassword:
        return "The passwords you entered did not match."
    elif not User(name, email).register(password):
        return "That email address was already registered."
    else:
        session["name"] = name
        return session.get("name")

if __name__ == "__main__":
    app.run(debug=DEBUG_MODE)