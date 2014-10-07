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
		'projetobrasil.ufc.interface',
		'projetobrasil.ufc.propostas',
		'projetobrasil.ufc.personagem',
		'projetobrasil.ufc.interface',
		'projetobrasil.ufc.home',
		'projetobrasil.ufc.login'
	])
	.run(['$rootScope', 'UserLogin', function($rootScope, UserLogin){
		$rootScope.apiBaseUrl = 'http://api.projetobrasil.org/v1/';
		$rootScope.idsCandidatos = ['test', 'test2'];
		$rootScope.nomesCandidatos = ['dilma', 'marina'];

		UserLogin.promise().then(function(){
			if(!UserLogin.isUserLogged){
				$location.path('/');
			}
		});
	}])

	.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise('/');

		$stateProvider
				.state('jogo', {
					url: '/jogo',
					templateUrl: 'modules/interface/interface.html',
					controller: 'InterfaceCtrl'
				})
				.state('home', {
					url: '/',
					templateUrl: 'modules/home/home.html',
					controller: 'HomeCtrl'
				});
	})

//Setting up the interceptor to handle when the server returns 401
.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('securityInterceptor');
})
.provider('securityInterceptor', function() {
  this.$get = function($location, $q, $injector) {
    return function(promise) {
      // var appAuth = $injector.get('appAuth');
      return promise.then(null, function(response) {
        if(response.status === 401) {
          // delete $cookies.FPSSO;
          // appAuth.saveAttemptUrl();
          $location.path('/login');
        }
        return $q.reject(response);
      });
    };
  };
});
