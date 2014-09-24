'use strict';

angular.module('projetobrasil.ufc.interface.controllers', [
		'projetobrasil.ufc.jogo.services'
	])
	.controller('InterfaceCtrl', ['$scope', 'GerenciadorJogo', function ($scope, Jogo){

		Jogo.inicializaJogo();

	}])
	.controller('CandidatosCtrl', ['$scope', function ($scope){

		$scope.candidatoA = {
			id: 'test'
		};

		$scope.candidatoB = {
			id: 'test2'
		};

		$scope.$on('propostaEscolhida', function(event, idAutor){
			angular.element('.candidato-ativo').removeClass('candidato-ativo');
			angular.element('#avatar-candidato-'+idAutor).addClass('candidato-ativo');
		});
	}])
	.controller('BarrasCtrl', ['$scope', 'GerenciadorJogo', function ($scope, Jogo){
		$scope.barraA = {
			hits : Jogo.placarCandidato(0)
		};
		$scope.barraB = {
			hits : Jogo.placarCandidato(1)
		};

		$scope.$on('propostaEscolhida', function(){
			$scope.barraA.hits = Jogo.placarCandidato(0);
			$scope.barraB.hits = Jogo.placarCandidato(1);
		});
	}]);
