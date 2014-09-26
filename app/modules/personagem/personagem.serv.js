'use strict';

angular.module('projetobrasil.ufc.personagem.services', [])
	.factory('personagem', ['$rootScope', '$document', function ($rootScope, $document) {

		var gerenciador = {};

		var personagens = {
		}
		var spriteSheets = {};
		var sprites = {};

		var canvas = $document.find('#arena')[0];
		var arena = new createjs.Stage(canvas);


		gerenciador.inicializa = function(){
			var nomes = $rootScope.nomesCandidatos;
			nomes.forEach(function(c){

				personagens[c] = {};

				personagens[c].spriteSheets = {};
				personagens[c].spriteSheets.ginga = new createjs.SpriteSheet({
					'frames': {
						'width': 380,
						'height': 400,
						'numFrames': 8,
						'regX': 0,
						'regY': 0
					},
					'animations': {'ginga': [0, 7, false, 0.5]},
					'images': ['/images/'+c+'_sprite_ginga.png']
				});
				personagens[c].spriteSheets.ataque = new createjs.SpriteSheet({
					'frames': {
						'width': 360,
						'height': 400,
						'numFrames': 5,
						'regX': 0,
						'regY': 0
					},
					'animations': {'ataque': [0, 4, 'ginga', 0.5]},
					'images': ['/images/'+c+'_sprite_ataque.png']
				});
				personagens[c].spriteSheets.dano = new createjs.SpriteSheet({
					'frames': {
						'width': 437,
						'height': 400,
						'numFrames': 5,
						'regX': 0,
						'regY': 0
					},
					'animations': {'dano': [0, 4, 'ginga', 0.5]},
					'images': ['/images/'+c+'_sprite_dano.png']
				});

				personagens[c].sprites = {};
				personagens[c].sprites.ginga = new createjs.Sprite(personagens[c].spriteSheets.ginga, 'ginga');
				personagens[c].sprites.ataque = new createjs.Sprite(personagens[c].spriteSheets.ataque, 'ataque');
				personagens[c].sprites.dano = new createjs.Sprite(personagens[c].spriteSheets.dano, 'dano');
			});
		};



		// var ss = new createjs.SpriteSheet({
		//     'frames': {
		//         'width': 375,
		//         'height': 550,
		//         'numFrames': 8,
		//         'regX': 0,
		//         'regY': 0
		//     },
		//     'animations': {'ginga': [1, 8]},
		//     'images': ['/images/sprite_dilma.png']
		// });
		// ss.getAnimation('ginga').speed = 0.1;

		// var canvas = document.getElementById('dilma');
		// var stage = new createjs.Stage(canvas);
		// var sprite = new createjs.Sprite(ss, 'ginga');
		// sprite.scaleY = sprite.scaleX = 0.4;

		// createjs.Ticker.setFPS(60);
		// createjs.Ticker.addEventListener('tick', stage);

		// stage.addChild(sprite);


		return({});
	}]);
