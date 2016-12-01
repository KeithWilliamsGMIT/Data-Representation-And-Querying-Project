angular.module ("app.controllers", [])

.controller("headerCtrl", function($scope, User) {
    $scope.logout = User.logout;
    $scope.isLoggedIn = User.isLoggedIn;
    $scope.getUsername = User.getUsername;
})

.controller("signUpCtrl", function($scope, User, Message) {
    $scope.signUp = User.register;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
})

.controller("loginCtrl", function($scope, User, Message) {
    $scope.login = User.login;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
})

.controller("feedCtrl", function($scope, $window, Feed, Message) {
    // Scroll to the top when of the page
    $window.scrollTo(0, 0);
    
    // Clear the post box when the form is submitted
    function addPost(data) {
        Feed.addPost(angular.copy(data));
        data.text = "";
    }
    
    $scope.addPost = addPost;
    $scope.getFeed = Feed.getFeed;
    $scope.getOldPosts = Feed.getOldPosts;
    $scope.hasNewPosts = Feed.hasNewPosts;
    $scope.getAllRecentPosts = Feed.getAllRecentPosts;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
})

.controller("profilePostsCtrl", function($scope, Profile) {
    $scope.getFeed = Profile.getUserPosts;
})

.controller("profileFollowersCtrl", function($scope, Followers) {
    $scope.follow = Followers.follow;
    $scope.unfollow = Followers.unfollow;
    $scope.getFollowers = Followers.getFollowers;
    $scope.countFollowers = Followers.countFollowers;
})

.controller("profileFollowingCtrl", function($scope, Following) {
    $scope.unfollow = Following.unfollow;
    $scope.getFollowing = Following.getFollowing;
    $scope.countFollowing = Following.countFollowing;
})

.controller("searchCtrl", function($scope, Search, Message) {
    $scope.searchUsers = Search.searchUsers;
    $scope.getUsers = Search.getUsers;
    $scope.follow = Search.follow;
    $scope.unfollow = Search.unfollow;
    $scope.isResultSetEmpty = Search.isResultSetEmpty;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
});