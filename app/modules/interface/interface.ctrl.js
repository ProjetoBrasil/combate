angular.module('projetobrasil.ufc.interface.controllers', [])
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
	.controller('BarrasCtrl', ['$scope', function ($scope){
		$scope.barraA = {
			hits : 10
		};
		$scope.barraB = {
			hits : 15
		};

		$scope.$on('propostaEscolhida', function(event, idAutor){
			if(idAutor === 'test'){
				$scope.barraA.hits++;
			}else{
				$scope.barraB.hits++;
			}
		});
	}]);
