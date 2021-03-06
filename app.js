const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongo = require('mongodb');
const MongoStore = require('connect-mongo') (session);
const mongoose = require('mongoose');
const morgan = require('morgan');
const rp = require('request-promise');

const {DATABASE_URL, PORT} = require('./config');
const routes = require('./routes/index');
const users = require('./routes/users');
const manager = require('./routes/manager');
const vimeo = require('./routes/vimeo');

// Initialize App & use morgan
const app = express();
app.use(morgan('common'));

// View Engine
// tell system we want folder views to handle views
// set handlebars as app.engine and default layout file called layout so layout.handlebars
// set view engine to handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder public
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
	secret: 'random string',
	store: new MongoStore({
    url: DATABASE_URL,
    autoRemove: 'n'
  }),
  resave: true,
  saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  customValidators: {
    isVimeo:  function (checkVimUrl){
      var counter = 0;
      checkVimUrl.forEach(function(vimUrl){
        var vimArray = vimUrl.split('/');
        if(vimArray[2] == 'vimeo.com') {
          counter ++;
        }
        return counter;
      });
      if(checkVimUrl.length === counter) {
        return true;
      } else {
        return false;
      }
    } 
  }
}));

// Connect Flash
app.use(flash());

// Global Variables for flash messages
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
  // Access the user anywhere, if not it will just be null
  res.locals.user = req.user || null;
	next();
});

app.use('/', routes);
app.use('/manager', manager);
app.use('/users', users);
app.use('/vimeo', vimeo);

mongoose.Promise = global.Promise;

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so declare `server` here
// and then assign a value to it in run
let server;

// this function connects to the database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// Generic response if page not found
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// if app.js is called directly (aka, with `node app.js`), this block
// runs. but also export the runServer command so other code test code can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
