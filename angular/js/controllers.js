var app = angular.module('registerLoginDemo', []);

app.controller('MainController', function($scope, $http) {
	$scope.signup = function(username, password) {
		console.log('username', username, 'password', password);

		var newUser = {
			username: username,
			password: password
		};

		$http.post('/api/users', newUser)
			.success(function(user) {
				console.log('successfully registerd', user);
			})
			.error(function() {
				console.log('Something went wrong');
			});
	};

	$scope.login = function(username, password) {
		console.log('login', username, password);

		var user = {
			username: username,
			password: password
		};

		$http.post('/api/sessions', user)
			.success(function() {
				console.log('everything went well');
			})
			.error(function() {
				console.log('things went badly');
				console.log('Wrong username or password');
			});
	};
});
