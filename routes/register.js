var express = require('express');
var router = express.Router();
// Include external javascript functions 
var tools = require('../public/js/tools');

router.get('/register', function (req, res) {
	if(req.session.authenticated) {
        req.flash('notif', 'You are already logged in.');
    	res.redirect('/');
    	return ;
    }
    
	res.render('register', {notif: req.flash('notif'),
					 auth: req.session.authenticated});	
});

//post data to DB | POST
router.post('/register', function (req, res) {

	// Validation
	req.assert('user_name', 'User Name is required').notEmpty();
	req.assert('email','A valid email is required').isEmail();
	req.assert('password','Enter a password 6 - 20').len(6,20);

	var errors = req.validationErrors();

	if (errors) {
		res.status(422).json(errors);
		return;
	}

	/* EMAIL AND USERNAME MUST BE UNIQUE */
	// Get data
	var data = {
		username : req.body.user_name,
		password : req.body.password,
		email : req.body.email,
		created_date : tools.currentTime()[0],
		comparable_date: tools.currentTime()[1]
	};

	// Inserting into MySQL
	req.getConnection(function (err, conn) {

		if (err){
			console.log(err);
			return next("Cannot Connect");
		}

		var query = conn.query("INSERT INTO user SET ? ", data, function (err, rows) {

			if (err) {
			
				var register_error = {
					msg: err.code
				};
	
				res.status(422).json([register_error]);
				return ;
			}
			
			req.flash('notif', 'You have successfully created an account');
			res.send({redirect: '/'});
		});

	});

});

module.exports = router;
