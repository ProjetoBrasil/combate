'use strict';

angular.module('projetobrasil.ufc.personagem.services', [])
	.factory('Personagens', ['$rootScope', '$document', function ($rootScope, $document) {

		var gerenciador = {};
		var personagens = {};

		var canvas = $document.find('#arena')[0];
		var arena = new createjs.Stage(canvas);

		var frameSize = [390,410];

		gerenciador.inicializa = function(){
			var nomes = $rootScope.nomesCandidatos;
			_.each(nomes, function(c, indice){
				personagens[c] = {};
				personagens[c].spriteSheets = {};
				personagens[c].spriteSheets = new createjs.SpriteSheet({
					frames: {
						width: frameSize[0],
						height: frameSize[1],
						numFrames: 14,
						regX: 0,
						regY: 0
					},
					animations: {
						ginga: {
							frames: [0,1,2,3,4,5,6,7],
							next: 'ginga',
							speed: 1
						},
						ataque: {
							frames : [8,9,10,9,8],
							next: 'ginga',
							speed: 1
						},
						dano: {
							frames : [11,12,13,12,11],
							next: 'ginga',
							speed: 1
						}
					},
					images: ['/images/'+c+'_sprite.png']
				});

				personagens[c].sprites = {};
				personagens[c].sprites.ginga = new createjs.Sprite(personagens[c].spriteSheets, 'ginga');
				personagens[c].sprites.ataque = new createjs.Sprite(personagens[c].spriteSheets, 'ataque');
				personagens[c].sprites.dano = new createjs.Sprite(personagens[c].spriteSheets, 'dano');

				if(indice === 1){
					console.log(personagens[c]);
					_.each(personagens[c].sprites, function(s){
						s.x = arena.canvas.width - frameSize[0];
					});
				}
			});

			createjs.Ticker.setFPS(10);
			createjs.Ticker.addEventListener('tick', arena);

			arena.addChild(personagens.dilma.sprites.ginga);
			arena.addChild(personagens.marina.sprites.ginga);

			// arena.addEventListener('click', gerenciador.ataque);
			// arena.addEventListener('doubleclick', gerenciador.dano);

		};

		gerenciador.ataque = function(nome){
			personagens[nome].sprites.ginga.gotoAndPlay('ataque');
		};

		gerenciador.dano = function(nome){
			personagens[nome].sprites.ginga.gotoAndPlay('dano');
		};


		gerenciador.inicializa();

		return(gerenciador);
	}]);
