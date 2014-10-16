'use strict';

angular
	.module('projetobrasil.ufc.resultado.services', [])
	.factory('ResultadoService', ['$resource', '$rootScope', function ($resource, $rootScope){

		var servico = {};

		servico.rankingPessoal = $resource($rootScope.apiBaseUrl+'ufc/ranking/user/:hash', {
			hash: '@hash'
		}, {});

		servico.rankingGlobal = $resource($rootScope.apiBaseUrl+'ufc/ranking/global', {}, {});

		servico.userHash = $resource($rootScope.apiBaseUrl+'ufc/user/hash', {}, {});

		servico.userName = $resource($rootScope.apiBaseUrl+'ufc/user/name/:hash', {
			hash: '@hash'
		}, {});

		return servico;
	}]);

