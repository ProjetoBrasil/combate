'use strict';

angular.module('projetobrasil.ufc.propostas.controllers', [])
	.controller('PropostasCtrl',
		['$scope', '$rootScope','PropostasServ', 'GerenciadorJogo', 'Personagens',
			'$timeout', 'ngDialog',
		function ($scope, $rootScope, PropostasServ, Jogo, Personagens,
			$timeout, ngDialog){

		// $rootScope.$on('$stateChangeSuccess',
		// 	function(event, toState, toParams, fromState){
		// 		if(toState.name === 'jogo'){
		// 			$state.reload();
		// 		}
		// 	});

		// Personagens.carregaAssets();
		// Jogo.inicializaJogo();

		var idDialogErro;

		$scope.tamProposta1 = 100;
		$scope.tamProposta2 = 100;

		$scope.mostrarBox = false;
		$scope.propostasVisiveis = PropostasServ.propostasVisiveis;

		$scope.assetsCarregados = PropostasServ.assetsCarregados;
		// Só mostra o box de propostas se os sprites e as propostas tiverem sido carregadas
		$scope.$watch('assetsCarregados', function(newValue) {
			if (newValue.propostas === true && newValue.imagens === true) {
				atualizaTamanhoPropostas();
				$scope.mostrarBox = true;
			}
		}, true);
		// Aguarda as imagens carregarem
		$rootScope.$on('imagensCarregadas', function() {
			$scope.$apply(function() {
				$scope.assetsCarregados.imagens = true;
			});
		});
		// Aguarda o service instanciar propostas do servidor
		$scope.$watch('propostasVisiveis', function() {
			if (!PropostasServ.vazio($scope.propostasVisiveis)) {
				$scope.assetsCarregados.propostas = true;
			}
		}, true);

		$rootScope.$watch('comunicandoComServidor', function(newValue, oldValue) {
			if (newValue === false) {
				// Houve erro com comunicação no servidor
				idDialogErro = ngDialog.open({
					template: 'modules/propostas/erro-servidor.html',
					showClose: false,
					closeByEscape: false,
					closeByDocument: false,
					className: 'ngdialog-theme-default',
					controller: function () {
						// Faz requisições até receber resposta
						PropostasServ.atualizaBuffer(true);
					}
				});
			}
			if (oldValue === false && newValue === true) {
				ngDialog.close(idDialogErro);
			}
		}, true);

		function atualizaTamanhoPropostas() {
			$scope.tamProposta1 = $scope.propostasVisiveis.props[0].titulo.length*0.4 > 100 ? $scope.propostasVisiveis.props[0].titulo.length*0.4 : 100;
			$scope.tamProposta2 = $scope.propostasVisiveis.props[1].titulo.length*0.4 > 100 ? $scope.propostasVisiveis.props[1].titulo.length*0.4 : 100;
		}

		$scope.escolherProposta = function(idAutorPropostaVotada) {

			$scope.mostrarBox = false;

			PropostasServ.postPropostasVisiveis(idAutorPropostaVotada);

			// Executa a interação visual e requisição de nova propostas
			Personagens.ataque(idAutorPropostaVotada, $scope.propostasVisiveis.tema, function () {
				Jogo.atualizaPlacar(idAutorPropostaVotada);
				$timeout(function() {
					PropostasServ.popBuffer();

					atualizaTamanhoPropostas();
					$scope.mostrarBox = true;
				},800); // Delay para evitar que imagem dos ataques trave na tela
			});
		};

	}]);
