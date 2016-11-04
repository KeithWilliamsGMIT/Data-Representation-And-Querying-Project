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
                
                if (response.data.status != "success") {
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
    function getPosts() {
        $http.get("/get_posts")
        
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
    
    // Return all the posts in the feed
    function getFeed() {
        return feedData.posts;
    }
    
    // Reset all variables
    function reset() {
        feedData.posts = [];
        getPosts();
    }
    
    return {
        addPost: addPost,
        getFeed: getFeed,
        reset: reset
    }
})

.factory("Search", function($http, Message) {
    var searchData = {
        users: null
    }
    
    // Follow a user and set the user at the given index in the list of users to 'following' if the request was successful
    function follow(data, index) {
        $http.post("/follow", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    searchData.users[index].following = true;
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
    
    // Unfollow a user and set the user at the given index in the list of users to 'unfollowing' if the request was successful
    function unfollow(data, index) {
        console.log("UNFOLLOW");
        
        $http.post("/unfollow", data)
        
        .then(
            function(response) {
                console.log("Request successful!");
                
                if (response.data.status == "success") {
                    searchData.users[index].following = false;
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