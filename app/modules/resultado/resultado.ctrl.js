'use strict';

angular
	.module('projetobrasil.ufc.resultado.controllers', [])
	.controller('ResultadoCtrl',
	['$scope', '$rootScope', '$state', '$stateParams', '$location',  'RankingPessoalService', 'RankingGlobalService', 'Facebook', 'UserHashService',
		function ($scope, $rootScope, $state, $stateParams, $location, rankPessoal, rankGlobal, Facebook, userHash){
			var ids = $rootScope.idsCandidatos;
			$scope.qtdeVotosPessoal = {};
			$scope.qtdeVotosGlobal = {};
			$scope.aecio = ids[1];
			$scope.dilma = ids[0];

			$scope.jogar = function(){
				$state.go('jogo');
			};

			// FIXME: Passar isso para um serviço.
			$scope.categorias = {
				1000 : 'Cultura e Turismo',
				1001 : 'Democracia e Reforma Política',
				1002 : 'Desenvolvimento Econômico',
				1003 : 'Direitos Humanos e Inclusão social',
				1004 : 'Educação',
				1005 : 'Esporte e lazer',
				1006 : 'Gestão Pública',
				1007 : 'Infraestrutura',
				// 1008 : 'Liberdades civis',
				1009 : 'Segurança Pública',
				1010 : 'Meio-ambiente',
				1011 : 'Política Econômica',
				1012 : 'Política Externa e Defesa Nacional',
				1013 : 'Políticas Sociais',
				1014 : 'Saúde'
				// 1015 : 'Outros'
			};

			$scope.hashUsuario = $stateParams.hash;
			var query = {};

			if($scope.hashUsuario){
				$scope.linkCompartilhamento = 'http://combate.projetobrasil.org/#' + $location.url();
				query = { hash : $scope.hashUsuario };
				Facebook.api('/' + $scope.hashUsuario + '/picture', function(response) {
					$scope.avatarUrl = response.data.url;
				});
			}else{
				$scope.hashUsuario = userHash.get(function(){
					$scope.linkCompartilhamento = 'http://combate.projetobrasil.org/#' + $location.url() + '/' + $scope.hashUsuario;
				});
			}

			$scope.facebook = function(){
				Facebook.ui({
					method: 'feed',
					name: 'Urna Fighter Combat',
					link: $scope.linkCompartilhamento,
					picture: '//combate.projetobrasil.org/images/com-cache/logo_ufc.png',
					caption: 'Projeto Brasil',
					description: 'Veja meu resultado no Urna Fighter Combat e compare com a pontuação nacional',
					message: ''
				});
			};

			$scope.rankPessoal = rankPessoal.get(query, function(){
				$scope.qtdeVotosPessoal.total = 0;
				_.each(ids, function(id){
					$scope.qtdeVotosPessoal[id] = _.reduce($scope.rankPessoal[id], function(soma, valor){
						return soma + valor;
					}, 0);
					$scope.qtdeVotosPessoal.total += $scope.qtdeVotosPessoal[id];
				});
				_.each($scope.categorias, function(nome, idCat){
					$scope.qtdeVotosPessoal[idCat] = $scope.rankPessoal[$scope.dilma][idCat] + $scope.rankPessoal[$scope.aecio][idCat];
				});
			});

			$scope.rankGlobal = rankGlobal.get(function(){
				$scope.qtdeVotosGlobal.total = 0;
				_.each(ids, function(id){
					$scope.qtdeVotosGlobal[id] = _.reduce($scope.rankGlobal[id], function(soma, valor){
						return soma + valor;
					}, 0);
					$scope.qtdeVotosGlobal.total += $scope.qtdeVotosGlobal[id];
				});
				_.each($scope.categorias, function(nome, idCat){
					$scope.qtdeVotosGlobal[idCat] = $scope.rankGlobal[$scope.dilma][idCat] + $scope.rankGlobal[$scope.aecio][idCat];
				});
			});

		}
	]);
