'use strict';

angular
	.module('projetobrasil.ufc.home', [
		'projetobrasil.ufc.home.controllers'
	])
	.config(function($stateProvider){
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'modules/home/home.html',
				controller: 'HomeCtrl'
			});
	});
