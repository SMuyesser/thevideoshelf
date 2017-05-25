const express = require('express');
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
router.get('/api/clients', function(req, res) {
	Client.getClients(function(err, clients) {
		if(err) {
			throw err;
		}
		res.json(clients);
	});
});

// Get Client by Id
router.get('/api/clients/:_id', function(req, res) {
	Client.getClientsById(req.params._id, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Add new Client
router.post('/api/clients', function(req, res) {
	const client = req.body;
	Client.addClient(client, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Update a Client
router.put('/api/clients/:_id', function(req, res) {
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
router.delete('/api/clients/:_id', function(req, res) {
	const id = req.params._id;
	Client.removeClient(id, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
 	});
});

module.exports = router;