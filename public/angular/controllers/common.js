'use strict';
dbMfgModule.controller('CommonController', ['$scope', '$http','$timeout','alertService',
    function($scope, $http, $timeout, alertService) {
    	// alertService.flash('error', 'Profile has been updated successfully.', true);
    	alertService.flash('success', 'Profile has been updated successfully.', true);
    }
]);
