'use strict';
dbMfgModule.controller('UserController', ['$scope', '$http','$timeout','alertService', 'icdb', '$location',
    function($scope, $http, $timeout, alertService, icdb, $location) {
    	
    	//
    	$scope.registerObj = {};
    	$scope.registerObj.formInput = {};


    	//
    	$scope.registerObj.isSignUpFormSubmitting = false;
    	$scope.registerObj.signUpBtnDisable = false;

    	/**
    	 *
    	 */
    	$scope.registerObj.postRegister = function(form) {

    		
    		if(!form.$valid) {
    			$scope.registerObj.isSignUpFormSubmitting = true;
    			return;
    		}



    		$scope.registerObj.isSignUpFormSubmitting = false;
    		$scope.registerObj.signUpBtnDisable = true;


    		$http.post('/api/user/register', $scope.registerObj.formInput).success(function(registerRes){

    			$scope.registerObj.signUpBtnDisable = false;

    			if(registerRes.status === 1) {
    				alertService.flash('error', registerRes.message, true);
    				return;
    			}


    			if(!registerRes.status) {
					alertService.flash('error', registerRes.message, true);    						
    				return;	
    			}


    			alertService.flash('success', 'Register Successfully.', true);
    			$scope.registerObj.formInput = {};
    			$location.path('/login');

    		});

    	}



    	//
    	$scope.loginObj = {};
    	$scope.loginObj.formInput = {};


    	//
    	$scope.loginObj.isLoginFormSubmitting = false;
    	$scope.loginObj.loginBtnDisable = false;

    	/**
    	 *
    	 */
    	$scope.loginObj.postLogin = function(form) {

    		
    		if(!form.$valid) {
    			$scope.loginObj.isLoginFormSubmitting = true;
    			return;
    		}



    		$scope.loginObj.isLoginFormSubmitting = false;
    		$scope.loginObj.loginBtnDisable = true;


    		$http.post('/login', $scope.loginObj.formInput).success(function(registerRes){


    			$scope.loginObj.loginBtnDisable = false;

    			if(!registerRes.status) {
					alertService.flash('error', registerRes.message, true);    						
    				return;	
    			}


    			alertService.flash('success', 'Register Successfully.', true);
    			$scope.loginObj.formInput = {};

    			$location.url('/dashboard');

    		});





    	}


    }
]);
