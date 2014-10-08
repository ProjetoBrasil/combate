'use strict';

angular.module('projetobrasil.ufc.jogo.services', [])
	.factory('GerenciadorJogo', [ '$log', '$rootScope', 'Angularytics',
	 function ($log, $rootScope, Angularytics){
		var maxRounds = 3;

		var gerenciador = {
			roundAtual : 0,
			maxGolpesRound : 10,
			minRoundsParaVitoria: parseInt(maxRounds/2)+1,
			totalGolpesSessaoCount: 0,
			candidatos : {}
		};

		gerenciador.totalGopesRound = function(){
			var totalGolpesSofridos = 0;
			_.each(this.candidatos, function(c){
				totalGolpesSofridos += c.golpesSofridos;
			});
			return totalGolpesSofridos;
		};

		// Gerencia o jogo
		gerenciador.inicializaJogo = function(){
			Angularytics.trackEvent("Jogo", "Jogo iniciado");
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
			Angularytics.trackEvent("Jogo", "Jogo finalizado", $rootScope.nomesCandidatos[vencedor]);
			$log.info('Fim de jogo\n'+this.placarGeral());
			$log.info('Vencedor: '+vencedor);
			gerenciador.inicializaJogo();
		};

		// Gerencia os rounds
		gerenciador.comecaNovoRound = function(){
			Angularytics.trackEvent("Jogo", "Round iniciado");
			this.roundAtual++;
			$log.info('Começa novo round\nRound ->'+this.roundAtual);
			_.each(this.candidatos,function(c){
				c.golpesSofridos = 0;
			});
		};

		gerenciador.finalizaRound = function(vencedor){
			Angularytics.trackEvent("Jogo", "Round finalizado");
			$log.info('Round finalizado\nPlacar do Round: '+this.placarRound());
			this.roundAtual++;
			var roundsGanhos = ++this.candidatos[vencedor].roundsGanhos;
			if(roundsGanhos >= this.minRoundsParaVitoria){
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
			Angularytics.trackEvent("Jogo", "Proposta escolhida", "Round " + this.roundAtual, this.totalGopesRound());

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
