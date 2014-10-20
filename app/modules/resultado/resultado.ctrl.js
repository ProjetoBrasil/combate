'use strict';

angular
	.module('projetobrasil.ufc.resultado.controllers', [])
	.controller('ResultadoCtrl',
	['$scope', '$rootScope', '$state', '$stateParams', '$location', 'ResultadoService' , 'Facebook', 'Angularytics', 'Audio',
		function ($scope, $rootScope, $state, $stateParams, $location, ResultadoService, Facebook, Angularytics, Audio){
			var ids = $rootScope.idsCandidatos;
			$scope.qtdeVotosPessoal = {};
			$scope.qtdeVotosGlobal = {};
			$scope.aecio = ids[1];
			$scope.dilma = ids[0];

			$scope.jogar = function(){
				Audio.tocaAudio('brasil');
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
			$scope.paginaCompartilhada = !!$stateParams.hash;
			var query = {};

			if($scope.hashUsuario){
				$scope.linkCompartilhamento = 'http://combate.projetobrasil.org/#' + $location.url();
				query = { hash : $scope.hashUsuario };
				Facebook.api('/' + $scope.hashUsuario + '/picture', function(response) {
					$scope.avatarUrl = response.data ? response.data.url : null;
				});
				ResultadoService.userName.get({
					hash: $scope.hashUsuario
				}, function(data){
					$scope.nomeUsuario = data.name;
				});
			}else{
				$scope.hashUsuario = ResultadoService.userHash.get(function(){
					var url = $location.url();
					url = url[url.length-1] != '/' ? url + '/' : url;
					$scope.linkCompartilhamento = 'http://combate.projetobrasil.org/#' + url + $scope.hashUsuario.hash;
				});
			}

			$scope.linkTwitter = function(link){
				return encodeURIComponent(link);
			};

			$scope.facebook = function(){
				Angularytics.trackEvent('Resultado', 'Abriu janela de compartilhamento');
				Facebook.ui({
					method: 'feed',
					name: 'Clique para ver meu resultado',
					link: $scope.linkCompartilhamento,
					picture: 'http://combate.projetobrasil.org/images/com-cache/logo_ufc.5403714a.png',
					caption: 'Urna Fighter Combat - Projeto Brasil',
					description: 'Veja quem venceu o combate de propostas. Dilma ou Aécio?',
					message: 'Eu joguei o Urna Fighter Combat! Quer saber qual dos candidatos venceu a minha disputa?'
				}, function(response){
					if (response && !response.error_code) {
						Angularytics.trackEvent('Resultado', 'Compartilhamento concluído');
					} else {
						Angularytics.trackEvent('Resultado', 'Erro no processo de compartilhamento');
					}
				});
			};

			$scope.rankPessoal = ResultadoService.rankingPessoal.get(query, function(){
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

			$scope.rankGlobal = ResultadoService.rankingGlobal.get(function(){
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
