'use strict';

angular.module('projetobrasil.ufc.interface.controllers', [])
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
	.controller('BarrasCtrl', ['$scope', function ($scope){
		$scope.barraA = {
			hits : 10
		};
		$scope.barraB = {
			hits : 15
		};

		$scope.$on('propostaEscolhida', function(event, idAutor){
			if(idAutor === 'A'){
				$scope.barraA.hits++;
			}else{
				$scope.barraB.hits++;
			}
		});
	}]);
