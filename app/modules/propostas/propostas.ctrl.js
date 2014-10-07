'use strict';

angular.module('projetobrasil.ufc.propostas.controllers', [])
	.controller('PropostasCtrl',
		['$scope', '$rootScope','PropostasServ', 'GerenciadorJogo', 'Personagens',
			'$timeout', '$state',
		function ($scope, $rootScope, PropostasServ, Jogo, Personagens,
			$timeout, $state){

		// DONE:
		// - Solicitar as propostas do servidor, uma a uma
		// - Exibir as propostas para o usuário (a posição deve variar.. uma vez a do candidato A tá em cima, na outra é o candidato B. Sempre aleatorio) -> A aleatoriedade será feita no backend, o frontend deve verificar a id do candidato da proposta selecionada
		// - Pegar a escolha do usuário e preparar para comunicar
		// - Escolher o tema a ser questionado -> aleatório

		// Esperar os serviços ficarem prontos (já pode esboçar as funções)
		// - Verificar se o usuário está logado
		// - Comunicar a jogada para o módulo Jogo
		// - Comunicar a jogada para o módulo Personagens

		// $rootScope.$on('$stateChangeSuccess',
		// 	function(event, toState, toParams, fromState){
		// 		if(toState.name === 'jogo'){
		// 			$state.reload();
		// 		}
		// 	});

		// Personagens.carregaAssets();
		// Jogo.inicializaJogo();

		$scope.tamProposta1 = 100;
		$scope.tamProposta2 = 100;

		$scope.mostrarBox = false;
		$scope.bufferPropostas = [];
		$scope.bufferPropostas[0] = null;
		$scope.bufferPropostas[1] = null;
		$scope.bufferTema = null;
		var temas = PropostasServ.getTemas();

		$scope.assetsCarregados = {propostas: false, imagens: false};
		$rootScope.$on('imagens_carregadas', function() {
			$scope.assetsCarregados.imagens = true;
		});
		$scope.$watch('assetsCarregados', function(newValue, oldValue){
			if (newValue.propostas === true && newValue.imagens === true){
				$scope.mostrarBox = true;
			}
		}, true);

		/**
		 * @return obejto aleatório de um vetor, sem alterar o vetor
		 */
		function getElementoAleatorio(vetor) {
			var MAX = _.size(vetor);
			var indice = Math.floor(Math.random() * (MAX - 1));
			return vetor[indice];
		}

		function bufferVazio() {
			if ($scope.bufferPropostas[0] == null ||
				$scope.bufferPropostas[1] == null ||
				$scope.bufferTema == null){
				return true;
			}
			return false;
		}

		function atualizaTamanhoPropostas(){
			$scope.tamProposta1 = $scope.proposta1.titulo.length*0.4 > 100 ? $scope.proposta1.titulo.length*0.4 : 100;
			$scope.tamProposta2 = $scope.proposta2.titulo.length*0.4 > 100 ? $scope.proposta2.titulo.length*0.4 : 100;
		}

		// Copia o valor do buffer para a proposta corrente
		$scope.popBuffer = function() {
			if (!bufferVazio()) {

				$scope.proposta1 = $scope.bufferPropostas[0];
				$scope.proposta2 = $scope.bufferPropostas[1];
				atualizaTamanhoPropostas();
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
			var temaPropostasBuffer = getElementoAleatorio(temas);
			PropostasServ.getPropostas(temaPropostasBuffer, function(data) {
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
			var temaPropostasIniciais = getElementoAleatorio(temas);
			PropostasServ.getPropostas(temaPropostasIniciais, function(data) {
				console.log('Propostas iniciais carregadas do backend. Tema: ' + temaPropostasIniciais);
				$scope.proposta1 = data[0];
				$scope.proposta2 = data[1];
				$scope.temaPropostasVisiveis = temaPropostasIniciais;
				$scope.proposta1.titulo = 'Protagonizar a coordenação e articulação dos atores sociais e agentes econômicos envolvidos no desenvolvimento sustentável, e liderar iniciativas que protejam os oceanos, nos encaminhamentos de questões relativas ao meio-ambiente na agenda internacional, especialmente a Conferência das Partes 21 da Convenção de Mudança do Clima, em 2015, e os Objetivos do Desenvolvimento Sustentável em substituição aos Objetivos do Milênio';
				$scope.proposta2.titulo = 'Criar mecanismos que transfiram as conquistas institucionais para prevenção e combate à corrupção do Governo Federal (por exemplo, a configuração atual da Controladoria Geral da União, a criação do Portal da Transparência, a afirmação da Polícia Federal como órgão de Estado, entre outros) para o âmbito dos Estados e municípios';
				atualizaTamanhoPropostas();
				$scope.assetsCarregados.propostas = true;
			});
		};

		$scope.carregaPropostasIniciais();
		$scope.atualizaBuffer();

		$scope.escolherProposta = function(idAutorPropostaVotada) {
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
				$timeout(function() {
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
				},800); // Delay para evitar que imagem dos ataques trave na tela
			});
		};


	}]);
