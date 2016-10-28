angular.module("app", ["app.directives", "app.controllers", "app.services", "ngRoute"])

// Adapted from https://devcereal.com/setting-flask-angularjs/
// Declare the URL routes for the webapp
.config(function($routeProvider, $locationProvider) {
    $routeProvider
    
    .when("/", {
        tite: "Sign Up",
        templateUrl: "/static/partials/signup.html",
        controller: "signUpCtrl"
    })
    
    .when("/login", {
        title: "Login",
        templateUrl: "/static/partials/login.html",
        controller: "loginCtrl"
    })
    
    .when("/feed", {
        title: "Feed",
        templateUrl: "/static/partials/feed.html",
        controller: "feedCtrl"
    })
    
    .when("/profile", {
        title: "Profile",
        templateUrl: "/static/partials/profile.html",
        controller: "profileCtrl"
    })
    
    .when("/search", {
        title: "Search",
        templateUrl: "/static/partials/search.html",
        controller: "searchCtrl"
    })
    
    // Default to the sign up page
    .otherwise({
        redirectTo: "/"
    });
    
    // Use the HTML5 History API
    $locationProvider.html5Mode(true);
})

.run(function($rootScope, $location, User) {
    // Redirect to the login page if the user is not logged in and is not on the sign up page
    if (!User.isLoggedIn() && $location.path() != "/") {
        $location.path("/login");
    }
    
    // Adapted from http://stackoverflow.com/questions/12506329/how-to-dynamically-change-header-based-on-angularjs-partial-view
    // Update the title when the route changes
    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        if (current.hasOwnProperty("$$route")) {
            $rootScope.title = current.$$route.title;
        }
    });
});