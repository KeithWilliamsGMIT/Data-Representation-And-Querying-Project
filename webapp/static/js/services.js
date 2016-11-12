angular.module ("app.services", [])

.factory("User", function($http, $location, Message) {
    var userData = {}
    
    // Send an AJAX request to the server to register a new user
    function register(data) {
        $http.post("/register", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Redirect to the feed page if the user successfully registered
                if (response.data.status == "success") {
                    userData = response.data.user;
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
    
    // Send an AJAX request to the server to login
    function login(data) {
        $http.post("/login", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Redirect to the feed page if the user successfully signed in
                if (response.data.status == "success") {
                    userData = response.data.user;
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
    
    // Send an AJAX request to the server to logout
    function logout() {
        $http.get("/logout")
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Clear user data
                userData = {};
                
                // Redirect to the login page
                $location.path("/login");
            },

            function(response) {
                console.log("Request failed!\n" + JSON.stringify(response));
            }
        );
    }
    
    // Return true if the user is logged in (userData is not an empty object)
    function isLoggedIn() {
        return !angular.equals({}, userData);
    }
    
    function getUserData() {
        return userData;
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
        getUserData: getUserData
    }
})

.factory("Feed", function($http, Message) {
    var feedData = {
        posts: []
    }
    
    // Send an AJAX request to the server to add a new post
    function addPost(data) {
        $http.post("/add_post", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    getAllRecentPosts();
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
    function getOwnPosts() {
        $http.get("/get_own_posts")
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Store the posts in a variable if the request was successful
                if (response.data.status == "success") {
                    feedData.posts = response.data.posts;
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
    
    // Get all recent posts written by the current user and who they follow
    function getAllRecentPosts() {
        var data = {
            timestamp: 0
        }
        
        if (feedData.posts.length > 0) {
            data.timestamp = feedData.posts[0].timestamp;
        }
        
        $http.post("/get_all_recent_posts", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Add the posts to the beginning of the list if the request was successful
                if (response.data.status == "success") {
                    if (feedData.posts.length == 0) {
                        // If there are no posts already, simply store the response
                        feedData.posts = response.data.posts;
                    } else {
                        // If there are posts previously requested it would be wasteful to request them a second time.
                        // Instead, retrieve te posts that were made since the timestamp of the most recent post.
                        // Add the posts to the start of list of posts.
                        // Looping through the posts in the response and using the unshift method are both O(n) operations.
                        // This might lead to performance problems if theres a lot of posts in the reponse,
                        // or if there's a lot of posts that have to be shifted.
                        for (var i = response.data.posts.length - 1; i >= 0; --i) {
                            feedData.posts.unshift(response.data.posts[i]);
                        }
                    }
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
    
    // Return all the posts in the feed
    function getFeed() {
        return feedData.posts;
    }
    
    // Reset all variables
    function reset() {
        feedData.posts = [];
    }
    
    return {
        addPost: addPost,
        getOwnPosts: getOwnPosts,
        getAllRecentPosts: getAllRecentPosts,
        getFeed: getFeed,
        reset: reset
    }
})

.factory("Search", function($http, Connections, Message) {
    var searchData = {
        users: null
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
        $http.post("/search_users", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Store the list of users if the request was successful
                if (response.data.status == "success") {
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
    
    // Reset all variables
    function reset() {
        searchData.users = [];
    }
    
    return {
        follow: follow,
        unfollow: unfollow,
        searchUsers: searchUsers,
        getUsers: getUsers,
        reset: reset
    }
})

.factory("Profile", function(Connections) {
    var profileData = {
        followers: [],
        following: []
    }
    
    // Retrieve a list of all the users that follow this user and store them in a list
    function getFollowers() {
        Connections.getFollowers(function(followers) {
            profileData.followers = followers;
        });
    }
    
    // Retrieve a list of all the users that this user follows and store them in a list
    function getFollowing() {
        Connections.getFollowing(function(following) {
            profileData.following = following;
        });
    }
    
    // Return the number of followers the current user has
    function countFollowers() {
        return profileData.followers.length;
    }
    
    // Return the number of users the current user follows
    function countFollowing() {
        return profileData.following.length;
    }
    
    function reset() {
        getFollowers();
        getFollowing();
    }
    
    return {
        getFollowers: function() { return profileData.followers; } ,
        getFollowing: function() { return profileData.following; },
        countFollowers: countFollowers,
        countFollowing: countFollowing,
        reset: reset
    }
})

.factory("Connections", function($http, Message) {
    // Follow a user and call the successCallback if the request was successful
    function follow(data, successCallback) {
        $http.post("/follow", data)
        
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
        $http.post("/unfollow", data)
        
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
    function getFollowers(successCallback) {
        $http.get("/get_followers")
        
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
    function getFollowing(successCallback) {
        $http.get("/get_following")
        
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