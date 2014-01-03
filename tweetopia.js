// Expects PORT, TWITTER_CONSUMER_KEY, and TWITTER_CONSUMER_SECRET
var config = require('./config.json');

var express = require("express");
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


//

app.get('/ws', function(request, response) {

	var options = JSON.parse(JSON.stringify(request.query));

	if (options.q == null) {
		options.q = '%23WebGL';
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


app.listen(config.PORT, function() {
	console.log("Listening on " + config.PORT);
});
