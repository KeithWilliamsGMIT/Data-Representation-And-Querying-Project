angular.module ('app.services', [])

.factory("User", function($http, $location) {
    function register(data) {
        $http.post("/register_user", data)
            
        .then(
            function(response) {
                console.log("Request successful!");
                
                // Redirect to the feed page if the user successfully registered
                $location.path("/feed");
            },

            function(response) {
                console.log("Request failed!");
            }
        );
    }
    
    return {
        register: register
    }
});