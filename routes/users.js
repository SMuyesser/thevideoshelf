const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userschema');

// Render Register
router.get('/register', function(req, res){
	res.render('register');
});

// Render Login
router.get('/login', function(req, res){
	res.render('login');
});

// Render Requests
router.get('/requests', ensureAuthenticated, function(req, res){
	res.render('requests');
});

// Render Users
router.get('/userlist', ensureAuthenticated, function(req, res){
	res.render('userlist');
});

// Function to ensure non users can't get into user functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

// Register New User
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

	// If there are errors, render the form with errors, otherwise create new user with success msg, and go to login page
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

		// Creates mongoose new user, then success message and redirect to login
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

// For logging in gets username, matches what you put in, finds what you put in, validates password
passport.use(new LocalStrategy(
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
	passport.authenticate('local', {successRedirect:'/', failureRedirect: '/users/login', failureFlash: true}),
	function(req, res) {
		res.redirect('/');
	});

// Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
