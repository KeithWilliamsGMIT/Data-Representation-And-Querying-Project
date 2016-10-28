angular.module ("app.controllers", [])

.controller("headerCtrl", function($scope, User) {
    $scope.logout = User.logout;
    $scope.isLoggedIn = User.isLoggedIn;
})

.controller("signUpCtrl", function($scope, User) {
    $scope.signUp = User.register;
})

.controller("loginCtrl", function($scope, User) {
    $scope.login = User.login;
})

.controller("feedCtrl", function() {
    
})

.controller("profileCtrl", function() {
    
})

.controller("searchCtrl", function() {
    
});