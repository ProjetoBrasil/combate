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
		'projetobrasil.ufc.interface',
		'projetobrasil.ufc.propostas',
		'projetobrasil.ufc.personagem'
		'projetobrasil.ufc.interface',
		'projetobrasil.ufc.login'
	])

	.run(['$rootScope', function($rootScope){
		$rootScope.apiBaseUrl = 'http://api.projetobrasil.org:4242/v1/';
		$rootScope.idsCandidatos = ['test', 'test2'];
		$rootScope.nomesCandidatos = ['dilma', 'marina'];
	}])

	.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise('/');

		$stateProvider
				.state('home', {
					url: '/',
					templateUrl: 'modules/interface/interface.html',
					controller: 'InterfaceCtrl'
				});
	})
	.run(function($rootScope){
		 $rootScope.apiBaseUrl = 'http://api.projetobrasil.org/v1/';
	});
