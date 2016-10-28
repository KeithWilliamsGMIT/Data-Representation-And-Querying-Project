angular.module ("app.directives", [])

// Directive adapted from http://jsfiddle.net/8mcedv3b/
// Find all child anchor tags in the element this directive is attached to
// When an anchor tag is clicked, add a class called 'active' to the parent element 
.directive("autoActiveLink", function ($location) {
    return {
        restrict: "A",
        replace: false,
        link: function (scope, elem) {
            
            // Called after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                
                // Browsers that don't support the HTML5 history API will fallback to hash-prefixed urls.
                var hrefs = [$location.path(),
                             "/#" + $location.path(),
                             "#" + $location.path()];
                
                angular.forEach(elem.find("a"), function (a) {
                    a = angular.element(a);
                    if (hrefs.indexOf(a.attr("href")) !== -1) {
                        a.parent().addClass("active");
                    } else {
                        a.parent().removeClass("active");   
                    };
                });     
            });
        }
    }
});