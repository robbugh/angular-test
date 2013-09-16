'use strict';

// AngularJS follow the MVC pattern. This file contains the controllers used by the application.
//
// One of the main purposes of a controller is to manage the data model used by the view. This is done
// by setting variables on the $scope object. The controller scope is a prototypical descendant of the
// root scope that was created when the application bootstrapped. The controller has the option to 
//
// For more information on $scope see: http://docs.angularjs.org/api/ng.$rootScope.Scope

//
// sluiApp is a module and is defined in app.js.
//
// Call the sluiApp.controller() method to create a controller object. The parameters are:
//     1) Name of the controller - by convention the name should start with capital letter and ends with
//        "Ctrl" or "Controller".
//     2) A list of injected service names followed lastly by the controller function. Service names
//          starting with a '$' are AngularJS built-in services. 
//
// The ViewCtrl shown below uses the $scope service so the first item in the list is the name of the scope service.
// The second item is the function that encapsulates the business logic of the controller. Note the service
// objects are also passed to the function in the same order as they appear in the list.
//
var viewCtrl = sluiApp.controller("ViewCtrl", ['$scope', 'ngI18nResourceBundle', 'ngI18nConfig', function ($scope, ngI18nResourceBundle, ngI18nConfig) {
    // update the scope by assigning values to it. The 'foo' object can now be used to update the view.
    $scope.foo = 'bar'
}]);

// Controllers can have addition methods. In this case, the method is called by the $routeProvider when
// a request is made to change the browser URL to '/'. See $routeProvider code in 'app.js'.
//
// Notice also, that the method is defined using the same syntax used to define a controller. This is to
// prevent service injection from breaking if the JavaScript were to be minified. The list should
// name the services in the same order as used by the function.
//
// This is an example of a route resolve method. The 'promise' service, $q, and the timer service, $timeout,
// are injected into the method. The method doesn't do anything except wait one second before resolving
// the promise.
viewCtrl.loadData = ['$q', '$timeout', function ($q, $timeout) {
    var defer = $q.defer();
    $timeout(function () {
        defer.resolve();
    }, 1000);
    return defer.promise;
}];

var i18nCtrl = sluiApp.controller("I18nCtrl", ['$scope', 'ngI18nConfig', 'ngI18nResourceBundle', function ($scope, ngI18nConfig, ngI18nResourceBundle) {
    $scope.languages = [
        {locale:"en"}
    ];
    
    $scope.i18n = {language: $scope.languages[0]};
    
    $scope.$watch('ngI18nConfig.supportedLocales', function (languages) {
        $scope.languages = [];
        for (var i = 0; i < ngI18nConfig.supportedLocales.length; i++) {
            $scope.languages.push({locale: ngI18nConfig.supportedLocales[i]});
        }
    });
    
    $scope.resourceBundle = [];
    
    $scope.$watch('i18n.language', function (language) {
        ngI18nResourceBundle.get({locale: language.locale}).success(function (resourceBundle) {
            $scope.resourceBundle = resourceBundle;
        });
    });
}]);

//
// The main controller is used to manage the scope of the '/main/' route.
//
var mainCtrl = sluiApp.controller("MainCtrl", ['$scope', function ($scope) {
    $scope.goHome = function() {
        console.log('Home button clicked');
    };
    
    $scope.wrapperStyle = function() {
        var style = {
            width: $scope.width,
            height: $scope.height,
            overflow: 'hidden',
            position: 'relative'
        };
        return style;
    };
    
    $scope.mainWrapperStyle = function() {
        var style = {
            position: 'absolute',
            margin: 0,
            left: 0,
            right: 231,
            top: 90,
            bottom: 33,
            height: $scope.height - 124,
            width: $scope.width - 225,
            'z-index': 1,
            display: 'block',
            visibility: 'visible'
        };
        return style;
    }
    
    $scope.sidebarWrapperStyle = function() {
        var style = {
            position: 'absolute',
            margin: 0,
            left: 'auto',
            right: 0,
            top: 90,
            bottom: 33,
            height: $scope.height - 124,
            'z-index': 1,
            width: 225,
            display: 'block',
            visibility: 'visible'
        };
        return style;
    }
}]);

//
// The login controller is used to manage the scope of the 'login' directive. Notice this controller
// uses the $http and $location AngularJS services, in addition to the $scope service.
// 
// The $http service is used for making ajax calls back to the Grails backend.
//
// The $location service is used for changing the browser's URL, e.g., for changing views.
//
var loginCtrl = sluiApp.controller("LoginCtrl", ['$scope', '$http', '$location', function ($scope, $http, $location) {
    //
    // Define the login() method used in the 'login' directive.
    // 
    $scope.login = function(userName, password, rememberme) {
        // $.param is a convenience method for building a URL query string. Encode the login credentials
        // as a query string.
        var params = $.param({j_username: userName, j_password: password, _spring_security_remember_me: rememberme});
        
        // Set the appropriate headers for a form submission. See: http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1
        var config = {
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }
        
        // Now post an ajax call to the Spring Security controller on the Grails backend passing the login credentials
        // If login is successful change the route to '/main', otherwise, set an error message on the data object
        // of the scope. The 'login' directive will display the error message if it is set.
        $http.post('j_spring_security_check', params, config)
            .success(function(data, status) {
                $scope.status = status;
                $location.path("/main");
            })
            .error(function(data, status) {
                $scope.status = status;
                // TODO: Need to use message bundle here.
                $scope.data = {error: "Request failed"};
            });
        }
}]);

var logoutCtrl = sluiApp.controller("LogoutCtrl", ['$scope', '$http', '$location', function ($scope, $http, $location) {
    //
    // Define the login() method used in the 'login' directive.
    // 
    $scope.logout = function() {
        $http.get('logout')
            .success(function(data, status) {
                console.log("Successfully logged out");
                $location.path("/");
            })
            .error(function(data, status) {
                console.log("Failed to log out. Status: " + status);
            });
        }
}]);