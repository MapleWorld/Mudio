var express = require('express');
var router = express.Router();

router.get('/music', function (req, res) {
	
	res.render('music', {notif: req.flash('notif'),
							auth: req.session.authenticated});
});


// Get specific project data
router.get('/music/:music_id', function(req, res, next) {

	var music_id = req.params.music_id;
	req.getConnection(function(err,conn){
		if (err){
			console.log(err);
			return next("Cannot Connect");
		}

		var query = conn.query("SELECT * FROM music WHERE music.p_id = ? ",[music_id], function(err,rows){

			if(err){
				console.log(err);
				return next("Mysql error, check your query");
			}

			//if user not found
			if(rows.length < 1){
				return res.send("Music Not found");
			}

			if (req.session.authenticated){
				res.render('music', {notif: req.flash('notif'),
						 auth: req.session.authenticated,
						 data:rows,
						 user_id: req.session.data.id,
						 admin: req.session.data.admin});	
			}else{
				res.render('music', {notif: req.flash('notif'),
						 auth: req.session.authenticated,
						 data:rows});	
			}
		});
	});
});

module.exports = router;
