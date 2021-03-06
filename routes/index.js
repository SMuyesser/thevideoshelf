const express = require('express');
const router = express.Router();

const Client = require('../models/clientschema');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

// Function to ensure non users can't get into user functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
