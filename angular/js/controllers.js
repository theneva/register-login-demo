var app = angular.module('registerLoginDemo', []);

app.controller('MainController', function($scope, $http) {
	$scope.posts = [];

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
			.success(function(token) {
				console.log('everything went well, token: ', token);

				$http.defaults.headers.common['x-auth'] = token;

				$http.get('/api/posts')
					.success(function(posts) {
						$scope.posts = posts;
				});

			})
			.error(function() {
				console.log('things went badly');
				console.log('Wrong username or password');
			});
	};
});
