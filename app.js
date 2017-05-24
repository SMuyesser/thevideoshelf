const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config.js');

const Client = require('./models/clientmodel');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
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

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
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

// Connect to Mongoose
/*mongoose.connect(DATABASE_URL);
var db = mongoose.connection;*/

//Routes will be moved later to folder
app.get('/', function(req, res) {
	res.send('Please use /api/clients');
});

// Get Clients
app.get('/api/clients', function(req, res) {
	Client.getClients(function(err, clients) {
		if(err) {
			throw err;
		}
		res.json(clients);
	});
});

// Get Client by Id
app.get('/api/clients/:_id', function(req, res) {
	Client.getClientsById(req.params._id, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Add new Client
app.post('/api/clients', function(req, res) {
	const client = req.body;
	Client.addClient(client, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
	});
});

// Update a Client
app.put('/api/clients/:_id', function(req, res) {
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
app.delete('/api/clients/:_id', function(req, res) {
	const id = req.params._id;
	Client.removeClient(id, function(err, client) {
		if(err) {
			throw err;
		}
		res.json(client);
 	});
});

/*app.listen(3000);
console.log('Running on port 3000...');*/

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
