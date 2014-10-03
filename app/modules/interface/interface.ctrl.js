'use strict';

angular.module('projetobrasil.ufc.interface.controllers', [])
	.controller('InterfaceCtrl', ['$scope', '$window', function ($scope, $window){
		// FIXME: Fazer canvas mais responsivo
		$scope.canvasWidth = $window.innerWidth > 1280 ? 1280 : $window.innerWidth;
	}])
	.controller('BarrasCtrl', ['$scope', 'GerenciadorJogo', function ($scope, Jogo){
		$scope.p1 = Jogo.candidatos.test;
		$scope.p2 = Jogo.candidatos.test2;
		$scope.maxGolpesPorRound = Jogo.maxGolpesRound;
	}])
	.controller('barraDeVidaCtrl', ['$scope', 'GerenciadorJogo', function($scope, Jogo) {
		$scope.p1 = Jogo.candidatos.test;
		$scope.p2 = Jogo.candidatos.test2;
		$scope.maxGolpesPorRound = Jogo.maxGolpesRound;

		var x1, y1, x2, y2, x3a, y3a, x4a, y4a, x3b, y3b, x4b, y4b;

		x1 = '0';
		y1 = '50';

		x2 = '40';
		y2 = '34';

		x3a = 40*($scope.maxGolpesPorRound - $scope.p1.golpesSofridos + 1);
		y3a = -0.075*x3a+37.78;
		// y3 = '0';

		x4a = x3a - 30;
		y4a = '50';

		x4b = 40*($scope.maxGolpesPorRound - $scope.p2.golpesSofridos + 1);
		y4b = '50';

		x3b = x4b - 30;
		y3b = -0.075*x3b+37.78;
		// y3 = '0';

		// Y = -0.075X  + 37.78

		$scope.coordenadasIniciaisA = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3a + ',' + y3a + ' ' + x4a + ',' + y4a ;
		$scope.coordenadasIniciaisB = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3b + ',' + y3b + ' ' + x4b + ',' + y4b ;
		// $scope.coordenadas = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ' + x4 + ',' + y4 ;

		$scope.$watch('p1.golpesSofridos', function(){
			console.log('Mudou!');
				x3a = 40*($scope.maxGolpesPorRound - $scope.p1.golpesSofridos + 1);
				y3a = -0.075*x3a+37.78;
				// y3 = '0';

				x4a = x3a - 30;
				y4a = '50';
			$scope.coordenadasA = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3a + ',' + y3a + ' ' + x4a + ',' + y4a ;
		});

		$scope.$watch('p2.golpesSofridos', function(){
			console.log('Mudou!');
				x4b = 40*($scope.maxGolpesPorRound - $scope.p2.golpesSofridos + 1);
				y4b = '50';

				x3b = x4b - 30;
				y3b = -0.075*x3b+37.78;

				if($scope.p2.golpesSofridos == $scope.maxGolpesPorRound){
					$scope.coordenadas = '';
				} else {
				$scope.coordenadasB = x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3b + ',' + y3b + ' ' + x4b + ',' + y4b ;
			}
		});
	}])
	.controller('LoadingCtrl', ['$scope', '$rootScope', 'Preloader', function ($scope, $rootScope, Preloader){
		$scope.isLoading = true;
		$scope.isSuccessful = false;
		$scope.percentLoaded = 0;

		$scope.imageLocations = [
			'/images/com-cache/background.d6b14439.jpg',
			'/images/com-cache/logo_ufc.be69e032.png',
			'/images/com-cache/logo-projeto-brasil.a220cb72.png',
			'/images/com-cache/rsz_logo-projeto-brasil.7acee032.png',
			'/images/com-cache/ryu.gif',
			'/images/sem-cache/golpes/cultura_turismo.png',
			'/images/sem-cache/golpes/democracia_reforma_politica.png',
			'/images/sem-cache/golpes/desenvolvimento_economico.png',
			'/images/sem-cache/golpes/direitos_humanos_inclusao_social.png',
			'/images/sem-cache/golpes/educacao.png',
			'/images/sem-cache/golpes/esporte_lazer.png',
			'/images/sem-cache/golpes/gestao_publica.png',
			'/images/sem-cache/golpes/infraestrutura.png',
			'/images/sem-cache/golpes/liberdades_civis.png',
			'/images/sem-cache/golpes/meio_ambiente.png',
			'/images/sem-cache/golpes/outros.png',
			'/images/sem-cache/golpes/politica_economica.png',
			'/images/sem-cache/golpes/politica_externa_defesa_nacional.png',
			'/images/sem-cache/golpes/politicas_sociais.png',
			'/images/sem-cache/golpes/saude.png',
			'/images/sem-cache/golpes/seguranca_publica.png',
			'/images/sem-cache/sprites/pow_sprite.png',
			'/images/sem-cache/sprites/'+$rootScope.idsCandidatos[0]+'_sprite.png',
			'/images/sem-cache/sprites/'+$rootScope.idsCandidatos[1]+'_sprite.png'
		];

		Preloader.preloadImages( $scope.imageLocations ).then(
			function handleResolve( imageLocations ) {
				// Loading was successful.
				$scope.isLoading = false;
				$scope.isSuccessful = true;
				console.info( "Preload Successful" );
			},
			function handleReject( imageLocation ) {
				// Loading failed on at least one image.
				$scope.isLoading = false;
				$scope.isSuccessful = false;

				console.error( "Image Failed", imageLocation );
				console.info( "Preload Failure" );
			},
			function handleNotify( event ) {
				$scope.percentLoaded = event.percent;
			}
		);

	}]);
