'use strict';

angular
	.module('projetobrasil.ufc.login.services', [
		])
.factory('UserLogin', ['$rootScope', '$http', function($rootScope, $http){

	var isUserLogged = false;
	var loggedUserData = {};

	var promise = $http.get($rootScope.apiBaseUrl + 'profile')
		.success(function(data) {
			isUserLogged = true;
			loggedUserData = data;
			// success(userData);
		}).error(function(error){
			console.log(error);
		});

	return {
		promise: function(){
			return promise;
		},
		facebookLogin: function(){
			var left = (screen.width/2)-(780/2);
			var top = (screen.height/2)-(410/2);
			var signinWin = window.open($rootScope.apiBaseUrl + 'auth/facebook', 'SignIn', 'width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,left=' + left + ',top=' + top);
			signinWin.focus();
			var timer = setInterval(function() {
				if(signinWin.closed) {
						clearInterval(timer);

						//Todo: Descobrir o motivo de ser chamado duas vezes aqui!

						promise = $http.get($rootScope.apiBaseUrl + 'profile')
						.success(function(data) {
							if(!isUserLogged){
								isUserLogged = true;
								loggedUserData = data;
								$rootScope.$broadcast('login');
							}
						}).error(function(){
							// console.log('Deu errado');
						});
				}
			}, 1000);
		},
		logout: function(success, error){
			 $http.get($rootScope.apiBaseUrl+'user/logout')
			 .success(function(data){
					isUserLogged = false;
					loggedUserData = {};
					$rootScope.$broadcast('logout');
					success(data);
				})
			 .error(error);
		},
		isUserLogged: function(){
			return isUserLogged;
		},
		getUserData: function(){
			if(isUserLogged){
				return loggedUserData;
			} else {
				return false;
			}
		},
		login: function(user, success, error){
			promise = $http.post($rootScope.apiBaseUrl+'user/login', user)
				.success(function(data, status, headers) {
					isUserLogged = true;
					loggedUserData = data.user;
					$rootScope.$broadcast('login');
					success(data);
				})
				.error(function(erro){
					error(erro);
				});
		},
		cadastrar: function(user, success, error){
			promise =  $http.post($rootScope.apiBaseUrl + 'user/register', user)
			.success(function(data, status, headers) {
				isUserLogged = true;
				loggedUserData = data.user;
				$rootScope.$broadcast('login');
				success();
				ga('send', 'event', 'form', 'register');
			})
			.error(function(erro){
				error(erro);
			});
		}
	};
}]);
