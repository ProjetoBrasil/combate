'use strict';

angular.module('projetobrasil.ufc.jogo.services', [])
	.service('GerenciadorJogo', [ '$log', function ($log){
		this.roundAtual = 0;
		this.candidatos = {
			0: {
				roundsGanhos: 0,
				golpesSofridos: 0
			},
			1: {
				roundsGanhos: 0,
				golpesSofridos: 0
			}
		};

		var maxGolpesRound = 10;
		var maxRounds = 3;
		var minRoundsParaVitoria = parseInt(maxRounds/2)+1;

		// Gerencia o jogo
		this.inicializaJogo = function(){
			this.roundAtual = 0;
			_.each(this.candidatos,function(c){
				c.roundsGanhos = 0;
				c.golpesSofridos = 0;
			});
			$log.info('Jogo inicializado\nPlacar inicial: '+this.placarRound()+'\nRound atual: '+this.roundAtual);
		};

		this.finalizaJogo = function(vencedor){
			$log.info('Fim de jogo\n'+this.placarGeral());
			vencedor = null;
			// ...
		};

		// Gerencia os rounds
		this.comecaNovoRound = function(){
			this.roundAtual++;
			$log.info('Começa novo round\nRound ->'+this.roundAtual);
			_.each(this.candidatos,function(c){
				c.golpesSofridos = 0;
			});
		};

		this.finalizaRound = function(vencedor){
			$log.info('Round finalizado\nPlacar do Round: '+this.placarRound());
			this.roundAtual++;
			if(this.roundAtual === minRoundsParaVitoria){
				this.finalizaJogo(vencedor);
			}else{
				this.comecaNovoRound();
			}
		};

		// Gerencia os golpes
		this.atualizaPlacar = function(escolhido){
			$log.info('Golpe do candidato ' + escolhido + '\nBem no meio da fuça!!!');
			var pontuacao = ++this.candidatos[escolhido].golpesSofridos;
			if(pontuacao === maxGolpesRound){
				this.finalizaRound(escolhido);
			}
		};

		// Funções GET
		this.placarRound = function(){
			return [this.candidatos[0].golpesSofridos,this.candidatos[1].golpesSofridos];
		};

		this.placarGeral = function(){
			return [this.candidatos[0].roundsGanhos,this.candidatos[1].roundsGanhos];
		};

		this.placarCandidato = function(candidato){
			return this.candidatos[candidato].golpesSofridos;
		};
	}]);
