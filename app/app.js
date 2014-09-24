'use strict';

/**
 * @ngdoc overview
 * @name projetobrasil.ufc
 * @description
 * # projetobrasil.ufc
 *
 * Main module of the application.
 */
angular
	.module('projetobrasil.ufc', [
		'ngResource',
		'ngSanitize',
		'ui.router',
		'ui.bootstrap',
		'angular-lodash',
		'projetobrasil.ufc.interface'
	])
	.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise('/');

		$stateProvider
				.state('home', {
					url: '/',
					templateUrl: 'modules/interface/interface.html',
					controller: 'InterfaceCtrl'
				});
	});
