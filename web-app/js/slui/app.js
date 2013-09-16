'use strict';


var sluiApp = angular.module('slui', []);
sluiApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/front', {
        template: '<div><h1>Front Page</h1><inner template="d1"/></div>'
    }).when('/main', {
        template: '<div><h1>Main Page</h1><inner template="d2"/></div>'
    }).otherwise({
        redirectTo : '/front'
    });
}]);
sluiApp.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.name = "MainCtrl";
    $scope.foos = ['a','b','c'];
}])

sluiApp.directive('inner', ['$rootScope', '$compile', '$templateCache', '$http', function($rootScope, $compile, $templateCache, $http) {
    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
          template: '@',
          views: '='
      },
      template: '<div>HI</div>',
      controller: function($scope, $element, $attrs, $transclude) {
          $scope.views = ['d1','d2','d3'];
          $scope.view = 'd1';
          console.log("Controller called. All views: " + $scope.views);
          console.log("Controller called. Selected view: " + $attrs.template);
      },
      compile: function(element, attrs, linker) {
          return function($scope, $element, $attrs) {
              console.log("inner compile. watching: " + $attrs.template);
              $attrs.$observe('template', function(template) {
                if (template) {
                    var templateUrl = '/angular-test/directive/' + template;
                    console.log("inner template: " + templateUrl);
                    $http.get(templateUrl, {cache: $templateCache}).success(function(response) {
                      console.log("inner compile get html success: " + response);
                      var contents = element.html(response).contents();
                      console.log(contents);
                      $compile(contents)($scope);
                    });
                }
              });
          }
      },
      replace: true
    };
    return directiveDefinitionObject;
}]);
