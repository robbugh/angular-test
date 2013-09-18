'use strict';

var myApp = angular.module('myApp', []);
myApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/front', {
        templateUrl: '/angular-test/template',
        controller: 'MainCtrl'
    }).otherwise({
        redirectTo : '/front'
    });
}]);

myApp.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.name = "MainCtrl";
    $scope.templates = ['template-1','template-2','template-3','template-4','template-5','template-6'];
}]);

myApp.directive('inner', ['$rootScope', '$compile', '$templateCache', '$http', function($rootScope, $compile, $templateCache, $http) {
    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
          name: '@',
          templates: '@',
          template: '=?'
      },
      template: '<div style="background: #ddd; padding: 10px; margin: 10px; border: 5px solid black"><h1>Directive Inner: Scope {{$id}}</h1><p>This directive contains a dynamic template</p>Select template to embed <select ng-model="template" ng-options="t for t in templateNames"></select><div style="background: #eee; margin: 10px; border: 5px solid black" id="inner-contents"/></div>',
      controller: function($scope, $element, $attrs, $transclude) {
          $scope.templateNames = $scope.$eval($scope.templates);
          $scope.childScopeCache = {};
          console.log("Directive: " + $scope.name + ", Scope ID: " + $scope.$id + ", Templates: " + $scope.templateNames);
          $scope.template = $scope.$parent.template;
          console.log("Setting template to: " + $scope.template);
      },
      compile: function(element, attrs, linker) {
          return function($scope, $element, $attrs) {
              $scope.$watch('template', function(template) {
                if (template) {
                    $scope.$parent.template = template;
                    var templateUrl = '/angular-test/template/' + template;
                    console.log("inner template: " + templateUrl);
                    $http.get(templateUrl, {cache: $templateCache}).success(function(response) {
                        $scope.childScope = $scope.childScopeCache[template];
                        if (!$scope.childScope) {
                            $scope.childScope = $scope.$new(true);
                            $scope.childScopeCache[template] = $scope.childScope;
                        }
                        console.log("childScope[" + template + "]: " + $scope.childScope.$id);
                        var contents = $element.find('#inner-contents').html(response).contents();
                        $compile(contents)($scope.childScope);
                    });
                }
              });
          }
      },
      replace: true,
      link: function(scope, element) {                  
          scope.$on("$destroy",function() {
              console.log("Destroy scope: " + scope.$id);
           });
      }
    };
    return directiveDefinitionObject;
}]);
