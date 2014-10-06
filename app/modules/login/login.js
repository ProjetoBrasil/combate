'use strict';

angular
	.module('projetobrasil.ufc.login', [
		'projetobrasil.ufc.login.services'
	]).config(['$httpProvider', function ($httpProvider) {
	  $httpProvider.defaults.withCredentials = true;
	}]);
