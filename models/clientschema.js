const mongoose = require('mongoose');

const User = require('./userschema');


const ClientSchema = mongoose.Schema({
	name: {
		type: String
	},
	logo: {
		type: String
	},
	videos: [
		{type: String}
	],
	// find the id of the the user who registered this client
	createdBy: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	}
});

const Client = module.exports = mongoose.model('Client', ClientSchema);

// Model Functions
// Create client
module.exports.createClient = function(client) {
		return client.save();
}

module.exports.getClientByName = function(name, callback){
	const query = {name: name};
	Client.findOne(query, callback);
}


