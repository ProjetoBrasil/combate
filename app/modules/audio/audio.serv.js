'use strict';

angular.module('projetobrasil.ufc.audio.services', [])
	.factory('Audio', [
		function () {

		var audio = {
			loadQueue: new createjs.LoadQueue(),
			arquivosAudio: [
				{id: 'fundo', src: 'sounds/luta-fundo.ogg'},
				{id: 'porrada', src: 'sounds/porrada2.ogg'}
			]
		};

		audio.loadQueue.installPlugin(createjs.Sound);

		audio.getMudo = function() {
			return createjs.Sound.getMute();
		};
		audio.setMudo = function(value) {
			createjs.Sound.setMute(value);
		};

		audio.tocaAudio = function(audioId, loop) {
			loop = loop || 0;
			createjs.Sound.play(audioId, {loop: loop});
		};

		audio.paraAudio = function(audioId) {
			createjs.Sound.removeSound(audioId);
		};

		audio.setMudo(false);

		return audio;

}]);
