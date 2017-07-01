/**
 *
 */

var checkUserIsLoggedOrNot = function($q, $timeout, $http, $location, $rootScope, status) {

    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/api/user/me').success(function(user) {

        $rootScope.gUser = {};
        $rootScope.loggedUser = user;
        $rootScope.gUser.loggedUser = user;

        // Authenticated
        if (status && !user) {
            $timeout(deferred.reject);
            return;
        }

        //
        if (!status && user) {
            $timeout(deferred.reject);
        }

    }).error(function() {
        $timeout(deferred.reject);
    });

    $timeout(deferred.reject);

    return deferred.promise;
}

// --
// Generate guid for QR code
var guid = (function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
      };
})();

// Check if the user is logged in
var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, true);
};

// Check if the user is logged in
var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope) {
    checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, false);
};




var dbMfgModule = angular.module('AMP', ['ngCookies','ngResource','ui.router','ngAnimate', 'toastr']);


dbMfgModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',

    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({ enabled: false, requireBase: true }).hashPrefix('!');


        $stateProvider.state('/', {
            url: '/',
            templateUrl: '/angular/views/users/login.html'
        });


        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/angular/views/users/login.html'
        });

        $stateProvider.state('forgot-password', {
            url: '/forgot-password',
            templateUrl: '/angular/views/users/forgot-password.html'
        });

        $stateProvider.state('register', {
            url: '/register',
            templateUrl: '/angular/views/users/register.html'
        });

        $stateProvider.state('reset-password', {
            url: '/reset-password',
            templateUrl: '/angular/views/users/reset-password.html'
        });



        $stateProvider.state('/dashboard', {
            url: '/dashboard',
            templateUrl: '/angular/views/dashboard.html',
            resolve: {
                loggedin: checkLoggedIn
            }
        });

        $urlRouterProvider.otherwise('/');
    }
]);