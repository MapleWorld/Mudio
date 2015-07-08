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

			var data = rows[0];
			var audio_paths = [];
		    var sheet_paths = [];
		    var audios = data.audio.split(",");
		    var sheets = data.sheets.split(",");

		    for (var i = 1; i < audios.length; i++){
		    	audio_paths.push('./' + audios[i - 1]);
		    };
		    
		    for (var i = 1; i < sheets.length; i++){
		    	sheet_paths.push('./' + sheets[i - 1]);
		    };

		    var stat = fs.statSync(audio_paths[0]);
		    res.writeHead(200, {
		        'Content-Type': 'audio/mp3',
		        'Content-Length': stat.size
		    });

		    console.log(audio_paths);
		    console.log(sheet_paths);
			var readStream = fs.createReadStream(audio_paths[0]).pipe(res);
		
		    /*
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
			*/
		});
	});
});



module.exports = router;
