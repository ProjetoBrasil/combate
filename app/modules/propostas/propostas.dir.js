'use strict';

angular.module('projetobrasil.ufc.propostas.directives', [])

/*
 * Assume que existe um controller PropostasCtrl que implementa
 * $scope.escolherProposta(idAutor) executada ao votar em uma propostas
 *
 */
.directive('boxpropostas', [function () {
	return {
		restrict: 'E',
		templateUrl: 'modules/propostas/box-propostas.html',
		link: function (scope, element, attrs) {

		}
	};
}]);
