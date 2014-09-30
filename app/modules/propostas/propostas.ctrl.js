'use strict';

angular.module('projetobrasil.ufc.propostas.controllers', [])
	.controller('PropostasCtrl',
		['$scope', '$rootScope','PropostasServ', 'GerenciadorJogo', 'Personagens',
		function ($scope, $rootScope, PropostasServ, Jogo, Personagens){

		// TODO:
		// - Escolher o tema a ser questionado

		// DONE:
		// - Solicitar as propostas do servidor, uma a uma
		// - Exibir as propostas para o usuário (a posição deve variar.. uma vez a do candidato A tá em cima, na outra é o candidato B. Sempre aleatorio) -> A aleatoriedade será feita no backend, o frontend deve verificar a id do candidato da proposta selecionada
		// - Pegar a escolha do usuário e preparar para comunicar

		// Esperar os serviços ficarem prontos (já pode esboçar as funções)
		// - Verificar se o usuário está logado
		// - Comunicar a jogada para o módulo Jogo
		// - Comunidar a jogada para o módulo Personagens

		// Copia o valor do buffer para a proposta corrente e requisita novas propostas para armazenar no buffers
		$scope.popBuffer = function() {
			$scope.proposta1 = $scope.bufferPropostas[0];
			$scope.proposta2 = $scope.bufferPropostas[1];
			$scope.atualizaBuffer();
		};

		// Requisita novas propostas para adicionar ao buffer
		$scope.atualizaBuffer = function() {
			PropostasServ.getPropostas().query(function(data){
				if (!$scope.bufferPropostas){
					$scope.bufferPropostas = [];
				}
				$scope.bufferPropostas[0] = data[0];
				$scope.bufferPropostas[1] = data[1];
			});
		};

		$scope.carregaPropostasIniciais = function() {
			PropostasServ.getPropostas().query(function(data){
				$scope.proposta1 = data[0];
				$scope.proposta2 = data[1];
			});
		};

		$scope.carregaPropostasIniciais();

		$scope.atualizaBuffer();

		$scope.$on('propostaEscolhida', $scope.popBuffer);

		$scope.escolherProposta = function(idAutor, temaProposta){
			Jogo.atualizaPlacar(idAutor);
			Personagens.ataque(idAutor, 'meio_ambiente');
		};

	}]);
