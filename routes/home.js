var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('home', {notif: req.flash('notif'),
					auth: req.session.authenticated});		
});

module.exports = router;
