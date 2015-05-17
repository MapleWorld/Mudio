var express = require('express');
var router = express.Router();

router.get('/about', function(req, res) {
	res.render('about', {notif: req.flash('notif'),
					 auth: req.session.authenticated});		
});

module.exports = router;
