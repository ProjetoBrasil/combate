'use strict';

angular
	.module('projetobrasil.ufc.home.controllers', [
		'ngDialog'
		])
	.controller('HomeCtrl', function($scope, ngDialog, $state, UserLogin, Audio){

		var dialog;

		Audio.tocaAudio('inicio');

		$scope.openLoginModal = function(){
			dialog = ngDialog.open({
				template: 'modules/home/modal-padrao.html',
				controller: 'ModalCtrl',
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
			Audio.paraAudio('inicio');
			Audio.tocaAudio('brasil');
			$state.go('jogo');
			dialog.close();
		});
	})
	.controller('ModalCtrl',
	['$scope', 'UserLogin', 'ngDialog',
		function ($scope, UserLogin, ngDialog){
			$scope.facebookLogin = UserLogin.facebookLogin;
			$scope.step = 'padrao';
			$scope.user = {};
			$scope.erro = false;


			$scope.login = function(usuario){
				UserLogin.login(usuario, loginSucesso, function(erro){
					$scope.mensagem = 'Login ou senha inválidos';
					$scope.erro = true;
				});
			};

			$scope.modalLoginAlternativo = function(){
				$scope.user = {};
				$scope.erro = false;
				$scope.step = 'login';
			};

			$scope.modalCadastrar = function(){
				$scope.user = {};
				$scope.erro = false;
				$scope.step = 'cadastrar';
			};

			$scope.cadastrar = function(usuario){
				UserLogin.cadastrar(usuario, loginSucesso, function(erro){
					$scope.mensagem = 'Erro ao cadastrar usuário, tente novamente';
					$scope.erro = true;
				});
			};

			function loginSucesso(){
				ngDialog.close();
			}
		}
	]);
