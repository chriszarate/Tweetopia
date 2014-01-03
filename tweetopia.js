// Expects PORT, TWITTER_CONSUMER_KEY, and TWITTER_CONSUMER_SECRET
var config = require('./config.json');

var http = require('http');
var express = require('express');
var app = express();
app.use(express.logger());
app.use(express.static(__dirname + '/public'));


// Twitter

var Twitter = require('mtwitter');
var twitter = new Twitter({
	consumer_key: config.TWITTER_CONSUMER_KEY,
	consumer_secret: config.TWITTER_CONSUMER_SECRET,
	application_only: true
});


// Twitter API liaison

app.get('/ws', function(request, response) {

	var options = JSON.parse(JSON.stringify(request.query));

	if (options.q === null || options.q === '') {
		options.q = config.SEARCH_TERMS || '%23WebGL';
	}

	options.callback = null;

	twitter.get(
		'search/tweets',
		options,
		function(err, item) {

			if (item != null) {

				 var json = JSON.stringify(item);
				// response.writeHead(200, {'content-type':'application/json'});
				response.jsonp(item);
			}
		}
	);

});


// Dumb profile image proxy

app.get('/profile_images/*', function(request_from_client, response_to_client) {

  var image_url = request_from_client.params[0].split('/');

	var options = {
	  hostname: image_url[2],
	  port: 80,
	  path: '/' + image_url.slice(3).join('/').replace('_bigger', '').replace('_normal', ''),
	  method: 'GET'
	};

	var callback = function(response) {

		var chunks = [];
		response.on('data', function (chunk) {
			chunks.push(chunk);
		});

		response.on('end', function () {
			response_to_client.writeHead(response.statusCode, response.headers);
			response_to_client.end(Buffer.concat(chunks));
		});
	};

	http.request(options, callback).end();

});


// Start listening.

app.listen(config.PORT, function() {
	console.log("Listening on " + config.PORT);
});
