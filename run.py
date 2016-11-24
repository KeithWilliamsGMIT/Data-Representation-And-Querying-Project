from barker import app
import os

DEBUG_MODE=True
app.secret_key = os.urandom(24)
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port, debug=DEBUG_MODE)