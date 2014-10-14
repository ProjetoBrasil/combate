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
		'angularytics', // Plugin para Google Analytics
		'facebook',
 		'projetobrasil.ufc.jogo',
		'projetobrasil.ufc.interface',
		'projetobrasil.ufc.propostas',
		'projetobrasil.ufc.personagem',
		'projetobrasil.ufc.interface',
		'projetobrasil.ufc.home',
		'projetobrasil.ufc.login',
		'projetobrasil.ufc.resultado'
	])
	.config(function(FacebookProvider) {
		FacebookProvider.init('1520150961538128');
	})
	.config(function(AngularyticsProvider) {
		AngularyticsProvider.setEventHandlers(['GoogleUniversal']);
	}).run(function(Angularytics) {
		Angularytics.init();
	})
	.run(['$rootScope', 'UserLogin', function($rootScope, UserLogin){
		$rootScope.apiBaseUrl = 'http://api.projetobrasil.org/v1/';
		$rootScope.idsCandidatos = ['b6bc0250-0d10-11e4-b416-b9cab1b63b1e', '827c9cc0-0d10-11e4-a4de-3d18690f2356'];
		$rootScope.nomesCandidatos = {
			'b6bc0250-0d10-11e4-b416-b9cab1b63b1e' : 'dilma',
			'827c9cc0-0d10-11e4-a4de-3d18690f2356' : 'aecio'
		};

		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState){
				if(toState.name === 'home' && fromState.name === 'jogo'){
					window.location.reload();
				}
				UserLogin.promise().error(function(){
					if(toState.name === 'home') {
						if(fromState.name === 'jogo'){
							window.location.reload();
						} else {
							return;
						}
					}
					if(!UserLogin.isUserLogged()){
						// $state.go('home');
					}
				});
		});

	}])
	.config(function($urlRouterProvider){
		$urlRouterProvider.otherwise('/');
	})
	.config(function($httpProvider) {
		$httpProvider.responseInterceptors.push('securityInterceptor');
	})
	.provider('securityInterceptor', function() {
		this.$get = function($location, $q) {
			return function(promise) {
				return promise.then(null, function(response) {
					if(response.status === 401) {
						$location.path('/login');
					}
					return $q.reject(response);
				});
			};
		};
	})
	.controller('BodyBackgroundCtrl', ['$scope', '$state', function ($scope, $state){
		$scope.estado = $state;
	}]);
