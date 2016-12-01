angular.module("app", ["app.directives", "app.controllers", "app.services", "ui.router", "infinite-scroll"])

// Adapted from https://devcereal.com/setting-flask-angularjs/
// Declare the URL routes for the webapp
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state("signup", {
        title: "Sign Up",
        url: "/",
        templateUrl: "/static/partials/signup.html",
        controller: "signUpCtrl"
    })
    
    .state("login", {
        title: "Login",
        url: "/login",
        templateUrl: "/static/partials/login.html",
        controller: "loginCtrl"
    })
    
    .state("feed", {
        title: "Feed",
        url: "/feed",
        templateUrl: "/static/partials/feed.html",
        controller: "feedCtrl"
    })
    
    .state("profile", {
        title: "Profile",
        url: "/profile/:username",
        templateUrl: "/static/partials/profile.html"
    })
    
    .state('profile.posts', {
        title: "Profile",
        url: '/posts',
        templateUrl: "/static/partials/widgets/posts.html",
        controller: "profilePostsCtrl"
    })
    
    .state("profile.followers", {
        title: "Profile",
        url: "/followers",
        templateUrl: "/static/partials/profile/followers.html",
        controller: "profileFollowersCtrl"
    })
    
    .state("profile.following", {
        title: "Profile",
        url: "/following",
        templateUrl: "/static/partials/profile/following.html",
        controller: "profileFollowingCtrl"
    })
    
    .state("search", {
        title: "Search",
        url: "/search",
        templateUrl: "/static/partials/search.html",
        controller: "searchCtrl"
    });
    
    // Default to the sign up page
    $urlRouterProvider.otherwise("/");
    
    // Use the HTML5 History API
    // Needed to remove hashbangs
    $locationProvider.html5Mode(true);
})

.run(function($rootScope, $state, $stateParams, $stateParams, $location, User, Feed, Profile, Followers, Following, Search, Message) {
    $rootScope.title = $state.current.title;
    
    // Redirect to the login page if the user is not logged in and is not on the sign up page
    if (!User.isLoggedIn() && $location.path() != "/") {
        $location.path("/login");
    }
    
    $rootScope.$on("$stateChangeSuccess", function (event, current, previous) {
        // clear any messages when the route changes
        Message.clearMessage();
        
        // Adapted from http://stackoverflow.com/questions/12506329/how-to-dynamically-change-header-based-on-angularjs-partial-view
        // Update the title when the route changes
        $rootScope.title = current.title;
        
        // Reset factory variables when the user navigates to the view
        if (current.name == "feed") {
            Feed.reset();
        } else if (current.name == "profile.posts") {
            Profile.reset($stateParams.username);
        } else if (current.name == "profile.followers") {
            Followers.reset($stateParams.username);
        } else if (current.name == "profile.following") {
            Following.reset($stateParams.username);
        } else if (current.name == "search") {
            Search.reset();
        }
    });
});