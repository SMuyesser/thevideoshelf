const passport = require('passport');
const passportLocal = require('passport-local');

passport.use(new passportLocal.Strategy({usernameField:"userName", passwordField:"password"}, function(userName, password, done){
	console.log(userName);
	console.log(password);
}))