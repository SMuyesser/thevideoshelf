const express = require('express');
const router = express.Router();

const Client = require('../models/clientschema');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

// Render Client Search
router.get('/searchclient', function(req, res){
	Client.find()
	.then(function(clients){
		res.render('searchclient', {clients});
	})
});

// Get Client by id
router.get('/searchclient/:_id', function(req, res) {
	Client.getClientById(req.params._id, function (err, data) {
			res.render('clientpage', data);
	});
});


// Function to ensure non users can't get into user functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/searchclient');
	}
}

module.exports = router;
