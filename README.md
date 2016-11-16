# Data-Representation-And-Querying-Project

#### Description
This is my 3rd year project for my data representation and querying module for college. The aim of this project is to write a single page web application in Python using the Flask microframework.

#### Planning Stage

The following is a list of goals I've outlined for this project.
+ Create a working SPA using best practices
+ Minimise response time
+ Experiment with new technologies
+ Write clear documentation and a user manual
+ Focus on developing a good UX
+ Deploy to a server

After considering the above goals I chose to develop a webapp similar to Twitter.

##### MVP
The MVP will only contain features vital to any social network. It should have a user friendly layout and should also be designed so that additional features will be easy to integrate. With this in mind I decided that the MVP should have five views.

1. Sign up view
   - The sign up will be very basic. There will be no email confirmation.
2. Login view
   - The login view will also be very basic. There will be no forgot/reset password option or "remember me" option.
3. Feeds view
   - The feed view will allow users to write posts, but they can only be plain text, and to read other peoples posts.
4. Search view
   - Users can search for other people to follow.
5. Profile view
   - Display posts written by the user and the users details. There will be no user profile image in the MVP.

##### Additional features
The following are some of the features I'd like to add once the MVP is complete.
+ Add profile images
+ Allow users to comment, like and Share posts
+ Allow users to post images and videos
+ Recommend people to follow
+ Add a direct messaging system
+ Sign up and login options ommitted from MVP

#### Development Stage

##### Technologies used

###### Client Side
- AngularJS

The AngularJS framework was used to handle the routing on the client side and because it allowed the JavaScript to be written in a structured way, using the MVC pattern.

Ng Route was originally used for the client side routing, but I then switched to UI Router for nested views.

- Bootstrap

Bootstrap allowed me to focus on developing the functionality of the webapp rather than the responsiveness or cross browser compatability which ultimately sped up development.

###### Server Side
- Python3 and Flask

Python3 and the Flask microframework were requirements for this project.

- Neo4J

A graph database seemed like the obvious choice of database for a social network as the data is not linear by nature.

##### Resources
The following two git repositories were very helpful when deciding how to structure the project.
+ [angular-flask](https://github.com/shea256/angular-flask)
+ [neo4j-flask](https://github.com/nicolewhite/neo4j-flask)

#### Deployment Stage

##### Setting up Neo4J locally
This webapp requires Neo4J. After you download and start Neo4J set the username and password variables as follows.
```
export NEO4J_USERNAME=username
export NEO4J_PASSWORD=password
```

The default username/password is neo4j/neo4j. To check if they are set correctly use the following commands.
```
echo $NEO4J_USERNAME
echo $NEO4J_PASSWORD
```

Alternatively, you can disable athentication by uncommenting the following line in the neo4j.config file.
```
dbms.security.auth_enabled=false
```

Open [http://localhost:7474/browser/](http://localhost:7474/browser/) with your web browser to use the Neo4J GUI.

##### Running the webapp locally
Internet access is required when running the webapp locally as it uses a number of files from different CDN's.

Clone the repository
```
git clone https://github.com/KeithWilliamsGMIT/Data-Representation-And-Querying-Project.git
cd Data-Representation-And-Querying-Project
```

Install virtualenv if you don't already have it installed
```
pip install virtualenv
```

Create and activate a virtual environment called venv
```
virtualenv venv
source venv/bin/activate
```

Install the requirements
```
pip install -r requirements.txt
```

Run the webapp
```
cd webapp
python webapp.py
```

Open [http://localhost:5000](http://localhost:5000) with your web browser.
