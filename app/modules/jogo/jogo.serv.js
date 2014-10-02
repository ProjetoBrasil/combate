'use strict';

angular.module('projetobrasil.ufc.jogo.services', [])
	.factory('GerenciadorJogo', [ '$log', '$rootScope', function ($log, $rootScope){
		var gerenciador = {
			roundAtual : 0,
			maxGolpesRound : 10,
			candidatos : {}
		};

		var maxRounds = 3;
		var minRoundsParaVitoria = parseInt(maxRounds/2)+1;

		// Gerencia o jogo
		gerenciador.inicializaJogo = function(){
			this.roundAtual = 0;
			var idsCandidatos = $rootScope.idsCandidatos;
			var candidatos = this.candidatos;

			_.each(idsCandidatos,function(id){
				if(!candidatos[id]){
					candidatos[id] = {};
				}
				candidatos[id].roundsGanhos = 0;
				candidatos[id].golpesSofridos = 0;
			});
			$log.info('Jogo inicializado\nPlacar inicial: '+this.placarRound()+'\nRound atual: '+this.roundAtual);
		};

		gerenciador.finalizaJogo = function(vencedor){
			$log.info('Fim de jogo\n'+this.placarGeral());
			$log.info('Vencedor: '+vencedor);
			gerenciador.inicializaJogo();
		};

		// Gerencia os rounds
		gerenciador.comecaNovoRound = function(){
			this.roundAtual++;
			$log.info('Começa novo round\nRound ->'+this.roundAtual);
			_.each(this.candidatos,function(c){
				c.golpesSofridos = 0;
			});
		};

		gerenciador.finalizaRound = function(vencedor){
			$log.info('Round finalizado\nPlacar do Round: '+this.placarRound());
			this.roundAtual++;
			var roundsGanhos = ++this.candidatos[vencedor].roundsGanhos;
			if(roundsGanhos >= minRoundsParaVitoria){
				this.finalizaJogo(vencedor);
			}else{
				this.comecaNovoRound();
			}
		};

		// Gerencia os golpes
		gerenciador.atualizaPlacar = function(escolhido){
			$log.info('Golpe do candidato ' + escolhido + '\nBem no meio da fuça!!!');
			var pontuacao = ++this.candidatos[escolhido].golpesSofridos;
			if(pontuacao === this.maxGolpesRound){
				this.finalizaRound(escolhido);
			}
		};

		// Funções GET
		gerenciador.placarRound = function(){
			var candidatos = this.candidatos;
			var placar = [];
			_.each(candidatos,function(c){
				placar.push(c.golpesSofridos);
			});
			return placar;
		};

		gerenciador.placarGeral = function(){
			var candidatos = this.candidatos;
			var placar = [];
			_.each(candidatos,function(c){
				placar.push(c.roundsGanhos);
			});
			return placar;
		};

		gerenciador.placarCandidato = function(candidato){
			return this.candidatos[candidato].golpesSofridos;
		};

		gerenciador.inicializaJogo();
		return gerenciador;
	}]);
