angular.module ('app.controllers', [])

.controller('signUpCtrl', function($scope, User) {
    var signUpData = {
        name: "",
        email: "",
        password: "",
        reEnterPassword: ""
    }
    
    $scope.signUp = function() {
        User.register(signUpData);
    }
    
    $scope.signUpData = signUpData;
})

.controller('loginCtrl', function() {
    
})

.controller('feedCtrl', function() {
    
})

.controller('profileCtrl', function() {
    
})

.controller('searchCtrl', function() {
    
});