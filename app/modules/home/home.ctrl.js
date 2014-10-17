'use strict';

angular
	.module('projetobrasil.ufc.home.controllers', [
		'ngDialog'
		])
	.controller('HomeCtrl', function($scope, ngDialog, $state, UserLogin, Audio){

		var dialog;

		Audio.tocaAudio('inicio')

		$scope.openLoginModal = function(){
			dialog = ngDialog.open({
				template: 'modules/home/modal.html',
				controller: ['$scope', 'UserLogin', function($scope, UserLogin) {
					$scope.facebookLogin = UserLogin.facebookLogin;
				}],
				className: 'ngdialog-theme-default dialog-login-home'
			});
		};

		$scope.jogar = function(){
			if(UserLogin.isUserLogged()){
				Audio.paraAudio('inicio');
				Audio.tocaAudio('brasil');
				$state.go('jogo');
			} else {
				$scope.openLoginModal();
			}
		};

		$scope.$on('login', function(){
			$state.go('jogo');
			dialog.close();
		});
	});
