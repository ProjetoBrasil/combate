'use strict';

angular.module('projetobrasil.ufc.interface.directives', [])
  .directive('barraDeVida', function() {
    return {
    	restrict: 'E',
    	controller: 'barraDeVidaCtrl',
      	templateUrl: 'modules/interface/barra-de-vida.html'
    };
  });
