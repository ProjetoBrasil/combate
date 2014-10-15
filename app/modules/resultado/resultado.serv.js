'use strict';

angular
	.module('projetobrasil.ufc.resultado.services', [])
	.factory('RankingPessoalService', ['$resource', '$rootScope', function ($resource, $rootScope){

		var ranking = $resource($rootScope.apiBaseUrl+'ufc/ranking/user/:hash', {
			hash: '@hash'
		}, {});

		return ranking;
	}])
	.factory('RankingGlobalService', ['$resource', '$rootScope', function ($resource, $rootScope){

		var ranking = $resource($rootScope.apiBaseUrl+'ufc/ranking/global', {}, {});

		return ranking;
	}])
	.factory('UserHashService', ['$resource', '$rootScope', function ($resource, $rootScope){

		var hash = $resource($rootScope.apiBaseUrl+'ufc/user/hash', {}, {});

		return hash;
	}])

