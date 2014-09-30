'use strict';

angular.module('projetobrasil.ufc.propostas.directives', [])

/*
 * Essa diretiva somente inclui o HTML do box de propostas, assume que há um
 * controlador 'PropostasCtrl' que define uma funçao $scope.escolherProposta(idAutor)
 * que ocorre ao clique de uma proposta
 */
.directive('boxpropostas', [function () {
	return {
		restrict: 'E',
		templateUrl: 'modules/propostas/box-propostas.html',
		link: function (scope, element, attrs) {

		}
	};
}]);
