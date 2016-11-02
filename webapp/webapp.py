from flask import Flask, make_response, request, session
from models import User
import json
import os
app = Flask(__name__)

DEBUG_MODE=True

# Found at https://gist.github.com/geoffalday/2021517
app.secret_key = os.urandom(24)

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

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]
    re_enter_password = data["reEnterPassword"]

    if len(name) < 1:
        return json.dumps({"status": "error", "message": "Your name must be at least one character."})
    elif len(password) < 8:
        return json.dumps({"status": "error", "message": "Your password must be at least 8 characters."})
    elif password != re_enter_password:
        return json.dumps({"status": "error", "message": "The passwords you entered did not match."})
    elif not User(email).register(name, password):
        return json.dumps({"status": "error", "message": "That email address was already registered."})
    else:
        session["email"] = email
        return json.dumps({"status": "success", "message": "User successfully registered.", "user": {"email": email}})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    if not User(email).verify_password(password):
        return json.dumps({"status": "error", "message": "Invalid login."})
    else:
        session["email"] = email
        return json.dumps({"status": "success", "message": "User successfully logged in.", "user": {"email": email}})

@app.route("/logout" , methods=["GET"])
def logout():
    session.pop("email", None)
    return json.dumps({"status": "success", "message": "User successfully logged out."})

@app.route('/add_post', methods=['POST'])
def add_post():
    data = request.get_json()
    text = data["text"]

    if not text:
        return json.dumps({"status": "error", "message": "The post was empty."})
    else:
        User(session["email"]).add_post(text)
        return json.dumps({"status": "success", "message": "Successfully added post."})

@app.route('/get_posts', methods=['GET'])
def get_posts():
    posts = User(session["email"]).get_posts()
    return json.dumps({"status": "success", "message": "Posts retrieved successfully.", "posts": posts})

if __name__ == "__main__":
    app.run(debug=DEBUG_MODE)