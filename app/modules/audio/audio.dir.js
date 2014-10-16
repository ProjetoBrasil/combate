'use strict';

angular.module('projetobrasil.ufc.audio.directives', [])
  .directive('mudo', function() {
    return {
    	restrict: 'E',
    	controller: 'mudoCtrl',
      	templateUrl: 'modules/audio/mudo.html'
    };
  });
