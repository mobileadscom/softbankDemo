var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', {title: 'Hello World'});
});

router.get('/register', function(req, res) {
	res.render('pages/register');
})

module.exports = router;
