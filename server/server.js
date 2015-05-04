var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

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

// create a user
app.post('/api/users', function(req, res) {
	var receivedUser = req.body;
	
	var hash = bcrypt.hashSync(receivedUser.password, 10);

	var user = new User({
		username: receivedUser.username,
		passwordHash: hash
	});

	user.save(function() {
		res.status(201).send(user);
	});
});

app.get('/api/users', function(req, res) {
	User.find(function(err, users) {
		res.send(users);
	});
});

app.listen(port, function() {
	console.log('app listening on port: ' + port);
});