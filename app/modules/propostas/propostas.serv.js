'use strict';

angular.module('projetobrasil.ufc.propostas.services', [])

.factory('PropostasServ',[
	'$rootScope', '$resource',
	function($rootScope, $resource){
		return {
			getPropostas: function() {
				return $resource($rootScope.apiBaseUrl + 'ufc/proposals/rand', {}, {
					query: { method: 'GET', params: {}, isArray: true}
				});
			},
			postPropostas: function(propostaVotada, propostaNaoVotada) {
				return;
				//TODO
				//return $resource($rootScope.apiBaseUrl + 'ufc/proposals/rand', {}, {
				//	query: { method: 'POST', params: {}, isArray: true}
				//});
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
