const express = require('express');
const get = require('request-promise-native');
const parser = require('body-parser');
const router = express.Router();

router.get("/info", function (request, response) {
	if(request.query.videoId) {
		get({
			url: 'http://vimeo.com/api/v2/video/' + request.query.videoId + '.json',
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