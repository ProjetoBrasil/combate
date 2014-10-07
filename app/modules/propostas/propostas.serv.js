'use strict';

angular.module('projetobrasil.ufc.propostas.services', [])

.factory('PropostasServ',[
	'$rootScope', '$resource',
	function($rootScope, $resource){
		var apiPropostasUrl = $rootScope.apiBaseUrl + 'ufc/proposals/';

		function api() {
			return $resource(apiPropostasUrl, {}, {
				query: { method: 'GET', isArray: true, url: apiPropostasUrl + 'rand/:tema' },
				save: { method: 'POST' , isArray: true, url: apiPropostasUrl + 'vote'}
			});
		}

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
				'Meio-ambiente': 110,
				'Política Econômica': 1011,
				'Política Externa e Defesa Nacional': 1012,
				'Políticas Sociais': 1013,
				'Saúde':1014,
				'Outros' : 1015
			};
			return temas[tema];
		}

		return {
			getPropostas: function(tema, callback) {
				//return api().query({tema: getTemaId(tema)}, callback); // TODO: mudar quando backend estiver finalizado recebendo proposta id
				return api().query({}, callback);
			},
			postPropostas: function(propostaVotada, propostaNaoVotada) {
				return api().save({'propostas' : [propostaVotada.id, propostaNaoVotada.id]});
			},
			getTemas: function() {
				return [
					'Cultura e Turismo',
					'Democracia e Reforma Política',
					'Desenvolvimento Econômico',
					'Direitos Humanos e Inclusão social',
					'Educação',
					'Esporte e lazer',
					'Gestão Pública',
					'Infraestrutura',
					'Liberdades civis',
					'Segurança Pública',
					'Meio-ambiente',
					'Política Econômica',
					'Política Externa e Defesa Nacional',
					'Políticas Sociais',
					'Saúde'
					//'Outros' // Dilma não possui proposta nesse tema
				];
			},
			getNomePastaTema: function(tema) {

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
					'Saúde':'saude'
				};
				return temas[tema];
			}
		};
	}]);
