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
    $scope.addPost = Feed.addPost;
    $scope.getFeed = Feed.getFeed;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
})

.controller("profileCtrl", function() {
    
})

.controller("searchCtrl", function($scope, Search, Message) {
    $scope.searchUsers = Search.searchUsers;
    $scope.getUsers = Search.getUsers;
    $scope.follow = Search.follow;
    $scope.unfollow = Search.unfollow;
    $scope.getMessage = Message.getMessage;
    $scope.hasMessage = Message.hasMessage;
});