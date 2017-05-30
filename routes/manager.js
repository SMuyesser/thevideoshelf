const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('mongodb');


// Show user list for manager
router.get('/userlist', managerAuthenticated, function(req, res){
	mongoose.connection.db.collection('users', function (err, collection) {
		collection.find({}).toArray(function(err, data){
			res.send(data);
		});
	});
});

// Function to ensure only manager access
function managerAuthenticated(req, res, next){
	if(req.isAuthenticated() && req.user.manager){
		return next();
	} else {
		req.flash('error_msg', 'You must be logged in as manager to access this page.');
		res.redirect('/users/login');
	}
}

module.exports = router;