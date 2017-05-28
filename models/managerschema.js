const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');

const ManagerSchema = mongoose.Schema({
	mngrUsername: {
		type: String,
		index: true
	},
	mngrPassword: {
		type: String
	},
	mngrEmail: {
		type: String
	},
	mngrName: {
		type: String
	}
});

const Manager = module.exports = mongoose.model('Manager', ManagerSchema);
