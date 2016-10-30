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
    
    return {
        register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getUserData: getUserData
    }
})

.factory("Message", function() {
    var data = {
        message: null
    }
    
    function getMessage() {
        return data.message;
    }
    
    function setMessage(message) {
        data = {
            message: message
        };
    }
    
    // Return true if there is a message
    function hasMessage() {
        return data.message && data.message.length > 0;
    }
    
    // Clear the message
    function clearMessage() {
        data.message = null;
    }
    
    return {
        getMessage: getMessage,
        setMessage: setMessage,
        hasMessage: hasMessage,
        clearMessage: clearMessage
    }
});