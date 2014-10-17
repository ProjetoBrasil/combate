'use strict';

angular.module('projetobrasil.ufc.personagem.services', [])
	.factory('Personagens', ['$rootScope', '$document', 'PropostasServ', 'GerenciadorJogo',
		function ($rootScope, $document, PropostasServ, Jogo) {

		var gerenciador = {};
		var personagens = {};
		var pow = {};
		var assetsCarregados = false;

		var canvas = {};
		var arena = {};

		var frameSize = { width: 476, height: 500 };
		var tamFigurasGolpe = { height: 195 };

		var queue = new createjs.LoadQueue();
		queue.installPlugin(createjs.Sound);

		gerenciador.inicializa = function(){
			gerenciador.reset();
			gerenciador.criaCanvas();
			gerenciador.criaSpritesPersonagens();
			gerenciador.inicializaEfeitos();

			createjs.Ticker.setFPS(10);
			createjs.Ticker.addEventListener('tick', arena);

			_.each(personagens, function(p){
				arena.addChild(p.sprites.ginga);
			});

			createjs.Sound.play("fundo", {loop:-1});

			Jogo.dialogRound();
		};

		gerenciador.criaCanvas = function(){
			$document.find('#arena').remove();

			var temp = angular.element('<canvas id="arena" width="1260" height="700"></canvas>');
			$document.find('.canvas-box').append(temp);

			canvas = $document.find('#arena')[0];
			arena = new createjs.Stage(canvas);
		};

		gerenciador.reset = function(){
			canvas = {};
			arena = {};
			personagens = {};
			pow = {};
		};

		gerenciador.carregaAssets = function() {
			// Só inicializa o jogo quando todas as imagens da fila já foram carregas
			function handleComplete() {
			    gerenciador.inicializa();
				$rootScope.$broadcast('imagensCarregadas');
				assetsCarregados = true;
			}

			if(assetsCarregados){
				handleComplete();
				return;
			}

			var manifest = [];

			// Prepara imagens de ataque por tema
			var temas = PropostasServ.getTemas();
			_.each(temas, function(tema) {
				var imagemTema = PropostasServ.getNomePastaTema(tema);
				manifest.push({id: tema, src: '/images/sem-cache/golpes/'+imagemTema+'.png'});
			});
			// Adiciona sons à lista de download
			queue.loadFile({id:"fundo", src:"sounds/fundo.mp3"});
			queue.loadFile({id:"ataque", src:"sounds/ataque.mp3"})

			// Prepara sprites dos personagens
			var ids = $rootScope.idsCandidatos;
			_.each(ids, function(idCandidato){
				manifest.push({id: idCandidato, src: '/images/sem-cache/sprites/'+ $rootScope.nomesCandidatos[idCandidato] +'_sprite.png'});
			});

			queue.on('complete', handleComplete, this);

			queue.loadManifest(manifest);
		};

		gerenciador.criaSpritesPersonagens = function(){
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
					images: ['/images/sem-cache/sprites/'+ $rootScope.nomesCandidatos[id] +'_sprite.png']
				});

				personagens[id].sprites = {};
				personagens[id].sprites.ginga = new createjs.Sprite(personagens[id].spriteSheets, 'ginga');
				personagens[id].sprites.ataque = new createjs.Sprite(personagens[id].spriteSheets, 'ataque');
				personagens[id].sprites.dano = new createjs.Sprite(personagens[id].spriteSheets, 'dano');

				if(indice === 1){
					personagens[id].lado = 'direita';
					_.each(personagens[id].sprites, function(s){
						s.x = arena.canvas.width - frameSize.width;
						s.y = arena.canvas.height - frameSize.height;
					});
					personagens[id].adversario = ids[0];
				}else{
					personagens[id].lado = 'esquerda';
					_.each(personagens[id].sprites, function(s){
						s.y = arena.canvas.height - frameSize.height;
					});
					personagens[id].adversario = ids[1];
				}
			});
		};

		gerenciador.inicializaEfeitos = function(){
			pow.spriteSheets = new createjs.SpriteSheet({
				frames: {
					width: 574,
					height: 496,
					numFrames: 3,
					regX: 287,
					regY: 248
				},
				animations: {
					pow: {
						frames: [0,1,2,2,2,1,0],
						speed: 0.9
					}
				},
				images: ['/images/sem-cache/sprites/pow_sprite.png']
			});
			pow.sprites = new createjs.Sprite(pow.spriteSheets, 'pow');
			pow.sprites.scaleX = 0.7;
			pow.sprites.scaleY = 0.7;
			pow.sprites.addEventListener('animationend', function(){
				var index = arena.getChildIndex(pow.sprites);
				arena.removeChildAt(index);
			});
		};

		gerenciador.ataque = function(id, tema, sucesso){
			personagens[id].sprites.ginga.gotoAndPlay('ataque');
			var lado = personagens[id].lado;
			var imagemTema = PropostasServ.getNomePastaTema(tema);
			var golpe = new createjs.Bitmap('/images/sem-cache/golpes/'+imagemTema+'.png');
			var stepsGolpe = 20;
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

			golpe.y = (arena.canvas.height - frameSize.height/2) - (golpe.scale * (tamFigurasGolpe.height/2));
			arena.addChild(golpe);

			golpe.index = arena.getChildIndex(golpe);

			function golpeia(scale, posX, angle, regX, regY){
				if(scale >= 1){
					createjs.Sound.play("ataque");
					gerenciador.animaPow(id);
					gerenciador.dano(id);
					arena.removeChildAt(golpe.index);
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

				var newY = (arena.canvas.height - frameSize.height/2) - (newScale * tamFigurasGolpe.height/2);
				var newAngle = angle + 15;

				golpe.setTransform(newX, newY, newScale, newScale, newAngle, 0, 0, regX, regY);
				var newRegX = golpe.image.width/2;
				var newRegY = golpe.image.height/2;

				window.setTimeout(function(){
					golpeia(newScale, newX, newAngle, newRegX, newRegY);
				}, 50);
			}
			golpeia(golpe.scale, golpe.x, golpe.angle, golpe.regX, golpe.regY);
		};

		gerenciador.dano = function(id){
			var idAdversario = personagens[id].adversario;
			personagens[idAdversario].sprites.ginga.gotoAndPlay('dano');
		};

		gerenciador.animaPow = function(id){
			if(personagens[id].lado === 'esquerda'){
				pow.sprites.x = arena.canvas.width - (frameSize.width / 2);
			}else{
				pow.sprites.x = frameSize.width / 2;
			}
			pow.sprites.y = (arena.canvas.height - frameSize.height/2);
			arena.addChild(pow.sprites);
		};

		return(gerenciador);
	}]);
