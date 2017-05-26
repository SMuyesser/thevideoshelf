const express = require('express');
const router = express.Router();

const User = require('../models/userschema')

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res) {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Name is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors: errors
		});
	} else {
		const newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		})

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

module.exports = router;



/*const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var mongoose = require('mongoose');

const Client = require('../models/clientmodel');

mongoose.Promise = global.Promise;


//Routes will be moved later to folder
router.get('/', function(req, res) {
	res.send('Please use /api/clients');
});

// Get Clients
router.get('/users/clients', function(req, res) {
	Client.getClients(function(err, clients) {
		if(err) {
			throw err;
		}
		res.json(clients);
	});
});

// Get Client by Id
router.get('/users/clients/:_id', function(req, res) {
	Client.getClientsById(req.params._id, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Add new Client
router.post('/users/clients', function(req, res) {
	const client = req.body;
	Client.addClient(client, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Update a Client
router.put('/users/clients/:_id', function(req, res) {
	const id = req.params._id;
	const client = req.body;
	Client.updateClient(id, client, {}, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Delete a client
router.delete('/users/clients/:_id', function(req, res) {
	const id = req.params._id;
	Client.removeClient(id, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
 	});
});

module.exports = router;*/