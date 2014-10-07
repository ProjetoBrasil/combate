'use strict';

angular
	.module('projetobrasil.ufc.home.controllers', [
		'ngDialog'
		])
	.controller('HomeCtrl', function($scope, ngDialog, $state, UserLogin){

		var dialog;

		$scope.openLoginModal = function(){
			dialog = ngDialog.open({
				template: 'modules/home/modal.html',
				controller: ['$scope', 'UserLogin', function($scope, UserLogin) {
					$scope.facebookLogin = UserLogin.facebookLogin;
				}]
			});
		};

		$scope.jogar = function(){
			if(UserLogin.isUserLogged()){
				$state.go('jogo', {}, {reload: true});
			} else {
				$scope.openLoginModal();
			}
		};

		$scope.$on('login', function(){
			$state.go('jogo');
			dialog.close();
		});
	});
