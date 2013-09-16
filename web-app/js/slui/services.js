'use strict';

//
// Service objects are defined here.
//
// In AngularJS services are singleton objects. Services are created by calling the factory() method on
// the application module. Like controllers services that have dependencies should use the list syntax
// to create the factory function to prevent problems from occurring if the JavaScript is minified.
//
// For example,
//
// var myApp = angular.module('myModule', []);
// myApp.factory('myService', ['dependency1', 'dependency2', function(dep1, dep2) {...}]);
//
// For more information see: http://docs.angularjs.org/guide/dev_guide.services.creating_services
//
sluiApp.factory('sluiI18n', ['$http', function($http) {
    console.log("Initializing I18N Factory");
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function formatArgs(args) {
        var params = {};
        var ndx = 0;
        for (var arg in args) {
            var item = args[arg];
            
            var name = 'args__.' + ndx++;
            if (typeof item === 'string') {
                params[name] = ':_string_:' + args[arg]; 
            } else {
                for (var type in item) {
                    if(item.hasOwnProperty(type)){
                        var value = item[type];
                        params[name] = ':_' + type + '_:' + value;
                        // only check the first property
                        break;
                    }
                }
            }
            console.log('param: ' + name + ' = ' + params[name]);
        }
        return params;
    }
    
    var i18nService = {
        getMessage: function(code, args, locale) {
            var params = formatArgs(args);
            params['__code'] = code;
            params['__locale'] = locale;
            params = $.param(params); 
            console.log("encoded params: " + params);
            
            // Set the appropriate headers for a form submission. See: http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1
            var config = {
                headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }
            return $http.post('i18n/getMessage', params, config);
        }  
    };
    
    return i18nService;
}]);

//register the interceptor as a service
sluiApp.factory('sluiHttpInterceptor', ['$q', '$location', function($q, $location) {
  return function(promise) {
    return promise.then(
        function(response) {
           console.log("Http Interceptor: Success Status = " + response.status);
           return response;
        },
        function(response) {
           console.log("Http Interceptor: Error Status = " + JSON.stringify(response));
//           return $q.reject(response);
           $location.path("/");
           return response;
        }
    );
  }
}]);