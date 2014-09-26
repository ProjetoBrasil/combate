'use strict';

angular.module('projetobrasil.ufc.personagem.controllers', [])
	.controller('PersonagemCtrl', [function (){


		var ss = new createjs.SpriteSheet({
			'frames': {
				'width': 380,
				'height': 400,
				'numFrames': 8,
				'regX': 0,
				'regY': 0
			},
			'animations': {'ginga': [0, 7]},
			'images': ['/images/dilma_sprite_ginga.png']
		});
		ss.getAnimation('ginga').speed = 0.25;

		var canvas = document.getElementById('arena');
		var stage = new createjs.Stage(canvas);
		var sprite = new createjs.Sprite(ss, 'ginga');
		sprite.scaleY = sprite.scaleX = 0.4;

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick', stage);

		stage.addChild(sprite);
	}]);
