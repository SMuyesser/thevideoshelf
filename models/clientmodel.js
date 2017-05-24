const mongoose = require('mongoose');

// ClientInfo Schema
const clientSchema = mongoose.Schema({
	name: {type: String},
	email: {type: String},
	password: {type: String},
	facebook: {type: String},
	instagram: {type: String},
	twitter: {type: String},
	logo: {type: String},
	videos: {type: String}
});

const Client = module.exports = mongoose.model('Client', clientSchema);

// Get Clients
module.exports.getClients = function(callback, limit) {
	Client.find(callback).limit(limit);
}

// Get Client by id
module.exports.getClientsById = function(id, callback) {
	Client.findById(id, callback);
}

// Add Client
module.exports.addClient = function(client, callback) {
	Client.create(client, callback);
}

// Update Client
module.exports.updateClient = function(id, client, options, callback) {
	const query = {_id: id};
	const update = {
		name: client.name,
		email: client.email,
		password: client.password
	}
	Client.findOneAndUpdate(query, update, options, callback);
}

// Delete Client
module.exports.removeClient = function(id, callback) {
	const query = {_id: id};
	Client.remove(query, callback);
}