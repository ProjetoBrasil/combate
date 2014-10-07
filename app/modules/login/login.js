'use strict';

angular
	.module('projetobrasil.ufc.login', [
		'projetobrasil.ufc.login.services'
	])
	// .run(function($location, UserLogin){
	// 	UserLogin.promise().then(function(){
	// 		if(!UserLogin.isUserLogged){
	// 			$location.path('/');
	// 		}
	// 	});
	// })
	.config(['$httpProvider', function ($httpProvider) {
	  $httpProvider.defaults.withCredentials = true;
	}])
	.run(['$rootScope', function($rootScope){
		$rootScope.apiBaseUrl = 'http://api.projetobrasil.org/v1/';
	}]);
