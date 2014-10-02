'use strict';

angular.module('projetobrasil.ufc.personagem.services', [])
	.factory('Personagens', ['$rootScope', '$document', 'PropostasServ', function ($rootScope, $document, PropostasServ) {

		var gerenciador = {};
		var personagens = {};

		var canvas = $document.find('#arena')[0];
		var arena = new createjs.Stage(canvas);

		var frameSize = { width: 476, height: 500 };
		var tamFigurasGolpe = { height: 195 };

		gerenciador.inicializa = function(){
			var ids = $rootScope.idsCandidatos;
			_.each(ids, function(id, indice){
				personagens[id] = {};
				personagens[id].spriteSheets = {};
				personagens[id].spriteSheets = new createjs.SpriteSheet({
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
					images: ['/images/'+id+'_sprite.png']
				});

				personagens[id].sprites = {};
				personagens[id].sprites.ginga = new createjs.Sprite(personagens[id].spriteSheets, 'ginga');
				personagens[id].sprites.ataque = new createjs.Sprite(personagens[id].spriteSheets, 'ataque');
				personagens[id].sprites.dano = new createjs.Sprite(personagens[id].spriteSheets, 'dano');

				if(indice === 1){
					personagens[id].lado = 'direita';
					_.each(personagens[id].sprites, function(s){
						s.x = arena.canvas.width - frameSize.width;
					});
					personagens[id].adversario = ids[0];
				}else{
					personagens[id].lado = 'esquerda';
					personagens[id].adversario = ids[1];
				}
			});

			createjs.Ticker.setFPS(10);
			createjs.Ticker.addEventListener('tick', arena);

			_.each(personagens, function(p){
				arena.addChild(p.sprites.ginga);
			});

			arena.addEventListener('click', gerenciador.ataque);

		};

		gerenciador.ataque = function(id, tema, sucesso){
			personagens[id].sprites.ginga.gotoAndPlay('ataque');
			var lado = personagens[id].lado;
			var imagemTema = PropostasServ.getNomePastaTema(tema);
			var golpe = new createjs.Bitmap('/images/golpes/'+imagemTema+'.png');
			var stepsGolpe = 40;
			var ajuste = 20;

			golpe.scale = 0;
			golpe.angle = 0;
			golpe.regX = 0;
			golpe.regY = 0;
			if(lado === 'esquerda'){
				golpe.x = (frameSize.width / 2) + ajuste;
			}else{
				golpe.x = arena.canvas.width - (frameSize.width / 2) - ajuste;
			}

			golpe.y = arena.canvas.height/2 - (golpe.scale * (tamFigurasGolpe.height/2));
			arena.addChild(golpe);

			var index = arena.getChildIndex(golpe);

			function golpeia(scale, posX, angle, regX, regY){
				if(scale >= 1){
					gerenciador.dano(id);
					arena.removeChildAt(index);
					sucesso();
					return;
				}

				var newScale = scale + (1/stepsGolpe);
				var newX = posX;

				if(lado === 'esquerda'){
					newX += (arena.canvas.width - frameSize.width) / stepsGolpe;
				}else{
					newX -= (arena.canvas.width - frameSize.width) / stepsGolpe;
				}

				var newY = arena.canvas.height/2 - (newScale * tamFigurasGolpe.height/2);

				var newAngle = Math.sin(angle + 0.04) * 360;

				golpe.setTransform(newX, newY, newScale, newScale, newAngle, 0, 0, regX, regY);
				var newRegX = golpe.image.width/2;
				var newRegY = golpe.image.height/2;

				window.setTimeout(function(){
					golpeia(newScale, newX, newAngle, newRegX, newRegY);
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
			golpeia(golpe.scale, golpe.x, golpe.angle, golpe.regX, golpe.regY);

		};

		gerenciador.dano = function(id){
			var idAdversario = personagens[id].adversario;
			personagens[idAdversario].sprites.ginga.gotoAndPlay('dano');
		};

		gerenciador.inicializa();

		return(gerenciador);
	}]);
