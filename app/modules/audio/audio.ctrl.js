'use strict';

angular.module('projetobrasil.ufc.audio.controllers', [])
	.controller('mudoCtrl', ['$scope', 'Audio',
		function($scope, Audio) {

		$scope.mudo = Audio.getMudo();

		$scope.alteraMudo = function(){
			Audio.setMudo(!$scope.mudo);
			$scope.mudo = Audio.getMudo();
		};

	}]);
