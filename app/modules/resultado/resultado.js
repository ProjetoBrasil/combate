'use strict';

angular
	.module('projetobrasil.ufc.resultado', [
		'projetobrasil.ufc.resultado.controllers',
		'projetobrasil.ufc.resultado.services'
	])
	.config(function($stateProvider){
		$stateProvider
			.state('resultado', {
				url: '/resultado',
				templateUrl: 'modules/resultado/resultado.html',
				controller: 'ResultadoCtrl'
			})
			.state('compartilhar', {
				url: '/resultado/:hash',
				templateUrl: 'modules/resultado/resultado.html',
				controller: 'ResultadoCtrl'
			});
	});
