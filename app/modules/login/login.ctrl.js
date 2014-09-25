'use strict';

angular
	.module('projetobrasil.ufc.login.controllers',[]
	)
	.controller('LoginCtrl', function($rootScope, $scope, UserLogin){
		$scope.facebookLogin = function(){
			UserLogin.facebookLogin();
		};
	});
