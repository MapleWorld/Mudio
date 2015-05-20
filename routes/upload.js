var express 			= require('express');
var multer     			= require('multer');
var router 				= express.Router();
var upload_done  		= false;
var app 				= express();
// Include external javascript functions 
var tools 				= require('../public/js/tools');
 
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


var audio_file_name = 0;
var music_sheet_file_name = 0;
var upload_completed = false;

/*Configure the multer.*/
router.use(multer({ dest: './uploaded/',
	rename: function (fieldname, filename) {
		if (fieldname === "music_audio_file"){
			audio_file_name += 1;
			return audio_file_name;
		}else{
			music_sheet_file_name += 1;
			return music_sheet_file_name;
		}
  	},
	onFileUploadStart: function (file) {
  		console.log(file.originalname + ' is uploading ...');
	},
	onFileUploadComplete: function (file) {
  		console.log(file.fieldname + ' uploaded to  ' + file.path);
		upload_completed = true;
	}
}));


//post data to DB | POST
router.post('/upload', function (req, res) {

	if(upload_completed == true){
		console.log("Files uploaded successfully");
		upload_completed = false;
	}
	//res.send({redirect: 'upload'});

	// Validation
	/*
	req.assert('music_name', 'Music name is required').notEmpty();
	req.assert('music_description','Music Description is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.status(422).json(errors);
		return;
	}
	
	// Get data
	var data = {
		name			: req.body.music_name,
		description	: req.body.music_description,
		audio			: req.body.music_audio,
		sheets			: req.body.music_sheets,
		instrument		: req.body.music_instrument,
		created_date 	: tools.currentTime()[0],
		comparable_date	: tools.currentTime()[1]
	};

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
	*/
});

module.exports = router;