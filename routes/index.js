var express = require('express');
var router = express.Router();
var Twit = require('twit');

var config = {
  consumer_key: '4tWZrkLv7MFzfAIrKNoNDgZkS',
  consumer_secret: 'xPFAjpN5BkQANgDYQQoohVuX6f90dyhrtDdIqAODOntJgDsV8A',
  access_token: '2166166477-gF1gDWvGpxDhokYO1F1SyiU3mAJgAVjltzW2CKQ',
  access_token_secret: 'HHTAPvLqbJMPSrIq29XLSX9gON65s2zF8c8v5soMqxydV'
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', {title: 'Hello World'});
});

router.get('/register', function(req, res) {
	res.render('pages/register');
});

router.post('/sendMessage', function(req, res) {
  var T = new Twit(config);
  T.post('direct_messages/events/new', {
    "event": {
      "type": "message_create",
      "message_create": {
        "target": {
          "recipient_id": req.body.recipientId
        },
        "sender_id": "2166166477", 
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
  		res.send(data);
  	}
  });
});

router.post('/getUser', function(req, res) {
  var T = new Twit(config);
  T.get('followers/list', {
  	user_id: '2166166477'
  }, function(err, data, response) {
  	if (err) {
  		console.log(err);
  		res.send(err);
  	}
  	else {
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
  var S = new Twit(config);
  var stream = S.stream('user');
  stream.on('follow', function(eventMsg) {
    if (eventMsg.source.id_str == req.body.id) {
      stream.stop();
      res.send('followed!');
    }
  });
});
module.exports = router;
