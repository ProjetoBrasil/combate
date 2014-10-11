'use strict';

angular.module('projetobrasil.ufc.jogo.services', [])
	.factory('GerenciadorJogo', ['$rootScope', '$state', 'Angularytics', 'ngDialog', '$timeout',
	 function ($rootScope, $state, Angularytics, ngDialog, $timeout){
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
		gerenciador.inicializaNovoJogo = function(){
			Angularytics.trackEvent('Jogo', 'Jogo iniciado');
			this.roundAtual = 0;
			var idsCandidatos = $rootScope.idsCandidatos;
			var candidatos = this.candidatos;

			_.each(idsCandidatos,function(id){
				if(!candidatos[id]){
					candidatos[id] = {};
				}
				candidatos[id].roundsGanhos = 0;
				candidatos[id].golpesSofridos = 0;
				candidatos[id].adversario = id === idsCandidatos[0] ? idsCandidatos[1] : idsCandidatos[0];
			});
			gerenciador.dialogRound();
		};

		gerenciador.reiniciaJogo = function(){
			this.roundAtual = 0;
			var idsCandidatos = $rootScope.idsCandidatos;
			var candidatos = this.candidatos;

			_.each(idsCandidatos,function(id){
				candidatos[id].roundsGanhos = 0;
				candidatos[id].golpesSofridos = 0;
			});
		};

		gerenciador.finalizaJogo = function(vencedor){
			Angularytics.trackEvent('Jogo', 'Jogo finalizado', $rootScope.nomesCandidatos[vencedor]);
			gerenciador.reiniciaJogo();
			$state.go('resultado');
		};

		// Gerencia os rounds
		gerenciador.comecaNovoRound = function(){
			Angularytics.trackEvent('Jogo', 'Round iniciado');
			this.roundAtual++;
			_.each(this.candidatos,function(c){
				c.golpesSofridos = 0;
			});
			gerenciador.dialogRound();
		};

		gerenciador.finalizaRound = function(vencedor){
			Angularytics.trackEvent('Jogo', 'Round finalizado');
			var roundsGanhos = ++this.candidatos[vencedor].roundsGanhos;
			if(roundsGanhos >= this.minRoundsParaVitoria){
				this.finalizaJogo(vencedor);
			}else{
				this.comecaNovoRound();
			}
		};

		gerenciador.dialogRound = function() {
			var roundDialogId = ngDialog.open({
				template: 'modules/interface/novo-round.html',
				showClose: false,
				className: 'ngdialog-theme-default dialog-round',
				controller: function ($scope) {
					$scope.mensagem = 'Round ' + (gerenciador.roundAtual + 1) ;
					$timeout(function() {
						$scope.mensagem = 'Fight!';
					},1200);
				}
			});
			$timeout(function() {
				ngDialog.close(roundDialogId);
			},1600);
		};

		// Gerencia os golpes
		gerenciador.atualizaPlacar = function(escolhido){
			var adversario = this.candidatos[escolhido].adversario;
			var pontuacao = ++this.candidatos[adversario].golpesSofridos;
			if(pontuacao === this.maxGolpesRound){
				this.finalizaRound(escolhido);
			}
			Angularytics.trackEvent('Jogo', 'Proposta escolhida', 'Round ' + this.roundAtual, this.totalGopesRound());

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

		gerenciador.inicializaNovoJogo();
		return gerenciador;
	}]);
