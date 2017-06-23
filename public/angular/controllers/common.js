'use strict';

// dbMfgModule.controller('CommonController', ['$scope', 'Global', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', 'icdb', '$interval', '$q', '$sce',
//     function($scope, Global, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, icdb, $interval, $q, $sce) {

//         alert('call');


//     }
// ]);

dbMfgModule.controller('CommonController', ['$scope', '$http','$timeout','alertService',
    function($scope, $http, $timeout, alertService) {
    	// alertService.flash('error', 'Profile has been updated successfully.', true);
    	alertService.flash('success', 'Profile has been updated successfully.', true);
    }
]);
