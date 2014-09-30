'use strict';

angular.module('projetobrasil.ufc.personagem.services', [])
	.factory('Personagens', ['$rootScope', '$document', 'PropostasServ', function ($rootScope, $document, PropostasServ) {

		var gerenciador = {};
		var personagens = {};

		var canvas = $document.find('#arena')[0];
		var arena = new createjs.Stage(canvas);

		var frameSize = { width: 390, height: 410 };
		var tamFigurasGolpe = { width: 856, height: 600 };

		gerenciador.inicializa = function(){
			var ids = $rootScope.idsCandidatos;
			_.each(ids, function(c, indice){
				personagens[c] = {};
				personagens[c].spriteSheets = {};
				personagens[c].spriteSheets = new createjs.SpriteSheet({
					frames: {
						width: frameSize.width,
						height: frameSize.height,
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
					personagens[c].lado = 'direita';
					_.each(personagens[c].sprites, function(s){
						s.x = arena.canvas.width - frameSize.width;
					});
				}else{
					personagens[c].lado = 'esquerda';
				}
			});

			createjs.Ticker.setFPS(10);
			createjs.Ticker.addEventListener('tick', arena);

			_.each(personagens, function(p){
				arena.addChild(p.sprites.ginga);
			});

			arena.addEventListener('click', gerenciador.ataque);

		};

		gerenciador.ataque = function(nome, tema, sucesso){
			personagens[nome].sprites.ginga.gotoAndPlay('ataque');
			var lado = personagens[nome].lado;
			var pastaTema = PropostasServ.getNomePastaTema(tema);
			pastaTema = 'meio_ambiente'; // REMOVE ME
			var golpe = new createjs.Bitmap('/images/golpes/'+pastaTema+'_'+lado+'.png');
			var stepsGolpe = 20;

			golpe.scale = 0;
			golpe.angle = 0;
			if(lado === 'esquerda'){
				golpe.x = (frameSize.width / 2) + 20;
			}else{
				golpe.x = arena.canvas.width - (frameSize.width / 2) - 20;
			}

			golpe.y = arena.canvas.height/2 - (golpe.scale * tamFigurasGolpe.height/2);
			arena.addChild(golpe);
			var index = arena.getChildIndex(golpe);

			function golpeia(scale, posX, angle){
				if(scale >= 1){
					arena.removeChildAt(index);
					return;
				}

				var newScale = scale + (1/stepsGolpe);
				var newX = posX;
				if(lado === 'esquerda'){
					console.log('Esquerda');
					console.log(newX);
					newX += (arena.canvas.width - frameSize.width) / stepsGolpe;
				}else{
					console.log('Direita');
					console.log(newX);
					newX -= (arena.canvas.width - frameSize.width) / stepsGolpe;
				}

				var newY = arena.canvas.height/2 - (newScale * tamFigurasGolpe.height/2);

				// FIX-ME: tirar ao máximo o espaço em branco das imagens para melhorar animação de rotação
				// var newAngle = Math.sin(angle + 0.04) * 360;
				var newAngle = 0;

				golpe.setTransform(newX, newY, newScale, newScale, newAngle);

				window.setTimeout(function(){
					golpeia(newScale, newX, newAngle);
				}, 80);
			}

			function acertou(lado, posX){
				var hit = false;
				if(lado === 'esquerda'){
					hit = posX > (arena.canvas.width - frameSize.width);
				}else{
					hit = posX < frameSize.width;
				}
				return hit;
			}
			golpeia(golpe.scale, golpe.x, golpe.angle);
			sucesso(); // Chamar ao fim do evento de golpe

		};

		gerenciador.dano = function(nome){
			personagens[nome].sprites.ginga.gotoAndPlay('dano');
		};


		gerenciador.inicializa();

		return(gerenciador);
	}]);
