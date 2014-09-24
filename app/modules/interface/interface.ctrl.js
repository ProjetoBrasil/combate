'use strict';

angular.module('projetobrasil.ufc.interface.controllers', [
		'projetobrasil.ufc.jogo.services'
	])
	.controller('InterfaceCtrl', ['$scope', 'GerenciadorJogo', function ($scope, Jogo){

		Jogo.inicializaJogo();

	}])
	.controller('PropostasCtrl', ['$scope', '$rootScope', function ($scope, $rootScope){

		$scope.proposta1 = {
			texto: 'Proposta 1',
			idAutor: 'A'
		};

		$scope.proposta2 = {
			texto: 'Proposta 2',
			idAutor: 'B'
		};

		$scope.escolherProposta = function(idAutor){
			$rootScope.$broadcast('propostaEscolhida', idAutor);
		};

	}])
	.controller('CandidatosCtrl', ['$scope', function ($scope){

		$scope.candidatoA = {
			id: 'B'
		};

		$scope.candidatoB = {
			id: 'B'
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
