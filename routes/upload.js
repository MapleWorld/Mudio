var express 			= require('express');
var multer     			= require('multer');
var router 				= express.Router();
var upload_done  		= false;
// Include external javascript functions 
var tools 				= require('../public/js/tools');
 
var audio_file_name = 0;
var music_sheet_file_name = 0;
var upload_completed = false;

/*Configure the multer.*/
router.use(multer({ dest: './uploaded/',
	rename: function (fieldname, filename) {
		if (fieldname === "music_audio_files"){
			audio_file_name += 1;
			return audio_file_name;
		} else{
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
	/*
	req.assert('music_name', 'Music name is required').notEmpty();
	req.assert('music_description','Music Description is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.status(422).json(errors);
		return;
	}
	*/
	
	if(upload_completed == true){
		console.log("Files uploaded successfully");
		upload_completed = false;
	}

	var file_data_JSON = [];
	var fileKeys = Object.keys(req.files);
	var audio_size = 1;
	var sheet_size = 1;
	
	fileKeys.forEach(function(key) {
		if (req.files[key].length){
			if (key === "music_audio_files"){
				audio_size = req.files[key].length;
			} else{
				sheet_size = req.files[key].length;
			}
			for (var i = 0; i < req.files[key].length; i++){
				file_data_JSON.push(req.files[key][i]);
			}
		} else{
			file_data_JSON.push(req.files[key]);
		}
	});

	music_data = {
		owner			: 1,
		name			: req.body.music_name,
		description		: req.body.music_description,
		audio			: file_data_JSON.slice(0,audio_size),
		sheets			: file_data_JSON.slice(audio_size, audio_size + sheet_size),
		instrument		: req.body.music_instrument,
		created_date 	: tools.currentTime()[0],
		comparable_date	: tools.currentTime()[1]
	};

	console.log(music_data);
	/*
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