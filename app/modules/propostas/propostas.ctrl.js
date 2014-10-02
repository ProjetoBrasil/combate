'use strict';

angular.module('projetobrasil.ufc.propostas.controllers', [])
	.controller('PropostasCtrl',
		['$scope', '$rootScope','PropostasServ', 'GerenciadorJogo', 'Personagens',
		function ($scope, $rootScope, PropostasServ, Jogo, Personagens){

		// DONE:
		// - Solicitar as propostas do servidor, uma a uma
		// - Exibir as propostas para o usuário (a posição deve variar.. uma vez a do candidato A tá em cima, na outra é o candidato B. Sempre aleatorio) -> A aleatoriedade será feita no backend, o frontend deve verificar a id do candidato da proposta selecionada
		// - Pegar a escolha do usuário e preparar para comunicar
		// - Escolher o tema a ser questionado -> aleatório

		// Esperar os serviços ficarem prontos (já pode esboçar as funções)
		// - Verificar se o usuário está logado
		// - Comunicar a jogada para o módulo Jogo
		// - Comunicar a jogada para o módulo Personagens

		$scope.mostrarBox = false;
		$scope.bufferPropostas = [];
		$scope.bufferPropostas[0] = null;
		$scope.bufferPropostas[1] = null;
		$scope.bufferTema = null;
		var temas = PropostasServ.getTemas();

		/**
		 * @return número aleatório entre [0, MAX] (contidos)
		 */
		function geraNumeroAleatorio() {
			var MAX = 15;
			return Math.floor(Math.random() * (MAX + 1));
		}

		function bufferVazio() {
			if ($scope.bufferPropostas[0] == null ||
				$scope.bufferPropostas[1] == null ||
				$scope.bufferTema == null){
				return true;
			}
			return false;
		}

		// Copia o valor do buffer para a proposta corrente
		$scope.popBuffer = function() {
			if (!bufferVazio()) {

				$scope.proposta1 = $scope.bufferPropostas[0];
				$scope.proposta2 = $scope.bufferPropostas[1];
				$scope.temaPropostasVisiveis = $scope.bufferTema;
				$scope.bufferPropostas[0] = null;
				$scope.bufferPropostas[1] = null;
				$scope.bufferTema = null;
			} else {
				console.error('Tentando pop em buffer vazio!');
			}
		};

		// Define um tema, requisita novas propostas nesse tema e as adiciona ao buffer
		$scope.atualizaBuffer = function(callback) {
			var temaPropostasBuffer = temas[geraNumeroAleatorio()];
			PropostasServ.getPropostas(temaPropostasBuffer).query(function(data) {
				console.log('Propostas fresquinhas carregadas do backend no buffer. Tema: ' + temaPropostasBuffer);
				$scope.bufferPropostas[0] = data[0];
				$scope.bufferPropostas[1] = data[1];
				$scope.bufferTema = temaPropostasBuffer;
				if (!angular.isUndefined(callback)){
					callback();
				}
			});
		};

		$scope.carregaPropostasIniciais = function() {
			var temaPropostasIniciais = temas[geraNumeroAleatorio()];
			PropostasServ.getPropostas(temaPropostasIniciais).query(function(data) {
				console.log('Propostas iniciais carregadas do backend. Tema: ' + temaPropostasIniciais);
				$scope.proposta1 = data[0];
				$scope.proposta2 = data[1];
				$scope.temaPropostasVisiveis = temaPropostasIniciais;
				$scope.proposta1.titulo = 'Investir em tecnologia da informação e comunicação para modernizar o trabalho das equipes do PSF junto aos indivíduos, famílias e comunidades';
				$scope.proposta2.titulo = 'Priorizar o modal ferroviário e Implantar ferrovias de norte a sul do País interligando as principais metrópoles brasileiras, inclusive o Aerotrem e o Monotrem dentro das cidades';
				$scope.mostrarBox = true;
			});
		};

		$scope.carregaPropostasIniciais();
		$scope.atualizaBuffer();

		$scope.escolherProposta = function(idAutorPropostaVotada){
			$scope.mostrarBox = false;

			// Envia o voto para o servidor
			var propostaVotada;
			var propostaNaoVotada;
			if ($scope.proposta1.politicians_id == idAutorPropostaVotada){
				propostaVotada = $scope.proposta1;
				propostaNaoVotada = $scope.proposta2;
			} else {
				propostaVotada = $scope.proposta2;
				propostaNaoVotada = $scope.proposta1;
			}
			PropostasServ.postPropostas(propostaVotada, propostaNaoVotada);

			// Executa a interação visual e requisição de nova propostas
			Personagens.ataque(idAutorPropostaVotada, $scope.temaPropostasVisiveis, function () {
				Jogo.atualizaPlacar(idAutorPropostaVotada);
				if (!bufferVazio()) {
					$scope.popBuffer();
					$scope.mostrarBox = true;
					$scope.atualizaBuffer();
				} else {
					// Caso o buffer esteja vazio, força atualização,
					// a cópia do buffer pro elemento e uma atualização do buffer
					$scope.atualizaBuffer(function() {
						$scope.popBuffer();
						$scope.mostrarBox = true;
						$scope.atualizaBuffer();
					});
				}
			});
		};

	}]);
