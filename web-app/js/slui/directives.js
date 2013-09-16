'use strict';

//
// Custom UI components should be created as an AngularJS directive. In other words, code that updates
// the DOM or binds to element events should be created as an AngularJS directive.
//

//
// Angular provides a number of built-in directives for manipulating CSS styling conditionally/dynamically:
//
// ng-class - use when the set of CSS styles is static/known ahead of time
// ng-style - use when you can't define a CSS class because the style values may change dynamically. Think programmable control of the style values.
// ng-show and ng-hide - use if you only need to show or hide something (modifies CSS)
// ng-if - new in version 1.1.5, use instead of the more verbose ng-switch if you only need to check for a single condition (modifies DOM)
// ng-switch - use instead of using several mutually exclusive ng-shows (modifies DOM)
// ng-disabled and ng-readonly - use to restrict form element behavior
// ng-animate - new in version 1.1.4, use to add CSS3 transitions/animations
//

//
// Call the AngularJS module.directive() method to create a directive. The directive method takes the following parameters:
// 1) The name of the directive. This is the name used in the HTML.
// 2) A factory function. The factory returns a function that implements the behavior of the directive or it returns a
//    directive definition object that contains several properties, some of which are explained below. See the link
//    at the end of this section below for more detail.
//    - template or templateUrl - the HTML partial to render for this directive.
//    - replace - whether to replace the original HTML markup for the directive or append to it.
//    - transclude - determines whether any HTML within the directive tag is preserved (embedded in the resulting HTML)
//    - restrict - determines how the directive can be used:
//          'E' - Element name: <my-directive></my-directive>
//          'A' - Attribute: <div my-directive="exp"> </div>
//          'C' - Class: <div class="my-directive: exp;"></div>
//          'M' - Comment: <!-- directive: my-directive exp -->
//    - link - function that implements the component's behavior
//
// For more information on directives see: http://docs.angularjs.org/guide/directive
//

//
// <login/> directive
//
// The 'login' directive creates the login UI on the index page. It works in conjunction with the LoginCtrl.
// See the partial template views/home/_login.gsp. The first line of the template is
//   <div id="loginRoot" ng-controller="LoginCtrl">
// Notice the 'ng-controller' attribute references the LoginCtrl. This is how the scope of the login directive is
// determined. If no 'ng-controller' is specified in the template then the first 'ng-controller' found going up
// in the HTML hierarchy determines the scope.
//
// The template for this directive contains a call to login(). This works because this method is defined in the
// LoginCtrl. Also, notice the template references the 'ng-enter' directive defined below.
sluiApp.directive('login', function() {
    var directiveDefinitionObject = {
      restrict: 'E',                // This directive define a new HTML element: <login></login> 
      templateUrl: 'home/login',    // Maps to views/home/_login.gsp on the Grails backend.
      replace: true                 // Throw away the <login></login> markup and replace it with the template HTML
    };
    return directiveDefinitionObject;
  });

//
// General purpose enter key event handler
//
// A few things to notice about how this directive is defined that is different from the login directive above.
// 1) It doesn't return a Directive Definition Object. It instead just returns a linking function. This is the
//    simplified form of the directive() API.
// 2) The default restrict value is attribute. Therefore this directive is used as an attribute within an
//    HTML element.
// 3) The name of the directive is mixed case. By convention this maps to an attribute name, "ng-enter".
// 4) Notice the use of $apply() in the linking method. The event handler bound to the key events
//    is called by the browser outside of the AngularJS runtime context. Calling the $apply() method
//    re-establishes the AngularJS runtime context which, in this case, allows the attrs.ngEnter to be
//    properly evaluated.
//
sluiApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

//
// It is not advised to pass the rootScope to a directive. Only exceptions
// are for directives that use AngularJs events.
//
sluiApp.directive("ngError", ['$rootScope', function ($rootScope) {
    return {
      restrict: "E",
      replace: true,
      template: '<div class="alert-box alert" ng-show="isError">{{errmsg}}</div>',
      link: function (scope) {
        $rootScope.$on("$routeChangeError", 
                       function (event, current, previous, rejection) {
          scope.isError = true;
          scope.errmsg = rejection
        });
      }
    }
}]);

//
// Directive listens for browser resize events and notifies the AngularJS runtime so other
// AngularJS components can respond accordingly.
//
sluiApp.directive("resize", ['$window', function($window) {
    return function(scope) {
        scope.width = $window.innerWidth;
        scope.height = $window.innerHeight;
        angular.element($window).bind('resize', function() {
            scope.$apply(function() {
                scope.width = $window.innerWidth;
                scope.height = $window.innerHeight;
                scope.$emit('sluiResizeEvent', {width: scope.width, height: scope.height});
            });
        });
    };
}]);

//
// Displays some diagnostic info
//
sluiApp.directive("diag", ['sluiI18n', 'ngI18nResourceBundle', function (sluiI18n, ngI18nResourceBundle) {
 return {
   restrict: "E",
   replace: true,
   template: '<div><div>{{resolvedMessage}}</div> \
       <select name="switchLanguage" ng-model="i18n.language" id="switchLanguage" ng-options="l.locale for l in languages"> \
   </select> \
   <div class=""> \
   Local: {{i18n.language}} \
   </div> \
   <p> \
       <table style="border: 1px solid black"> \
           <thead border> \
               <th>Code</th> \
               <th>Text</th> \
           </thead> \
           <tr ng-repeat="(key, value) in resourceBundle track by $index"> \
               <td  style="outline: thin solid black">{{key}}</td> \
               <td  style="outline: thin solid black">{{value}}</td> \
           </tr> \
       </table> \
   </p></div>',
   link: function (scope) {
       scope.msgs = [];

       // The resolvedMessage object is updated by calling the sluiI18n service to resolve a message code: 'foo-bar'
       scope.resolvedMessage = "foobar";
       sluiI18n.getMessage('foo-bar', [{number: 7}, {date: +new Date()}, {string: 'a disturbance in the Force'}]).success(function(resolvedMsg) {
           scope.resolvedMessage = resolvedMsg.text;
       });
   }
 };
}]);
