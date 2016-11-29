from flask import Flask, make_response, render_template, request, session, g
from flask_httpauth import HTTPBasicAuth
from .models import User
import json

app = Flask(__name__)

auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(email, password):
    user = User(email)
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True

@auth.error_handler
def unauthorized():
    return json.dumps({"status": "error", "message": "You are not autherized."})

# Serve index.html
# Adapted from https://devcereal.com/setting-flask-angularjs/
@app.route("/")
@app.route("/login")
@app.route("/feed")
@app.route("/profile/posts")
@app.route("/profile/followers")
@app.route("/profile/following")
@app.route("/search")
def index():
    # make_response does not cache the page
    return make_response(render_template("index.html"))

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
        verify_password(email, password)
        return json.dumps({"status": "success", "message": "User successfully registered.", "user": {"email": email}})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    if not verify_password(email, password):
        return json.dumps({"status": "error", "message": "Invalid login."})
    else:
        return json.dumps({"status": "success", "message": "User successfully logged in.", "user": {"email": email}})

@app.route("/logout" , methods=["GET"])
@auth.login_required
def logout():
    return json.dumps({"status": "success", "message": "User successfully logged out."})

@app.route("/add_post", methods=["POST"])
@auth.login_required
def add_post():
    data = request.get_json()
    text = data["text"]

    if not text:
        return json.dumps({"status": "error", "message": "The post was empty."})
    else:
        User(g.user.email).add_post(text)
        return json.dumps({"status": "success", "message": "Successfully added post."})

@app.route("/get_own_posts", methods=["GET"])
@auth.login_required
def get_own_posts():
    posts = User(g.user.email).get_own_posts()
    return json.dumps({"status": "success", "message": "Posts retrieved successfully.", "posts": posts})

@app.route("/get_all_recent_posts", methods=["POST"])
@auth.login_required
def get_all_recent_posts():
    data = request.get_json()
    timestamp = data["timestamp"]

    posts = User(g.user.email).get_all_recent_posts(timestamp)
    return json.dumps({"status": "success", "message": "Posts retrieved successfully.", "posts": posts})

@app.route("/follow", methods=["POST"])
@auth.login_required
def follow():
    data = request.get_json()
    email = data["email"]

    User(g.user.email).follow_user(email)
    return json.dumps({"status": "success", "message": "Successfully followed user."})

@app.route("/unfollow", methods=["POST"])
@auth.login_required
def unfollow():
    data = request.get_json()
    email = data["email"]

    User(g.user.email).unfollow_user(email)
    return json.dumps({"status": "success", "message": "Successfully unfollowed user."})

@app.route("/search_users", methods=["POST"])
@auth.login_required
def search_users():
    data = request.get_json()
    query = data["query"]

    if not query:
        return json.dumps({"status": "error", "message": "The search query was empty."})
    else:
        users = User(g.user.email).find_users_by_name(query)
        return json.dumps({"status": "success", "message": "Successfully searched for user.", "users": users})

@app.route("/get_followers", methods=["GET"])
@auth.login_required
def get_followers():
    users = User(g.user.email).get_followers()
    return json.dumps({"status": "success", "message": "Successfully retrieved this users followers.", "users": users})

@app.route("/get_following", methods=["GET"])
@auth.login_required
def get_following():
    users = User(g.user.email).get_following()
    return json.dumps({"status": "success", "message": "Successfully retrieved the users this user is following.", "users": users})