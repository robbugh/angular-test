'use strict';

/* App Module */
console.log("Angular: " + JSON.stringify(angular));

//
// Slui Config Module
//
// This module holds configuration variables for the Slui Application. The configuration variables
// are passed to the module via a sluiConfig object found in a <script> tag in the index.gsp. This
// allows the server to send parameters to AngularJS on page load. 
//
angular.module('sluiConfig', []).config(['$provide', function($provide) {
    //
    // Grab the sluiConfig from the global context.
    //
    if (typeof sluiConfigParams == 'undefined' || sluiConfigParams == 'undefined') {
        sluiConfigParams = {languages: ['en']};
    } else {
        sluiConfigParams.languages = sluiConfigParams.languages || ['en'];
    }
    
    //
    // Create a sluiConfig object in the context of this module.
    //
    $provide.value('sluiConfig', sluiConfigParams);
}]);

//
// The variable "angular" is defined by AngularJS. Use it to define your application module.
// The app name, i.e., "slui", must be referenced by your HTML, for example, in the <HTML> tag.
//
// <html ng-app="slui">
//
// This tells AngularJS that you want it to manage the html tag and all of its content.
//
// The $routeProvider is a service object that controls which view is rendered based on the
// browser's URL. When the URL changes the matching 'when' method is executed. For example, if the route is
// changed to: "http://host:port/rdc/" the route segment is "/" and will match the first 'when'.
// 
// The 'when' method takes two parameters, 1) a string representing a URL route segment, 2) an object with the following
// properties,
//    template or templateUrl - the HTML template to display
//    controller - the AngularJS controller that is invoked. The controller's main task is to update the scope object
//                 used to interpolate the "{{substitution}}" variables in the HTML.
//    resolve - an optional map of dependencies that are injected into the controller before the new view is rendered.
//              If any dependency is a 'promise' object it is resolved and its value injected into the controller. If
//              the promise fails to resolve (because its reject() method was called) the route change is aborted.
//                 In the example below for the '/' route, the resolve map references the viewCtrl.loadData() method.
//              This method will be executed and its results injected in the controller. The implementation of this
//              method, however, returns a 'promise' object. See http://docs.angularjs.org/api/ng.$q for more details.
//              When the promise completes its return value determines whether the route change succeeds or not. If the
//              promise fails the $routeProvider will broadcast a $routeChangeError event. Otherwise, it will update the
//              view and broadcast a $routeChangeSuccess event. Other components can listen for these events and react
//              accordingly.
//                 See http://docs.angularjs.org/api/ng.$routeProvider for more details.

//
// This is the module that represents your AngularJS application. All other modules such as controllers, directives,
// services, and filters are created by calling methods on this object. AngularJS supports method chaining. For example,
// in the code below the 'slui' module is created followed by the chained call to the config() method.
//
// The config() method is executed on module load. One or more can be chained together. This method is useful for service
// configuration as shown below for the $routeProvider service.
//
// Note, the 'ngResource' dependency used in the call to module() pulls in the $resource service. This is AngularJS's API for 
// calling restful backend services. It depends on angular_resource.js.
//
var sluiApp = angular.module('slui', ['sluiConfig', 'ngI18n', 'ngResource', 'ui.router', 'ngGrid']);
sluiApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

//    $httpProvider.responseInterceptors.push('sluiHttpInterceptor');
  
    $urlRouterProvider
        .when('/home', '/')
        .otherwise('/');
    
    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: 'home',
            resolve: {
              applyCss : function() {
                  angular.element('head link#viewCss').remove();
                  angular.element('head').append('<link id="viewCss" rel="stylesheet" type="text/css" href="res/app/index.css" rel="stylesheet"/>');
              }
            }
        })
        .state('main', {
            url: '/main?label&menuName&commandName',
            views: {
                '': {
                    templateUrl: 'main',
                    controller: "MainCtrl",
                    resolve: {
                        applyCss : function() {
                            angular.element('head link#viewCss').remove();
                            angular.element('head').append('<link id="viewCss" rel="stylesheet" type="text/css" href="res/app/main.css" rel="stylesheet"/>');
                        }
                    }
                },
                'contentView@main': {
                    template: '<div class="emboss">Content: {{label}}</div>',
                    controller: ['$scope', '$stateParams', 'sluiI18n', 'ngI18nResourceBundle', function ($scope, $stateParams, sluiI18n, ngI18nResourceBundle) {
                        console.log("Showing /main: " + JSON.stringify($stateParams));
                        $scope.label = $stateParams.label;
                    }]
                },
                'sidebarView@main': {
                    template: '<div style="position: absolute; top: 200px; width: 100%"><div class="rotate">Sidebar: {{label}}</div></div>'
                }
            }
        })
        .state('main.diag', {
            url: '/diag',
            views: {
                'contentView@main': {
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
                    controller: ['$scope', 'sluiI18n', 'ngI18nResourceBundle', function ($scope, sluiI18n, ngI18nResourceBundle) {
                        console.log("Setting Main contentView");
                        $scope.msgs = [];

                        // The resolvedMessage object is updated by calling the sluiI18n service to resolve a message code: 'foo-bar'
                        $scope.resolvedMessage = "foobar";
                        sluiI18n.getMessage('foo-bar', [{number: 7}, {date: +new Date()}, {string: 'a disturbance in the Force'}]).success(function(resolvedMsg) {
                            $scope.resolvedMessage = resolvedMsg.text;
                        })
                    }]
                }
            }
        })
        .state('main.tbd', {
            url: '/tbd',
            views: {
                'contentView@main': {
                    template: '<div id="tab-wrapper" class="clearfix" ui-view="tabView" ng-animate="{enter:\'fade-enter\'}"></div><div id="breadcrumb-wrapper" class="clearfix" ui-view="breadcrumbView" ng-animate="{enter:\'fade-enter\'}"></div><div id="content-wrapper" class="clearfix"><div class="emboss">Content: {{label}}</div></div>'
                },
                'tabView@main.tbd': {
                    template: '<div id="section-menu-identify-manage" class="section-menu"><ul><li class="identify-data-manage identify-data-edit"><a href="" class="active">Manage Data</a></li><li class="identify-customfield-manage identify-customfield-edit"><a href="">Manage Custom Fields</a></li></ul></div>'
                },
                'breadcrumbView@main.tbd': {
                    template: '<ul><li id="step-0"><a href=""><span class="title">{{menuName}}</span> <span class="text">{{commandName}}</span></a></li></ul>'
                },
                'sidebarView': {
                    template: '<div style="position: absolute; top: 200px; width: 100%"><div class="rotate">Sidebar: {{label}}</div></div>'
                }
            }
        })
        .state('main.customerconfig', {
            url: '/custconfig',
            views: {
                'contentView@main': {
                    templateUrl: 'customerConfig',
                    controller: ['$scope', 'sluiI18n', 'ngI18nResourceBundle', 'grailsBackend', '$state', '$http', function ($scope, sluiI18n, ngI18nResourceBundle, grailsBackend, $state, $http) {
                        console.log("Customer Configuration");
                        
                        // Test data
                        $scope.filterOptions = {
                            filterText: "",
                            useExternalFilter: true
                        };
                        
                        $scope.totalServerItems = 0;
                        
                        $scope.pagingOptions = {
                            pageSizes: [250, 500, 1000],
                            pageSize: 250,
                            currentPage: 1
                        };
                        
                        $scope.setPagingData = function(data, page, pageSize) {  
                            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                            $scope.myData = pagedData;
                            $scope.totalServerItems = data.length;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        };
                        
                        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
                            setTimeout(function () {
                                var data;
                                if (searchText) {
                                    var ft = searchText.toLowerCase();
                                    $http.get('customerConfig/list').success(function (largeLoad) {        
                                        data = largeLoad.filter(function(item) {
                                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                        });
                                        $scope.setPagingData(data,page,pageSize);
                                    });            
                                } else {
                                    $http.get('customerConfig/list').success(function (largeLoad) {
                                        $scope.setPagingData(largeLoad,page,pageSize);
                                    });
                                }
                            }, 500);
                        };
                        
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                        
                        $scope.$watch('pagingOptions', function (newVal, oldVal) {
                            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                              $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                            }
                        }, true);
                        
                        $scope.$watch('filterOptions', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                              $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                            }
                        }, true);
                        
                        $scope.gridOptions = {
                            data: 'myData',
                            enablePaging: true,
                            showFooter: true,
                            totalServerItems: 'totalServerItems',
                            pagingOptions: $scope.pagingOptions,
                            filterOptions: $scope.filterOptions,
                            enableCellSelection: true,
                            enableRowSelection: false,
                            enableCellEdit: true,
                        };
                        
                        $scope.show = function(item) {
                            $state.go('main.customerconfig.show', { configId: item.id });
                        };
                    }],
                    resolve: {
//                        load: ['$http', '$rootScope', function ($http, $rootScope) {
//                            console.log("loading customer configs..");
//                            $http.get('customerConfig/list')
//                                .success(function(data, status) {
//                                    console.log("Successfully got config list");
//                                    $rootScope.customerConfigs = data
//                                })
//                                .error(function(data, status) {
//                                    console.log("Failed to customer config. Status: " + status);
//                                });
//                        }]
                    }
                },
                'tabView@main.customerconfig': {
                    template: '<div id="section-menu-identify-manage" class="section-menu"><ul><li class="identify-data-manage identify-data-edit"><a href="" class="active">Manage Data</a></li><li class="identify-customfield-manage identify-customfield-edit"><a href="">Manage Custom Fields</a></li></ul></div>'
                },
                'breadcrumbView@main.customerconfig': {
                    template: '<ul><li id="step-0"><a href=""><span class="title">Administration</span> <span class="text">Customer Configure</span></a></li></ul>'
                },
            }
        })
}]);
    
//
// Initialize the SluiApp
//
sluiApp.run(['sluiConfig', 'ngI18nConfig', '$rootScope', '$state', '$stateParams', function(sluiConfig, ngI18nConfig, $rootScope, $state, $stateParams) {
    //
    // Configure the I18N module
    //
    ngI18nConfig.defaultLocale = 'en';
    ngI18nConfig.supportedLocales = sluiConfig.languages;
    ngI18nConfig.basePath = 'i18n/bundle';
    ngI18nConfig.controller = 'i18n';
    ngI18nConfig.cache = false;
    
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

sluiApp.factory('grailsBackend', function($resource) {
    var baseUrl = $('body').data('base-url');

    return $resource(baseUrl + ':action/:id', {id: '@id'}, {
        list: {method: 'GET', params: {action: 'list'}, isArray: true},
        get: {method: 'GET', params: {action: 'get'}},
        save: {method: 'POST', params: {action: 'save'}},
        update: {method: 'POST', params: {action: 'update'}},
        delete: {method: 'POST', params: {action: 'delete'}}
    });
});

var i18nCtrl = sluiApp.controller("I18nCtrl", ['$scope', 'ngI18nConfig', 'ngI18nResourceBundle', function ($scope, ngI18nConfig, ngI18nResourceBundle) {
    $scope.languages = [
        {locale:"en"}
    ];
    
    $scope.i18n = {language: $scope.languages[0]};
    
    $scope.$watch('ngI18nConfig.supportedLocales', function (languages) {
        console.log("Updating ngI18N supported locales: " + JSON.stringify(languages));
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
//The main controller is used to manage the scope of the '/main/' route.
//
var mainCtrl = sluiApp.controller("MainCtrl", [ '$state', '$stateParams', '$scope', function($state, $stateParams, $scope) {
    console.log("MainCtrl");
    
    $scope.label = $stateParams.label;
    $scope.menuName= $stateParams.menuName;
    $scope.commandName = $stateParams.commandName;

    $scope.goMain = function() {
        console.log('Home button clicked');
        $state.go('main', {label: 'Main'});
    };

    $scope.tbd = function(label, menuName, commandName) {
        console.log('Switching to TBD: ' + label + ':' + menuName + ':' + commandName);
        $state.go('main.tbd', {label: label, menuName: menuName, commandName: commandName});
    };
    
    $scope.showMessages = function() {
        console.log('Show Messages button clicked');
        $state.go('main.diag', {label: 'Show Messages', menuName: 'Debug', commandName: 'Show Messages'});
    };
    
    $scope.configureCustomers = function() {
        console.log('Customer Configure button clicked');
        $state.go('main.customerconfig', {label: 'Customer Config', menuName: 'Administration', commandName: 'Customer Config'});
    }; 

    $scope.wrapperStyle = function() {
        var style = {
            width : $scope.width,
            height : $scope.height,
            overflow : 'hidden',
            position : 'relative'
        };
        return style;
    };

    $scope.mainWrapperStyle = function() {
        var style = {
            position : 'absolute',
            margin : 0,
            left : 0,
            right : 231,
            top : 96,
            bottom : 33,
            height : $scope.height - 129,
            width : $scope.width - 225,
            'z-index' : 1,
            display : 'block',
            visibility : 'visible'
        };
        return style;
    }

    $scope.sidebarWrapperStyle = function() {
        var style = {
            position : 'absolute',
            margin : 0,
            left : 'auto',
            right : 0,
            top : 96,
            bottom : 33,
            height : $scope.height - 129,
            'z-index' : 1,
            width : 225,
            display : 'block',
            visibility : 'visible'
        };
        return style;
    }
} ]);

//
// <login/> directive
//
//The 'login' directive creates the login UI on the index page. It works in conjunction with the LoginCtrl.
//See the partial template views/home/_login.gsp. The first line of the template is
//<div id="loginRoot" ng-controller="LoginCtrl">
//Notice the 'ng-controller' attribute references the LoginCtrl. This is how the scope of the login directive is
//determined. If no 'ng-controller' is specified in the template then the first 'ng-controller' found going up
//in the HTML hierarchy determines the scope.
//
//The template for this directive contains a call to login(). This works because this method is defined in the
//LoginCtrl. Also, notice the template references the 'ng-enter' directive defined below.
sluiApp.directive('login', function() {
 var directiveDefinitionObject = {
   restrict: 'E',                // This directive define a new HTML element: <login></login> 
   templateUrl: 'home/login',    // Maps to views/home/_login.gsp on the Grails backend.
   replace: true                 // Throw away the <login></login> markup and replace it with the template HTML
 };
 return directiveDefinitionObject;
});

//
//The login controller is used to manage the scope of the 'login' directive. Notice this controller
//uses the $http and $location AngularJS services, in addition to the $scope service.
//
//The $http service is used for making ajax calls back to the Grails backend.
//
//The $location service is used for changing the browser's URL, e.g., for changing views.
//
var loginCtrl = sluiApp.controller("LoginCtrl", ['$scope', '$state', '$http', '$location', function ($scope, $state, $http, $location) {
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
             $state.go('main', {label: 'Main'});
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

//
//General purpose enter key event handler
//
//A few things to notice about how this directive is defined that is different from the login directive above.
//1) It doesn't return a Directive Definition Object. It instead just returns a linking function. This is the
// simplified form of the directive() API.
//2) The default restrict value is attribute. Therefore this directive is used as an attribute within an
// HTML element.
//3) The name of the directive is mixed case. By convention this maps to an attribute name, "ng-enter".
//4) Notice the use of $apply() in the linking method. The event handler bound to the key events
// is called by the browser outside of the AngularJS runtime context. Calling the $apply() method
// re-establishes the AngularJS runtime context which, in this case, allows the attrs.ngEnter to be
// properly evaluated.
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
//Directive listens for browser resize events and notifies the AngularJS runtime so other
//AngularJS components can respond accordingly.
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
//Service objects are defined here.
//
//In AngularJS services are singleton objects. Services are created by calling the factory() method on
//the application module. Like controllers services that have dependencies should use the list syntax
//to create the factory function to prevent problems from occurring if the JavaScript is minified.
//
//For example,
//
//var myApp = angular.module('myModule', []);
//myApp.factory('myService', ['dependency1', 'dependency2', function(dep1, dep2) {...}]);
//
//For more information see: http://docs.angularjs.org/guide/dev_guide.services.creating_services
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
//        return $q.reject(response);
        $location.path("/");
        return response;
     }
 );
}
}]);

