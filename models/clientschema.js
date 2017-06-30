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
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	}
});

ClientSchema.methods.vimeoIds = function() {
	return this.videos.map(getVimeoId)
}

const Client = module.exports = mongoose.model('Client', ClientSchema);

// Model Functions
const getVimeoId = (vimeoURL) => {
  const splitArr = vimeoURL.split("/");
  return splitArr[3]
}
