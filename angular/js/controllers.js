var app = angular.module('registerLoginDemo', []);

app.controller('MainController', function($scope, $http) {
	$scope.signup = function(username, password) {
		console.log('username', username, 'password', password);

		var user = {
			username: username,
			password: password
		};

		$http.post('/api/users', user);
	};
});
