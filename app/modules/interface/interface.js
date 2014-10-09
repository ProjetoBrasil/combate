'use strict';

angular
	.module('projetobrasil.ufc.interface', [
		'projetobrasil.ufc.interface.controllers',
		'projetobrasil.ufc.interface.directives'
	])
	.config(function($stateProvider){
		$stateProvider
			.state('jogo', {
				url: '/jogo',
				templateUrl: 'modules/interface/interface.html',
				controller: 'InterfaceCtrl'
			});
	});
