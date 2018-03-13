var express = require('express');
var router = express.Router();
var Twit = require('twit');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', {title: 'Hello World'});
});

router.get('/register', function(req, res) {
	res.render('pages/register');
});

router.post('/sendMessage', function(req, res) {
  console.log('run send Message');
  var consumerKey = 'YFJ3RWmtqhxP8Qxyxf1LJ5pRv';
  var consumerSecret = 'UfxhG4bZ4UrbFpTn60jOFnf8tqsltcDutpjbTE5rO0fvvaPby9';
  var token = req.body.token;
  var tokenSecret = req.body.tokenSecret;
  var T = new Twit({
  	consumer_key: consumerKey,
  	consumer_secret: consumerSecret,
  	access_token: token,
  	access_token_secret: tokenSecret
  });

  T.post('direct_messages/events/new', {
    "event": {
      "type": "message_create",
      "message_create": {
        "target": {
          "recipient_id": req.body.recipientId
        },
        "message_data": {
          "text": req.body.text
        }
      }
    }
  }, function(err, data, response) {
  	if (err) {
  		console.log(err);
  		res.send(err);
  	}
  	else {
  		console.log(data);
  		res.send(data);
  	}
  });
});

router.post('/getUser', function(req, res) {
  var consumerKey = 'YFJ3RWmtqhxP8Qxyxf1LJ5pRv';
  var consumerSecret = 'UfxhG4bZ4UrbFpTn60jOFnf8tqsltcDutpjbTE5rO0fvvaPby9';
  var token = req.body.token;
  var tokenSecret = req.body.tokenSecret;
  var T = new Twit({
  	consumer_key: consumerKey,
  	consumer_secret: consumerSecret,
  	access_token: token,
  	access_token_secret: tokenSecret
  });

  T.get('followers/list', {
  	user_id: '970541014116065280'
  }, function(err, data, response) {
  	if (err) {
  		console.log(err);
  		res.send(err);
  	}
  	else {
  		console.log(data.users);
  		var isFollowing = false;
  		for (var u = 0; u < data.users.length; u++) {
  			console.log(data.users[u].id_str);
  			if (data.users[u].id_str == req.body.id) {
  				isFollowing = true;
  			}
  		}

  		if (isFollowing) {
  			console.log('following');
  			res.send('following');
  		}
  		else {
  			console.log('not following');
        res.send('not following');
  		}
  	}
  });
});

router.post('/listenFollow', function(req, res) {
  var S = new Twit({
    consumer_key: 'YFJ3RWmtqhxP8Qxyxf1LJ5pRv',
    consumer_secret: 'UfxhG4bZ4UrbFpTn60jOFnf8tqsltcDutpjbTE5rO0fvvaPby9',
    access_token: '970541014116065280-jKaobSgJdkVw8K68gQ7am66Gwf22jPN',
    access_token_secret: '8N1xV4eTqVcXGz2mvpnXyeF8AE3S59ww2epV3QzTF1Sv3'
  });

  var stream = S.stream('user');

  stream.on('follow', function(eventMsg) {
    if (eventMsg.source.id_str == req.body.id) {
      stream.stop();
      res.send('followed!');
    }
  });
});
module.exports = router;
