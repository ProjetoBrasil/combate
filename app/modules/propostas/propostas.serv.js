'use strict';

angular.module('projetobrasil.ufc.propostas.services', [])

.factory('PropostasServ',[
	'$rootScope', '$resource', '$timeout',
	function($rootScope, $resource, $timeout){

		var propostas = {
			propostasVisiveis: {tema: '', props: []},
			buffer: {tema: '', props: []}
		};

		var MAX_TENTATIVAS_RECONNECT = 10;

		var apiPropostasUrl = $rootScope.apiBaseUrl + 'ufc/proposals/';

		var api = $resource(apiPropostasUrl, {}, {
					query: { method: 'GET', isArray: true, url: apiPropostasUrl + 'rand/:tema' },
					save: { method: 'POST', url: apiPropostasUrl + 'vote'}
				});

		propostas.assetsCarregados = {propostas: false, imagens: false};

		/**
		 * Copia o conteúdo do buffer para propostas vísiveis.
		 * Limpa o buffer após cópia e requisita atualização do buffer em seguida.
		 */
		propostas.popBuffer = function () {
			if (!propostas.vazio(propostas.buffer)) {
				this.propostasVisiveis.props[0] = this.buffer.props[0];
				this.propostasVisiveis.props[1] = this.buffer.props[1];
				this.propostasVisiveis.tema = this.buffer.tema;

				this.buffer.props = [];
				this.buffer.tema = null;


			} else {
				console.error('Tentando pop em buffer vazio!');
			}
			this.atualizaBuffer();
		};

		propostas.esvaziaPropostasVisiveis = function() {
			this.propostasVisiveis.props[0] = null;
			this.propostasVisiveis.props[1] = null;
			this.propostasVisiveis.tema = null;
		};

		/**
		 * Busca novas propostas do servidor. Se propostasVisiveis estiver vazio
		 * copia o buffer para propostasVisiveis
		 * @params 	requisitaAteObterResposta False para ignorar acontagem e
		 				tentar atualizar indefinidamente
		 			errorCount contagem de erros acontecidos.
		 */
		propostas.atualizaBuffer = function (requisitaAteObterResposta, errorCount) {
			errorCount = errorCount || 0;
			requisitaAteObterResposta = requisitaAteObterResposta || false;
			var temaPropostasBuffer = getElementoAleatorio(temas);

			api.query({tema: getTemaId(temaPropostasBuffer) }, function(data) {

				propostas.buffer.tema = temaPropostasBuffer;
				propostas.buffer.props = data;

				if (propostas.vazio(propostas.propostasVisiveis)){
					propostas.popBuffer();
				}
				$rootScope.comunicandoComServidor = true;
			}, function(error){
				if (requisitaAteObterResposta == true){
					$timeout(function() {
						propostas.atualizaBuffer(true, ++errorCount);
					}, 200);
				} else {
					if (errorCount >= MAX_TENTATIVAS_RECONNECT) {
						// Para e notifica que a conexão caiu
						$rootScope.comunicandoComServidor = false;
					} else {
						// Continua tentando até conseguir resposta ou
						// chegar no limite de tentativas
						propostas.atualizaBuffer(false, ++errorCount);
					}
				}
			});
		};

		/**
		 * @return objeto aleatório de um vetor, sem alterar o vetor
		 */
		function getElementoAleatorio(vetor) {
			var MAX = _.size(vetor);
			var indice = Math.floor(Math.random() * (MAX));
			return vetor[indice];
		}

		propostas.vazio = function(objeto) {
			if (_.size(objeto.props) < 2 ||
				objeto.props[0] === null ||
				objeto.props[1] === null ||
				objeto.tema === null){
				return true;
			}
			return false;
		};

		propostas.postPropostasVisiveis = function(idAutorPropostaVotada) {
			var propostaVotada;
			var propostaNaoVotada;
			if (propostas.propostasVisiveis.props[0].id_politicians === idAutorPropostaVotada){
				propostaVotada = propostas.propostasVisiveis.props[0];
				propostaNaoVotada = propostas.propostasVisiveis.props[1];
			} else {
				propostaVotada = propostas.propostasVisiveis.props[1];
				propostaNaoVotada = propostas.propostasVisiveis.props[0];
			}
			return api.save({'propostas' : [propostaVotada.id, propostaNaoVotada.id]});
		};

		function getTemaId(tema) {
			var temas = {
				'Cultura e Turismo' : 1000,
				'Democracia e Reforma Política': 1001,
				'Desenvolvimento Econômico': 1002,
				'Direitos Humanos e Inclusão social': 1003,
				'Educação': 1004,
				'Esporte e lazer': 1005,
				'Gestão Pública': 1006,
				'Infraestrutura': 1007,
				'Liberdades civis': 1008,
				'Segurança Pública': 1009,
				'Meio-ambiente': 1010,
				'Política Econômica': 1011,
				'Política Externa e Defesa Nacional': 1012,
				'Políticas Sociais': 1013,
				'Saúde':1014,
				'Outros' : 1015
			};
			return temas[tema];
		}

		propostas.getTemas = function() {
			return [
				'Cultura e Turismo',
				'Democracia e Reforma Política',
				'Desenvolvimento Econômico',
				'Direitos Humanos e Inclusão social',
				'Educação',
				'Esporte e lazer',
				'Gestão Pública',
				'Infraestrutura',
				//'Liberdades civis', // Um dos candidatos não possui propostas no tema
				'Segurança Pública',
				'Meio-ambiente',
				'Política Econômica',
				'Política Externa e Defesa Nacional',
				'Políticas Sociais',
				'Saúde'
				//'Outros' // Dilma não possui proposta nesse tema
			];
		};
		propostas.getNomePastaTema = function(tema) {
			var temas = {
				'Cultura e Turismo' : 'cultura_turismo',
				'Democracia e Reforma Política': 'democracia_reforma_politica',
				'Desenvolvimento Econômico': 'desenvolvimento_economico',
				'Direitos Humanos e Inclusão social': 'direitos_humanos_inclusao_social',
				'Educação': 'educacao',
				'Esporte e lazer': 'esporte_lazer',
				'Gestão Pública': 'gestao_publica',
				'Infraestrutura': 'infraestrutura',
				'Liberdades civis': 'liberdades_civis',
				'Segurança Pública': 'seguranca_publica',
				'Meio-ambiente': 'meio_ambiente',
				'Política Econômica': 'politica_economica',
				'Política Externa e Defesa Nacional': 'politica_externa_defesa_nacional',
				'Políticas Sociais': 'politicas_sociais',
				'Saúde':'saude',
				'Outros': 'outros'
			};
			return temas[tema];
		};

		var temas = propostas.getTemas();
		propostas.atualizaBuffer();

		return propostas;
	}]);
