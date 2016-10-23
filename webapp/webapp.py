from flask import Flask, make_response
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
    return make_response(open('templates/index.html').read())

if __name__ == "__main__":
    app.run(debug=DEBUG_MODE)