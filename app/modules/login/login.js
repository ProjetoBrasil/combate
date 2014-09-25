'use strict';

angular
	.module('projetobrasil.ufc.login', [
		'projetobrasil.ufc.login.controllers',
		'projetobrasil.ufc.login.services',
		'facebook'
	]).config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('1520150961538128');
  }).config(function($stateProvider){
		$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'modules/login/login.html'
				});
	});
