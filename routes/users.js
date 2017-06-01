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

// Render Register User
router.get('/register', function(req, res){
	res.render('register');
});

// Render User Login
router.get('/login', function(req, res){
	res.render('login');
});

// Render Clientlist
// find way to make sure only this user's clients
router.get('/clientlist', ensureAuthenticated, function(req, res){
	mongoose.connection.db.collection('clients', function (err, collection) {
		collection.find({}).toArray(function(err, data){
			res.send(data);
		});
	});
});

// Render Register New Client
router.get('/registerclient', ensureAuthenticated, function(req, res){
	res.render('registerclient');
});

// Render Manage Client Videos
router.get('/manageclient', ensureAuthenticated, function(req, res){
	res.render('manageclient');
});



// Function to ensure non users can't get into user functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg', 'You must be logged in to access this page.');

		res.redirect('/users/login');
	}
}

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
			req.flash('error_msg', 'An error occored');
			res.redirect('/users/register');	
		})

	}
});



// Register New Client
router.post('/registerclient', function(req, res) {
	const {name, logo, videos, createdBy} = req.body;

	// Validation
	req.checkBody('name', 'Client name is required').notEmpty();
	/*req.checkBody('clientLogo', 'Client logo must be an image').isImage();*/

	const errors = req.validationErrors();

	// If there are errors, render the form with errors, otherwise create new client with success msg
	if(errors){
		res.render('registerclient', {
			errors: errors
		});
	} else {
		const newClient = new Client({name, logo, videos, createdBy});

		// Creates mongoose new client, then success message and redirect to login
		console.log(newClient);
		Client.createClient(newClient)
		.then(function(client){
			req.flash('success_msg', 'Your client has been registered');
			res.redirect('/users/clientlist');
		})
		.catch(function(err) {
			console.error(err);
			req.flash('error_msg', 'An error occored');
			res.redirect('/users/registerclient');	
		})
	}
});


// For logging in gets username, matches what you put in, finds what you put in, validates password
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


// Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
