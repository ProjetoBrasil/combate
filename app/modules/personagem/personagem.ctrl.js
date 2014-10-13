'use strict';

angular.module('projetobrasil.ufc.personagem.controllers', [])
	.controller('PersonagemCtrl', ['Personagens', function (Personagens){
		Personagens.carregaAssets();
	}]);
