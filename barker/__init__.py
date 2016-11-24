# The __init__.py file specifies that the current directory is a package.
from .views import app
from .models import graph

# Initialise uniqueness constraints in the database
#graph.schema.create_uniqueness_constraint("User", "email")