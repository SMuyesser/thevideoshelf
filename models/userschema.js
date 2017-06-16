const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	manager: {
		type: Boolean,
		default: false
	}
});


// Model Functions
UserSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10)
      .then((salt) => bcrypt.hash(user.password, salt))
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(user) {
	return bcrypt.genSalt(10)
	.then(function(salt){
		return bcrypt.hash(user.password, salt)
	})
	.then(function(hash){
		user.password = hash;
		user.save();
	})
	.catch(function(err){console.error(err); throw err;})
}

// Gets username using mongoose method findone
module.exports.getUserByUsername = function(username){
	const query = {username: username};
	return User.findOne(query)
}

// checks to see if password is match
module.exports.comparePassword = function(candidatePassword, hash){
	return bcrypt.compare(candidatePassword, hash) 
}

