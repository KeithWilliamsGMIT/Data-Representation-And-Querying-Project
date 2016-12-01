from py2neo import Graph, Node, Relationship
from passlib.hash import bcrypt
from datetime import datetime
import os
import random

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
            username = generate_username(name)
            user = Node('User', name=name, username=username, email=self.email, password=bcrypt.encrypt(password))
            graph.create(user)
            return True
        else:
            return False
    
    # Return true if the given password matches the users password
    def verify_password(self, password):
        user = self.find()
        print("Verify password")
        if user:
            return bcrypt.verify(password, user['password'])
        else:
            return False
    
    # Return the username for this user
    def get_username(self):
        query = '''
        MATCH (self:User)
        WHERE self.email = {self}
        RETURN self.username AS username
        LIMIT 1
        '''
        
        # Dictionary of parameters for the query
        params = {'self': self.email}
        
        # Return a list of dictionaries which can be converted to JSON
        return graph.data(query, params)[0].get('username')
    
    # Add the post to the database
    def add_post(self, text):
        user = self.find()
        post = Node('Post', text=text, timestamp=timestamp())
        rel = Relationship(user, 'POSTED', post)
        graph.create(rel)
    
    # Return all posts written by the user with the given username
    def get_users_posts(self, username):
        query = '''
        MATCH (self:User)-[:POSTED]->(post:Post)
        WHERE self.username = {self}
        RETURN post.text AS message, post.timestamp AS timestamp, self.name AS name, self.username AS username
        ORDER BY post.timestamp DESC
        LIMIT 20
        '''
        
        # Dictionary of parameters for the query
        params = {'self': username}
        
        # Return a list of dictionaries which can be converted to JSON
        return graph.data(query, params)
    
    # Return posts written by the current user and who they follow
    def get_posts(self, timestamp, skip):
        query = '''
        MATCH (self:User)-[:FOLLOWED*0..1]->(user)-[:POSTED]->(post)
        WHERE self.email = {self} AND post.timestamp > {timestamp}
        RETURN post.text AS message, post.timestamp AS timestamp, user.name AS name, user.username AS username
        ORDER BY post.timestamp DESC
        SKIP {skip}
        LIMIT 20;
        '''
        
        # Dictionary of parameters for the query
        params = {'self': self.email, 'timestamp': timestamp, 'skip': skip}
        
        # Return a list of dictionaries which can be converted to JSON
        return graph.data(query, params)
    
    # Follow the user with the given email address
    def follow_user(self, email):
        user = self.find()
        
        # Get a user node with the given email
        other = graph.find_one('User', 'email', email)
        rel = Relationship(user, 'FOLLOWED', other)
        graph.create(rel)
    
    # Unfollow the user with the given email address
    def unfollow_user(self, email):
        query = '''
        MATCH (self:User)-[r:FOLLOWED]->(user:User)
        WHERE self.email = {self} AND user.email = {user}
        DELETE r;
        '''
        
        # Dictionary of parameters for the query
        params = {'self': self.email, 'user': email}
        
        # Run the query
        graph.run(query, params)
    
    # Return other users whose names have the value entered by the user as a substring
    # This search ignores case
    def find_users_by_name(self, name):
        query = '''
        MATCH (user:User)
        WHERE user.email <> {email} AND user.name =~ {name}
        OPTIONAL MATCH (self)-[r:FOLLOWED]->(user)
        WHERE self.email = {email}
        RETURN user.name AS name, user.email AS email, user.username AS username, r IS NOT NULL AS following;
        '''
        
        # Dictionary of parameters for the query
        params = {'name': '(?i).*' + name + '.*', 'email': self.email}
        
        # Return a list of dictionaries which can be converted to JSON
        return graph.data(query, params)
    
    # Get all the users that follow the current user
    def get_followers(self, username):
        query = '''
        MATCH (user:User)-[:FOLLOWED]->(self:User)
        WHERE self.username = {self}
        OPTIONAL MATCH (me:User)-[r:FOLLOWED]->(user:User)
        WHERE me.email = {me}
        RETURN user.name AS name, user.email AS email, user.username AS username, r IS NOT NULL AS following;
        '''
        
        # Dictionary of parameters for the query
        params = {'self': username, 'me': self.email}
        
        # Run the query
        return graph.data(query, params)
    
     # Get all the users that the current user follows
    def get_following(self, username):
        query = '''
        MATCH (self:User)-[FOLLOWED]->(user:User)
        WHERE self.username = {self}
        OPTIONAL MATCH (me:User)-[r:FOLLOWED]->(user:User)
        WHERE me.email = {me}
        RETURN user.name AS name, user.email AS email, user.username AS username, r IS NOT NULL AS following;
        '''
        
        # Dictionary of parameters for the query
        params = {'self': username, 'me': self.email}
        
        # Run the query
        return graph.data(query, params)

# Generate a random username based on the users full name
# Adapted from http://stackoverflow.com/questions/35964691/generating-username-using-python
def generate_username(name):
    while (True):
        # Generate a username
        first = name[0][0]
        surname = name[-1][:3].rjust(3, 'x')
        number = '{:03d}'.format(random.randrange (1,999))
        username = '{}{}{}'.format(first, surname, number)

        # Check if it is unique
        user = graph.find_one('User', 'username', username)

        if (user is None):
            return username
    
# Return a timestamp in seconds
def timestamp():
    epoch = datetime.utcfromtimestamp(0)
    now = datetime.now()
    delta = now - epoch
    return delta.total_seconds()