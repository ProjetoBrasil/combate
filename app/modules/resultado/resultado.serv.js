'use strict';

angular
	.module('projetobrasil.ufc.resultado.services', [])
	.factory('RankingPessoalService', ['$resource', '$rootScope', function ($resource, $rootScope){

		var ranking = $resource($rootScope.apiBaseUrl+'ufc/ranking', {}, {});

		return ranking;
	}])
	.factory('RankingGlobalService', ['$resource', '$rootScope', function ($resource, $rootScope){

		var ranking = $resource($rootScope.apiBaseUrl+'ufc/ranking/global', {}, {});

		return ranking;
	}]);
