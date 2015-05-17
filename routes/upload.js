var express = require('express');
var router = express.Router();
// Include external javascript functions 
var tools = require('../public/js/tools');

router.get('/upload', function(req, res) {

	if (req.session.authenticated){
		res.render('upload', {notif: req.flash('notif'),
			auth: req.session.authenticated,
			data:rows,
			admin: req.session.data.admin});	
	}else{
		res.render('upload', {notif: req.flash('notif'),
			auth: req.session.authenticated});	
	}
});


//post data to DB | POST
router.post('/upload', function (req, res) {

	// Validation
	req.assert('music_name', 'Music name is required').notEmpty();
	req.assert('music_description','Music Description is required').isEmail();

	var errors = req.validationErrors();

	if (errors) {
		res.status(422).json(errors);
		return;
	}

	/* EMAIL AND USERNAME MUST BE UNIQUE */
	// Get data
	var data = {
		name			: req.body.music_name,
		drescription	: req.body.music_descrition,
		audio			: req.body.music_audio,
		sheets			: req.body.music_sheets,
		instrument		: req.body.music_instrument,
		created_date 	: tools.currentTime()[0],
		comparable_date	: tools.currentTime()[1]
	};

	// Inserting into MySQL
	req.getConnection(function (err, conn) {

		if (err){
			console.log(err);
			return next("Cannot Connect");
		}

		var query = conn.query("INSERT INTO music SET ? ", data, function (err, rows) {

			if (err) {
			
				var upload_error = {
					msg: err.code
				};
	
				res.status(422).json([upload_error]);
				return ;
			}
			
			req.flash('notif', 'You have successfully uploaded the music');
			res.send({redirect: '/'});
		});

	});

});

module.exports = router;