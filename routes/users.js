const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const db = require('mongodb').Db;
const passport = require('passport');
const UserStrategy = require('passport-local').Strategy;

const User = require('../models/userschema');
const Client = require('../models/clientschema');
const DATABASE_URL = require('../config');

// Finds Client by Id
const clientLoader = function(req, res, next) {
  Client.findById(req.params.clientId)
  .then(function(client) {
    req.vsClient = client;
    next();
  })
  .catch(function(err){
    console.log(error);
    res.sendStatus(404);
  });
};

// Function to ensure non users can't get into user functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg', 'You must be logged in to access this page.');

		res.redirect('/users/login');
	}
}

// Render User Register
router.get('/register', function(req, res){
	res.render('register');
});

// Render User Login
router.get('/login', function(req, res){
	res.render('login');
});

// Render Register New Client
router.get('/registerclient', ensureAuthenticated, function(req, res){
	res.render('registerclient');
});

// Render Clientlist
router.get('/clientlist', ensureAuthenticated, function(req, res){
	Client.find()
	.then(function(clients){
		res.render('clientlist', {clients});
	})
});

// Render Edit Client
router.get('/editclient/:clientId', ensureAuthenticated, clientLoader, function(req, res){
	res.render('editclient', req.vsClient);
});

// Get Client by id
router.get('/clientlist/:clientId', clientLoader, function(req, res) {
	res.render('clientpage', req.vsClient);
});

// Register New User
router.post('/register', function(req, res) {
	const {name, email, username, password, password2} = req.body;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	// If there are errors, render the form with errors, otherwise create new user with success msg, and go to login page
	if(errors){
		res.render('register', {
			errors: errors
		});
	} else {
		const newUser = new User({name, email, username, password});

		// Creates mongoose new user, then success message and redirect to login
		User.createUser(newUser)
		.then(function(user){
			req.flash('success_msg', 'You are registered and can now login');
			res.redirect('/users/login');
		})
		.catch(function(err) {
			console.error(err);
			req.flash('error_msg', 'An error occured');
			res.redirect('/users/register');	
		})

	}
});

// Register New Client
router.post('/registerclient', function(req, res) {
	const {name, logo, videos, createdBy} = req.body;
	// Validation
	req.checkBody('name', 'Client name is required').notEmpty();
/*	req.checkBody('videos[]', 'Must enter a vimeo video url').notEmpty();
*/	/*req.checkBody('clientLogo', 'Client logo must be an image').isImage();*/

	const errors = req.validationErrors();

	// If there are errors, render the form with errors, otherwise create new client with success msg
	if(errors){
		res.render('registerclient', {
			errors: errors
		});
	} else {
		const newClient = new Client({name, logo, videos, createdBy: req.user});

		// Creates mongoose new client, then success message and redirect to login
		console.log(newClient);
		newClient.save()
		.then(function(client){
			req.flash('success_msg', 'Your client has been registered');
			res.redirect('/users/clientlist');
		})
		.catch(function(err) {
			console.error(err);
			req.flash('error_msg', 'An error occured');
			res.redirect('/users/registerclient');	
		})
	}
});

// Update Client
router.put('/clientlist/:_id', ensureAuthenticated, function(req, res) {
	Client.findById(req.params._id, function (err, client) {  
	    if (err) {
	        res.status(500).send(err);
	    } else {
	        client.name = req.body.name || client.name;
	        client.logo = req.body.logo || client.logo;
	        client.videos = req.body.videos || client.videos;

	        // Save the updated document back to the database
	        client.save(function (err, client) {
	            if (err) {
	                res.status(500).send(err)
	            }
	            res.send(client);
	        });
	    }
	});
});

// Delete Client
router.delete('/clientlist/:_id', ensureAuthenticated, function(req, res) {
  	Client.findByIdAndRemove(req.params._id, function (err, client) {
  		var response = {
  			message: "The following client has been successfully deleted",
  			name: client.name,
  			id: client._id
  		};
	  	res.send(response);
  	});
});

// For logging in. gets username, matches what you put in, finds what you put in, validates password
passport.use(new UserStrategy(
  	function(username, password, done) {
  		// Check if there is a user match
  		User.getUserByUsername(username, function(err, user){
  			if(err) throw err;
  			if(!user){
  				return done(null, false, {message: 'Unknown User'});
  			}

  			// If there is a match, continue to code below
  			User.comparePassword(password, user.password, function(err, isMatch){
  				if(err) throw err;
  				if(isMatch){
  					return done(null, user);
  				} else {
  					return done(null, false, {message: 'Invalid password'});
  				}
  			});
  		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

// Redirects for successful or failing authentication of post request to login
router.post('/login', 
	passport.authenticate('local', {successRedirect:'/', failureRedirect: '/users/login', failureFlash: true})
	);


// User Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
