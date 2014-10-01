'use strict';

angular
	.module('projetobrasil.ufc.login', [
		'projetobrasil.ufc.login.controllers',
		'projetobrasil.ufc.login.services'
	]).config(function($stateProvider){
		$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'modules/login/login.html'
				});
	}).config(['$httpProvider', function ($httpProvider) {
	  $httpProvider.defaults.withCredentials = true;
	}]);;
