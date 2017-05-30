const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const db = require('mongodb').Db;
const passport = require('passport');
const ClientStrategy = require('passport-local').Strategy;

const Client = require('../models/clientschema');
const DATABASE_URL = require('../config');

// Render client login page
router.get('/login', function(req, res){
	res.render('clientlogin');
});

// Render Requests
router.get('/requests', function(req, res){
	res.render('requests');
});

// Render ClientVideos
router.get('/clientvideos', function(req, res){
	res.render('clientvideos');
});

// Function to ensure non clients can't get into client functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg', 'You must be logged in to access this page.');

		res.redirect('/clients/login');
	}
}

// Register New Client
router.post('/clients/register', function(req, res) {
	const {clientUserName, clientPassword, clientEmail, clientName, 
	       clientVideos, createdBy, createdDate} = req.body;

	// Validation
	req.checkBody('clientUserName', 'Username is required').notEmpty();
	req.checkBody('clientEmail', 'Email is required').notEmpty();
	req.checkBody('clientEmail', 'Email is not valid').isEmail();
	req.checkBody('clientName', 'Name is required').notEmpty();
	req.checkBody('clientPassword', 'Password is required').notEmpty();
	req.checkBody('clientPassword2', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	// If there are errors, render the form with errors, otherwise create new client with success msg, and redirect to login page
	if(errors){
		res.render('clientsregister', {
			errors: errors
		});
	} else {
		const newClient = new Client({clientName, clientEmail, clientUserName, clientPassword, clientVideos, createdBy, createdDate});

		// Creates mongoose new client, then success message and redirect to login
		Client.createClient(newClient, function(err, client){
			if(err) throw err;
			console.log(client);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/clients/login');
	}
});

// For logging in gets clientUsername, matches what you put in, finds what you put in, validates password
passport.use(new ClientStrategy(
  	function(clientUserName, clientPassword, done) {
  		// Check if there is a client username match
  		Client.getClientByClientUserName(clientUserName, function(err, client){
  			if(err) throw err;
  			if(!client){
  				return done(null, false, {message: 'Unknown Client User'});
  			}

  			// If there is a match, continue to code below
  			Client.compareClientPassword(clientPassword, client.clientPassword, function(err, isMatch){
  				if(err) throw err;
  				if(isMatch){
  					return done(null, client);
  				} else {
  					return done(null, false, {message: 'Invalid password'});
  				}
  			});
  		});
	}
));

passport.serializeUser(function(client, done) {
	done(null, client.id);
});

passport.deserializeUser(function(id, done) {
	Client.getClientById(id, function(err, client) {
		done(err, client);
	});
});

// Redirects for successful or failing authentication of post request to login
router.post('/login', 
	passport.authenticate('local', {successRedirect:'/', failureRedirect: '/clients/login', failureFlash: true})
	);


// Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/clients/login');
});

module.exports = router;
