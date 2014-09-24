'use strict';

angular.module('projetobrasil.ufc.interface.controllers', [
		'projetobrasil.ufc.jogo.services'
	])
	.controller('InterfaceCtrl', [ function (){
	}])
	.controller('CandidatosCtrl', [ function (){
	}])
	.controller('BarrasCtrl', ['$scope', 'GerenciadorJogo', function ($scope, Jogo){
		$scope.p1 = Jogo.candidatos.test;
		$scope.p2 = Jogo.candidatos.test2;
		$scope.maxGolpesPorRound = Jogo.maxGolpesRound;
	}]);
