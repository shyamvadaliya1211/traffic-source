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
        $rootScope.getCompanies();

        if (user) {
            $timeout(function() {
                try {
                    window.ampBot.show();
                    window.ampBot.getUserInfo(user);
                } catch(des) {

                }
            }, 10);
        }

        if(user == null || user == 'null') {
            user = false;
        }

        // Authenticated
        if (status && !user) {
            $timeout(deferred.reject);
            // setTimeout(function(){
            //     window.location = '/#!/';
            // },100);
            return;
        }

        //
        if (!status && user) {
            $timeout(deferred.reject);
            // window.location = '#!/company-preview';
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




var dbMfgModule = angular.module('AMP', ['ngCookies','ngResource','ui.router','ngAnimate']);


dbMfgModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',

    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({ enabled: false, requireBase: true }).hashPrefix('!');


        $stateProvider.state('/', {
            url: '/',
            templateUrl: '/angular/views/dashboard.html'
        });


        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/angular/views/users/login.html'
        });

        $urlRouterProvider.otherwise('/');
    }
]);