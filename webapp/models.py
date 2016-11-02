from py2neo import Graph, Node, Relationship
from passlib.hash import bcrypt
import os

# Get environmental variables need to connect to Neo4J database
url = os.environ.get('GRAPHENEDB_URL', 'http://localhost:7474')
username = os.environ.get('NEO4J_USERNAME')
password = os.environ.get('NEO4J_PASSWORD')

graph = Graph(url + '/db/data/', username=username, password=password)

class User:
    # __init__ is called when the object user is created
    def __init__(self, email):
        # self is reference to this instance of an object
        # assign values to the variable email in the new object
        self.email = email
    
    # Find the user in the graph using their email address
    def find(self):
        user = graph.find_one('User', 'email', self.email)
        return user
    
    # Register a new user if they don't already exist
    def register(self, name, password):
        if not self.find():
            user = Node('User', name=name, email=self.email, password=bcrypt.encrypt(password))
            graph.create(user)
            return True
        else:
            return False
    
    # Return true if the given password matches the users password
    def verify_password(self, password):
        user = self.find()
        if user:
            return bcrypt.verify(password, user['password'])
        else:
            return False
    
    # Add the post to the database
    def add_post(self, text):
        user = self.find()
        post = Node('Post', text=text)
        rel = Relationship(user, 'POSTED', post)
        graph.create(rel)
    
    # Return all posts written by the current user
    def get_posts(self):
        query = '''
        MATCH (user:User)-[:POSTED]->(post:Post)
        WHERE user.email = {email}
        RETURN post
        '''
        
        # Return a list of dictionaries which can be converted to JSON
        return graph.data(query, email=self.email)