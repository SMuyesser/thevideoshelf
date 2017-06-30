const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const get = require('request-promise-native');
const router = express.Router();


const app = express();

const Client = require('../models/clientschema');


app.use(morgan('common'));
app.use(cors());

app.get("/info", function (request, response) {
	if(request.query.vimeoIds) {
		get({
			url: 'https://vimeo.com/223704636',
			q: {id: request.query.vimeoIds},
			json: true
		})
		.then((vimeoInfo) => {
			response.json(vimeoInfo);
		});
	} else {
		response.sendStatus(400);
	}
});

module.exports = router;