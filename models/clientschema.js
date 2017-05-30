const mongoose = require('mongoose');

const User = require('/userschema');


const ClientSchema = mongoose.Schema({
	clientName: {
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
	clientVideos {
		type: String
	},
	// find the id of the the user
	createdBy {
		type: {mongoose.Schema.Types.ObjectId, ref: 'User'}
	},
	createdDate: {
		type: Date
	}
});

const Client = module.exports = mongoose.model('Client', ClientSchema);

