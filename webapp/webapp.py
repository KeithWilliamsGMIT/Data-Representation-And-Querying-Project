from flask import Flask, render_template
app = Flask(__name__)

DEBUG_MODE=True

@app.route("/")
def signin():
	return render_template('signup.html')

@app.route("/login")
def login():
	return render_template('login.html')

@app.route("/feed")
def feed():
	return render_template('feed.html')

@app.route("/search")
def search():
	return render_template('search.html')

@app.route("/profile")
def profile():
	return render_template('profile.html')

if __name__ == "__main__":
    app.run(debug=DEBUG_MODE)