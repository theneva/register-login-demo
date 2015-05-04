var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();
var port = 5238;

/* ===== MONGOOSE STUFF ===== */

mongoose.connect('mongodb://localhost/registerLoginDemo');

var User = mongoose.model('User', {
	username: String,
	passwordHash: String
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
			// user was logged in
			return res.status(200).send('ok');
		} else {
			return res.status(401).send('Wrong password');
		}
	});
});

app.listen(port, function() {
	console.log('app listening on port: ' + port);
});