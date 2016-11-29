angular.module ("app.directives", [])

// Directive adapted from http://jsfiddle.net/8mcedv3b/
// Find all child anchor tags in the element this directive is attached to
// When an anchor tag is clicked, add a class called 'active' to the parent element
// And remove the 'active' class from all other parent tags
.directive("autoActiveLink", function ($state) {
    return {
        restrict: "A",
        replace: false,
        link: function (scope, elem) {
            
            // Called after the route has changed
            scope.$on("$stateChangeSuccess", function () {
                angular.forEach(elem.find("a"), function (a) {
                    a = angular.element(a);
                    if ($state.current.name == a.attr("ui-sref")) {
                        a.parent().addClass("active");
                    } else {
                        a.parent().removeClass("active");   
                    };
                });
            });
        }
    }
})

// Directive to apply a background image to specific pages
.directive("background", function ($state) {
    return {
        restrict: "A",
        replace: false,
        link: function (scope, elem) {
            
            // Called after the route has changed
            scope.$on("$stateChangeSuccess", function () {
                // List of states that the background should be applies to
                var states = [
                    "signup",
                    "login"
                ];
                
                // If the current state is in the list,
                // add the background class to the element that this directive is attached to.
                // Otherwise, remove the class from the element
                if (states.indexOf($state.current.name) >= 0) {
                    elem.addClass("background");
                } else {
                    elem.removeClass("background");   
                };
            });
        }
    }
})

.directive("posts", function(){
      return {
        restrict: "E",
        scope: false,
        templateUrl: "../static/partials/widgets/posts.html"
      }
})

.directive("users", function(){
      return {
        restrict: "E",
        scope: false,
        templateUrl: "../static/partials/widgets/users.html"
      }
});