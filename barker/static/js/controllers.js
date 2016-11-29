angular.module ("app.controllers", [])

.controller("headerCtrl", function($scope, User) {
    $scope.logout = User.logout;
    $scope.isLoggedIn = User.isLoggedIn;
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

.controller("feedCtrl", function($scope, Feed, Message) {
    // Clear the post box when the form is submitted
    function addPost(data) {
        Feed.addPost(angular.copy(data));
        data.text = "";
    }
    
    $scope.addPost = addPost;
    $scope.getFeed = Feed.getFeed;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
})

.controller("profilePostsCtrl", function($scope, Profile) {
    $scope.getFeed = Profile.getMyPosts;
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