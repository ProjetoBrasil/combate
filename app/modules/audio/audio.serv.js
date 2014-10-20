'use strict';

/**
 * Para tocar um áudio, é necessário que ele esteja registrado em
 * arquivosAudio
 */
angular.module('projetobrasil.ufc.audio.services', [])
	.factory('Audio', [
		function () {

		var audio = {
			loadQueue: new createjs.LoadQueue(),
			arquivosAudio: [
				{id: 'inicio', src: 'sounds/inicio.ogg'},
				{id: 'brasil', src: 'sounds/brazil.ogg'},
				{id: 'fundo', src: 'sounds/luta-fundo.ogg'},
				{id: 'porrada', src: 'sounds/porrada2.ogg'},
				{id: 'fim', src: 'sounds/wins.ogg'}
			]
		};

		var instancias = {};

		audio.loadQueue.installPlugin(createjs.Sound);

		audio.getMudo = function() {
			return createjs.Sound.getMute();
		};
		audio.setMudo = function(value) {
			createjs.Sound.setMute(value);
		};

		audio.tocaAudio = function(audioId, loop) {
			loop = loop || 0;
			instancias[audioId] = createjs.Sound.play(audioId, {loop: loop});

			if (instancias[audioId].playState !== createjs.Sound.PLAY_SUCCEEDED){
				carregaETocaAudio(audioId, loop);
			}
		};

		/**
		 * Quando Preload não for executado antes do play é preciso registrá-lo
		 * antes de tocá-lo
		 */
		function carregaETocaAudio(audioId, loop) {
			var arquivoAudio = _.find(audio.arquivosAudio, function(obj){ return obj.id === audioId; });
			function handleLoad() {
				instancias[audioId] = createjs.Sound.play(arquivoAudio.id, {loop: loop});
			}
			createjs.Sound.addEventListener('fileload', handleLoad);
			createjs.Sound.registerSound(arquivoAudio);
		}

		audio.paraAudio = function(audioId) {
			instancias[audioId].stop();
		};

		audio.setMudo(false);

		return audio;

}]);
