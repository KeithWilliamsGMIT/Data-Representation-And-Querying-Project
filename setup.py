from barker.models import User, graph

# Create a graph with sample data
# Simulate user activity
def setup():
    # Delete all nodes in database
    graph.delete_all()
    
    # Create five users
    User("john.smith@gmit.ie").register("John Smith", "JohnSmith")
    User("colin.murphy@gmit.ie").register("Colin Murphy", "ColinMurphy")
    User("mary.summers@gmit.ie").register("Mary Summers", "MarySummers")
    User("joseph.browne@gmit.ie").register("Joseph Browne", "JosephBrowne")
    User("nora.madden@gmit.ie").register("Nora Madden", "NoraMadden")
    
    # Each user follows two other users
    User("john.smith@gmit.ie").follow_user("nora.madden@gmit.ie")
    User("john.smith@gmit.ie").follow_user("colin.murphy@gmit.ie")
    User("colin.murphy@gmit.ie").follow_user("joseph.browne@gmit.ie")
    User("colin.murphy@gmit.ie").follow_user("mary.summers@gmit.ie")
    User("mary.summers@gmit.ie").follow_user("joseph.browne@gmit.ie")
    User("mary.summers@gmit.ie").follow_user("john.smith@gmit.ie")
    User("joseph.browne@gmit.ie").follow_user("colin.murphy@gmit.ie")
    User("joseph.browne@gmit.ie").follow_user("john.smith@gmit.ie")
    User("nora.madden@gmit.ie").follow_user("mary.summers@gmit.ie")
    User("nora.madden@gmit.ie").follow_user("colin.murphy@gmit.ie")
    
    # Each user writes one post
    User("john.smith@gmit.ie").add_post("Hello Everyone!")
    User("colin.murphy@gmit.ie").add_post("It's almost Christmas")
    User("mary.summers@gmit.ie").add_post("Looking forward to Christmas")
    User("joseph.browne@gmit.ie").add_post("Anyone going to the match")
    User("nora.madden@gmit.ie").add_post("Can't wait for my trip to Paris next week!")

setup()