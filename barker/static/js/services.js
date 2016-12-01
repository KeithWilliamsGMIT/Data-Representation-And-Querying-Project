angular.module ("app.services", [])

.factory("User", function($http, $location, Message) {
    var userData = {}
    
    // Send an AJAX request to the server to register a new user
    function register(data) {
        
        if (data.password == data.reEnterPassword) {
            $http.post("/register", data)

            .then(
                function(response) {
                    console.log("Request successful!");

                    // Redirect to the feed page if the user successfully registered
                    if (response.data.status == "success") {
                        userData = response.data.user;
                        setAuthorization(data.email, data.password);
                        $location.path("/feed");
                    } else {
                        Message.setMessage(response.data.message);
                        console.log("Error Message: " + Message.getMessage());
                    }
                },

                function(response) {
                    console.log("Request failed!\n" + JSON.stringify(response));
                }
            );
        } else {
            Message.setMessage("The passwords you entered did not match.");
        }
    }
    
    // Send an AJAX request to the server to login
    function login(data) {
        $http.post("/login", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Redirect to the feed page if the user successfully signed in
                if (response.data.status == "success") {
                    userData = response.data.user;
                    setAuthorization(data.email, data.password);
                    $location.path("/feed");
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Set the Authorization header for all http requests
    function setAuthorization(email, password) {
        $http.defaults.headers.common["Authorization"] = "Basic " + btoa(email + ":" + password);
    }
    
    // Send an AJAX request to the server to logout
    function logout() {
        // Remove Authentication header
        $http.defaults.headers.common["Authorization"] = null;
        
        // Clear user data
        userData = {};

        // Redirect to the login page
        $location.path("/login");
    }
    
    // Return true if the user is logged in (userData is not an empty object)
    function isLoggedIn() {
        return $http.defaults.headers.common["Authorization"] != null;
    }
    
    // Return the users username
    function getUsername() {
        return userData.username;
    }
    
    // Reset all variables
    function reset() {
        userData.users = {};
    }
    
    return {
        register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getUsername: getUsername,
    }
})

.factory("Feed", function($interval, Posts) {
    var feedData = {
        posts: [],
        hasNewPosts: false,
        busy: false
    }
    
    // Add a new post it to the database
    function addPost(data) {
        Posts.addPost(data, function() {
            getAllRecentPosts();
        });
    }
    
    // Get all recent posts written by the current user and who they follow
    function getAllRecentPosts() {
        getRecentPosts(function(posts) {
            feedData.posts = posts.concat(feedData.posts);
            feedData.hasNewPosts = false;
        });
    }
    
    // Return all the posts in the feed
    function getFeed() {
        return feedData.posts;
    }
    
    // Load old posts, skip the posts that are already loaded
    // Only send one ajax request at a time
    function getOldPosts() {
        if (!feedData.busy && feedData.posts.length > 0) {
            feedData.busy = true;

            getRecentPosts(function(posts) {
                var totalPosts = feedData.posts.length + posts.length;

                Posts.getPosts(0, totalPosts, function(posts) {
                    feedData.posts = feedData.posts.concat(posts);
                    feedData.busy = false;
                });
            });
        }
    }
    
    // Get recent posts and call the callback
    function getRecentPosts(callback) {
        var timestamp = 0;
        
        // Get the timestamp of the most recent post
        // If there are no posts set the timestamp to 0
        if (feedData.posts.length > 0) {
            timestamp = feedData.posts[0].timestamp;
        }
        
        Posts.getPosts(timestamp, 0, callback);
    }
    
    // Check for new posts
    function checkForNewPosts() {
        getRecentPosts(function(posts) {
            feedData.hasNewPosts = posts.length > 0;
        });
    }     
    
    // Return true if there are posts posts to be shown to the user
    function hasNewPosts() {
        return feedData.hasNewPosts;
    }
    
    // Reset all variables
    function reset() {
        feedData.posts = [];
        feedData.hiddenPosts = [];
        
        getAllRecentPosts();
        
        // Invoke checkForNewPosts() every minute
        $interval(function() {
            checkForNewPosts();
        }, 60000);
    }
    
    return {
        addPost: addPost,
        getFeed: getFeed,
        getOldPosts: getOldPosts,
        getAllRecentPosts: getAllRecentPosts,
        hasNewPosts: hasNewPosts,
        reset: reset
    }
})

.factory("Search", function($http, Connections, Message) {
    var searchData = {
        users: null,
        hasResults: false
    }
    
    // Follow a user and set the user at the given index in the list of users to 'following' if the request was successful
    function follow(data, index) {
        Connections.follow(data, function() {
            searchData.users[index].following = true;
        });
    }
    
    // Unfollow a user and set the user at the given index in the list of users to 'unfollowing' if the request was successful
    function unfollow(data, index) {
         Connections.unfollow(data, function() {
            searchData.users[index].following = false;
        });
    }
    
    // Get a list of users that match the given query
    function searchUsers(data) {
        $http.get("/search_users?query=" + data.query)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Store the list of users if the request was successful
                if (response.data.status == "success") {
                    searchData.hasResults = true;
                    searchData.users = response.data.users;
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    function getUsers() {
        return searchData.users;
    }
    
    // Return true if no results were returned from a search
    function isResultSetEmpty() {
        return (searchData.hasResults && (searchData.users == null || searchData.users.length == 0));
    }
    
    // Reset all variables
    function reset() {
        searchData.users = [];
        searchData.hasResults = false;
    }
    
    return {
        follow: follow,
        unfollow: unfollow,
        searchUsers: searchUsers,
        getUsers: getUsers,
        isResultSetEmpty: isResultSetEmpty,
        reset: reset
    }
})

.factory("Profile", function(Posts) {
    var profileData = {
        myPosts: []
    }
    
    // Return te list of posts written by the current user
    function getUserPosts () {
        return profileData.myPosts;
    }
    
    function reset(username) {
        Posts.getUserPosts(username, function(posts) {
            profileData.myPosts = posts;
        });
    }
    
    return {
        getUserPosts: getUserPosts,
        reset: reset
    }
})

// This factory stores data used by the followers widget
.factory("Followers", function(Connections) {
    var followersData = {
        followers: []
    }
    
    // Follow the user at the given index in the followers list
    function follow(data, index) {
        Connections.follow(data, function() {
            followersData.followers[index].following = true;
        });
    }
    
    // Unfollow the user at the given index in the followers list
    function unfollow(data, index) {
        Connections.unfollow(data, function () {
            followersData.followers[index].following = false;
        });
    }
    
    // Return the list of followers
    function getFollowers() {
        return followersData.followers;
    }
    
    // Return the number of followers the current user has
    function countFollowers() {
        return followersData.followers.length;
    }
    
    function reset(username) {
        Connections.getFollowers(username, function(followers) {
            followersData.followers = followers;
        });
    }
    
    return {
        follow: follow,
        unfollow: unfollow,
        getFollowers: getFollowers,
        countFollowers: countFollowers,
        reset: reset
    }
})

// This factory stores data used by the following widget
.factory("Following", function(Connections) {
    var followingData = {
        following: []
    }
    
    // Unfollow the user at the given index in the followers list
    // Remove the user from the following list if they were successfully unfollowed
    function unfollow(data, index) {
        Connections.unfollow(data, function () {
            followingData.following.splice(index, 1);
        });
    }
    
    // Return the list of users that follow the current user
    function getFollowing() {
        return followingData.following;
    }
    
    // Return the number of users following the current user
    function countFollowing() {
        return followingData.following.length;
    }
    
    function reset(username) {
        Connections.getFollowing(username, function(following) {
            followingData.following = following;
        });
    }
    
    return {
        unfollow: unfollow,
        getFollowing: getFollowing,
        countFollowing: countFollowing,
        reset: reset
    }
})

// Handle all post related actions
.factory("Posts", function($http, Message) {
    // Send an AJAX request to the server to add a new post
    function addPost(data, successCallback) {
        $http.post("/posts", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    successCallback();
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Get all posts written by the current user
    function getUserPosts(username, successCallback) {
        $http.get("/" + username + "/get_users_posts")
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Store the posts in a variable if the request was successful
                if (response.data.status == "success") {
                    successCallback(response.data.posts);
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Get posts written by the current user and who they follow
    function getPosts(timestamp, skip, successCallback) {
        var data = {
            timestamp: timestamp
        }
        
        $http.get("/posts?timestamp=" + timestamp + "&skip=" + skip)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    successCallback(response.data.posts);
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    return {
        addPost: addPost,
        getUserPosts: getUserPosts,
        getPosts: getPosts
    }
})

// The Connections factory handles all relationships between users
.factory("Connections", function($http, Message) {
    // Follow a user and call the successCallback if the request was successful
    function follow(data, successCallback) {
        $http.post("/following", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    successCallback();
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Unfollow a user and call the successCallback if the request was successful
    function unfollow(data, successCallback) {
        $http.delete("/following?email=" + data.email)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    successCallback();
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Retrieve a list of the users that follow the current user
    // If the request was successful call the successCallback
    function getFollowers(username, successCallback) {
        $http.get("/followers?username=" + username)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    successCallback(response.data.users);
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Retrieve a list of the users that the current user follows
    // If the request was successful call the successCallback
    function getFollowing(username, successCallback) {
        $http.get("/following?username=" + username)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    successCallback(response.data.users);
                } else {
                    Message.setMessage(response.data.message);
                    console.log("Error Message: " + Message.getMessage());
                }
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    return {
        follow: follow,
        unfollow: unfollow,
        getFollowers: getFollowers,
        getFollowing: getFollowing
    }
})

.factory("Message", function() {
    var messageData = {
        message: null
    }
    
    function getMessage() {
        return messageData.message;
    }
    
    function setMessage(message) {
        messageData = {
            message: message
        };
    }
    
    // Return true if there is a message
    function hasMessage() {
        return messageData.message && messageData.message.length > 0;
    }
    
    // Clear the message
    function clearMessage() {
        messageData.message = null;
    }
    
    return {
        getMessage: getMessage,
        setMessage: setMessage,
        hasMessage: hasMessage,
        clearMessage: clearMessage
    }
});