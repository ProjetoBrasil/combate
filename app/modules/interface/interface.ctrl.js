'use strict';

angular.module('projetobrasil.ufc.interface.controllers', [])
	.controller('InterfaceCtrl', ['$scope', 'UserLogin', 'Facebook', '$state',
	 function ($scope, UserLogin, Facebook, $state){
		UserLogin.promise().then(function(){
			$scope.userData = UserLogin.getUserData();
			 Facebook.api('/' + $scope.userData.provider_id + '/picture', function(response) {
				$scope.avatarUrl = response.data.url;
			});

		});

		 $scope.logoutUser = function() {
			UserLogin.logout(function(){
				$state.go('home');
			});
		};
	}])
	.controller('barraDeVidaCtrl', ['$scope', '$rootScope', 'GerenciadorJogo', function($scope, $rootScope, Jogo) {
		var cand = $rootScope.idsCandidatos;
		$scope.p1 = Jogo.candidatos[cand[0]];
		$scope.p2 = Jogo.candidatos[cand[1]];

		$scope.maxGolpesPorRound = Jogo.maxGolpesRound;
		$scope.minRoundsParaVitoria = Jogo.minRoundsParaVitoria;

		var x1, y1, x2, y2, x3a, y3a, x4a, y4a, x3b, y3b, x4b, y4b;

		x1 = '0';
		y1 = '50';

		x2 = '40';
		y2 = '34';

		x3a = 40*($scope.maxGolpesPorRound - $scope.p1.golpesSofridos + 1);
		y3a = -0.075*x3a+37.78;

		x4a = x3a - 16;
		y4a = '50';

		x4b = 40*($scope.maxGolpesPorRound - $scope.p2.golpesSofridos + 1);
		y4b = '50';

		x3b = x4b - 16;
		y3b = -0.075*x3b+37.78;

		$scope.coordenadasIniciaisA = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3a + ',' + y3a + ' ' + x4a + ',' + y4a ;
		$scope.coordenadasIniciaisB = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3b + ',' + y3b + ' ' + x4b + ',' + y4b ;

		$scope.$watch('p1.golpesSofridos', function(){
			x3a = 40*($scope.maxGolpesPorRound - $scope.p1.golpesSofridos + 1);
			y3a = -0.075*x3a+37.78;

			x4a = x3a - 16;
			y4a = '50';
			$scope.coordenadasA = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3a + ',' + y3a + ' ' + x4a + ',' + y4a ;
		});

		$scope.$watch('p2.golpesSofridos', function(){
			x4b = 40*($scope.maxGolpesPorRound - $scope.p2.golpesSofridos + 1);
			y4b = '50';

			x3b = x4b - 16;
			y3b = -0.075*x3b+37.78;

			if($scope.p2.golpesSofridos === $scope.maxGolpesPorRound){
				$scope.coordenadas = '';
			} else {
				$scope.coordenadasB = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3b + ',' + y3b + ' ' + x4b + ',' + y4b ;
			}
		});
	}]);
