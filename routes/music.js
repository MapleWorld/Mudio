var express 	= require('express');
var router 		= express.Router();
var fs 			= require("fs");

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

		var query = conn.query("SELECT * FROM music WHERE music.id = ? ",[music_id], function(err,rows){

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

router.get('/audio/:audio_path', function(req, res) {
	console.log("Audio Path Test", req.params.audio_path);
	var path = req.params.audio_path.replace("~", "/");
	var stat = fs.statSync(path);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });
	var readStream = fs.createReadStream(path).pipe(res);
});

module.exports = router;
