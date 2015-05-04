var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var morgan = require('morgan');
var jwt = require('jwt-simple');

var secrets = {
	jwt: 'some great secret!"#78989'
};

var app = express();
var port = 5238;

/* ===== MONGOOSE STUFF ===== */

mongoose.connect('mongodb://localhost/registerLoginDemo');

var User = mongoose.model('User', {
	username: String,
	passwordHash: String
});

var Post = mongoose.model('Post', {
	author: String,
	body: String,
	active: Boolean
});

/* =====    API STUFF   ===== */

// serve the HTML (angular app)
app.use('/', express.static(__dirname + "/../angular"));

// use body-parser for the API
app.use('/api', bodyParser.json());
app.use('/api', morgan('dev'));

// create a user
app.post('/api/users', function(req, res) {
	var receivedUser = req.body;
	
	var hash = bcrypt.hashSync(receivedUser.password, 10);

	// check if a user with that username already exists
	User.findOne({username: receivedUser.username}, function(err, user) {
		if (user) {
			return res.status('401').send('Username already exists');
		} else {
			var user = new User({
				username: receivedUser.username,
				passwordHash: hash
			});

			user.save(function() {
				return res.status(201).send(user);
			});
		}
	});
});

app.get('/createposts', function(req, res) {
	Post.create([
		{author: 'theneva', active: true, body: 'post 1'},
		{author: 'theneva', active: false, body: 'post 2'},
		{author: 'theneva', active: false, body: 'post 3'},
		{author: 'theneva', active: true, body: 'post 4'},
		{author: 'dickeyxxx', active: true, body: 'post 5'},
		{author: 'dickeyxxx', active: false, body: 'post 6'},
		{author: 'dickeyxxx', active: true, body: 'post 7'},
	]);

	res.send();
});

app.get('/api/users', function(req, res) {
	User.find(function(err, users) {
		res.send(users);
	});
});

app.post('/api/sessions', function(req, res) {
	var loginAttempt = req.body;

	User.findOne({username: loginAttempt.username}, function(err, user) {
		if (!user) {
			return res.status(401).send('Wrong username');
		}

		var passwordsMatch = bcrypt.compareSync(loginAttempt.password, user.passwordHash);

		if (passwordsMatch) {
			// user can be logged in
			var token = jwt.encode({username: user.username}, secrets.jwt);
			return res.status(200).send(token);
		} else {
			return res.status(401).send('Wrong password');
		}
	});
});

app.get('/api/posts/all', function(req, res) {
	Post.find(function(err, posts) {
		return res.json(posts);
	});
});

app.get('/api/posts', function(req, res) {
	var token = req.header('x-auth');

	var user = jwt.decode(token, secrets.jwt);

	console.log('request from user: ', user.username);

	Post.find()
		.or([
			{author: user.username},
			{active: true}
		])
		.exec(function(err, posts) {
			return res.json(posts);
		});
});

app.listen(port, function() {
	console.log('app listening on port: ' + port);
});