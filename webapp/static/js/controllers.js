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

.controller("feedCtrl", function() {
    
})

.controller("profileCtrl", function() {
    
})

.controller("searchCtrl", function() {
    
});