'use strict';

var sluiApp = angular.module('slui', []);
sluiApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/front', {
        template: '<div><h1>Front Page</h1><inner name="Top" templates="{{templates}}"/></div>',
        controller: 'MainCtrl'
    }).when('/main', {
        template: '<div><h1>Main Page</h1><inner name="Top" templates="{{templates}}"/></div>',
        controller: 'MainCtrl'
    }).otherwise({
        redirectTo : '/front'
    });
}]);

sluiApp.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.name = "MainCtrl";
    $scope.templates = ['d1','d2','d3'];
}]);

sluiApp.directive('inner', ['$rootScope', '$compile', '$templateCache', '$http', function($rootScope, $compile, $templateCache, $http) {
    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
          name: '@',
          templates: '@'
      },
      template: '<div style="background: #ddd; margin: 10px;"><h1>Directive Inner: {{name}}</h1><select ng-model="template" ng-options="t for t in templateNames"></select><div style="background: #eee; margin: 10px;" id="inner-contents"/></div>',
      controller: function($scope, $element, $attrs, $transclude) {
          $scope.templateNames = $scope.$eval($scope.templates);
          console.log("Controller called. Templates: " + $scope.templateNames);
          console.log("Controller called. Name:" + $scope.name + " Scope ID: " + $scope.$id);
      },
      compile: function(element, attrs, linker) {
          return function($scope, $element, $attrs) {
              $scope.$watch('template', function(template) {
                if (template) {
                    var templateUrl = '/angular-test/directive/' + template;
                    console.log("inner template: " + templateUrl);
                    $http.get(templateUrl, {cache: $templateCache}).success(function(response) {
                        console.log("inner compile get html success: " + response);
                        var contents = $element.find('#inner-contents').html(response).contents();
                        console.log("Contents: " + contents);
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
