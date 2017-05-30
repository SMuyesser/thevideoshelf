const mongoose = require('mongoose');

const UserSchema = require('./userschema');


const ClientSchema = mongoose.Schema({
	clientUserName: {
		type: String,
		index: true
	},
	clientPassword: {
		type: String
	},
	clientEmail: {
		type: String
	},
	clientName: {
		type: String
	},
	clientVideos: {
		type: String
	},
	// find the id of the the user
	createdBy: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	createdDate: {
		type: Date
	}
});

const Client = module.exports = mongoose.model('Client', ClientSchema);

// Model Functions

// Creates new client and encrypts password
module.exports.createClient = function(newClient, callback){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newClient.clientPassword, salt, function(err, hash) {
			newClient.password = hash;
			newClient.save(callback);
		});
	});
}

// Gets username using mongoose method findone
module.exports.getClientByClientUserName = function(clientUserName, callback){
	const query = {clientUsername: clientUserName};
	Client.findOne(query, callback);
}


module.exports.getClientById = function(id, callback){
	Client.findById(id, callback);
}

// checks to see if password is match
module.exports.compareClientPassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null, isMatch);
	});
}

