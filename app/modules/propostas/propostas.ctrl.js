'use strict';

angular.module('projetobrasil.ufc.propostas.controllers', [])
	.controller('PropostasCtrl',
		['$scope', '$rootScope','PropostasServ', 'GerenciadorJogo', 'Personagens', '$timeout',
		function ($scope, $rootScope, PropostasServ, Jogo, Personagens, $timeout){

		// DONE:
		// - Solicitar as propostas do servidor, uma a uma
		// - Exibir as propostas para o usuário (a posição deve variar.. uma vez a do candidato A tá em cima, na outra é o candidato B. Sempre aleatorio) -> A aleatoriedade será feita no backend, o frontend deve verificar a id do candidato da proposta selecionada
		// - Pegar a escolha do usuário e preparar para comunicar
		// - Escolher o tema a ser questionado -> aleatório

		// Esperar os serviços ficarem prontos (já pode esboçar as funções)
		// - Verificar se o usuário está logado
		// - Comunicar a jogada para o módulo Jogo
		// - Comunicar a jogada para o módulo Personagens

		$scope.mostrarBox = true;
		var temas = PropostasServ.getTemas();

		/**
		 * @return número aleatório entre [0, MAX] (contidos)
		 */
		function geraNumeroAleatorio() {
			var MAX = 15;
			return Math.floor(Math.random() * (MAX + 1));
		}

		// Copia o valor do buffer para a proposta corrente e requisita novas propostas para armazenar no buffers
		$scope.popBuffer = function() {
			$scope.proposta1 = $scope.bufferPropostas[0];
			$scope.proposta2 = $scope.bufferPropostas[1];
			$scope.temaPropostasVisiveis = $scope.bufferTema;
			$scope.atualizaBuffer();
		};

		// Requisita novas propostas para adicionar ao buffer
		$scope.atualizaBuffer = function() {
			var temaPropostasBuffer = temas[geraNumeroAleatorio()];
			PropostasServ.getPropostas(temaPropostasBuffer).query(function(data) {
				console.log('Propostas fresquinhas carregadas do backend no buffer');
				if (!$scope.bufferPropostas){
					$scope.bufferPropostas = [];
				}
				$scope.bufferPropostas[0] = data[0];
				$scope.bufferPropostas[1] = data[1];
				$scope.bufferTema = temaPropostasBuffer;
			});
		};

		$scope.carregaPropostasIniciais = function() {
			var temaPropostasIniciais = temas[geraNumeroAleatorio()];
			console.log(temas);
			console.log(temaPropostasIniciais);
			PropostasServ.getPropostas(temaPropostasIniciais).query(function(data) {
				console.log('Propostas iniciais carregadas do backend');
				$scope.proposta1 = data[0];
				$scope.proposta2 = data[1];
				$scope.temaPropostasVisiveis = temaPropostasIniciais;
				//$scope.$apply();
			});
		};

		$scope.carregaPropostasIniciais();
		$scope.atualizaBuffer();

		$scope.escolherProposta = function(idAutor){
			$scope.mostrarBox = false;
			Personagens.ataque(idAutor, $scope.temaPropostasVisiveis, function () {
				Jogo.atualizaPlacar(idAutor);
				$scope.popBuffer();
				//$timeout(function () {
					$scope.mostrarBox = true;
				//}, 2500);

			});
		};

	}]);
