var express 			= require('express');
var multer     			= require('multer');
var fs 					= require('fs');
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
			admin: req.session.data.admin});	
	}else{
		res.render('login', {notif: req.flash('notif'),
			auth: req.session.authenticated});	
	}
});

//post data to DB | POST
router.post('/upload', function (req, res) {

	// Validation	
	req.assert('music_name', 'Music name is required').notEmpty();
	req.assert('music_description','Music Description is required').notEmpty();
	var errors = req.validationErrors();

	if (errors) {
		res.status(422).json(errors);
		return;
	}
	
	if (upload_completed == true){
		upload_completed = false;
	
		var fileKeys = Object.keys(req.files);
		var file_data_JSON = [];
		var audio_files = [];
		var sheet_files = [];
		var audio_files_string = "";
		var sheet_files_string = "";
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
		

		var audio_files_JSON = file_data_JSON.slice(0,audio_size);
		console.log("Audio File JSON", audio_files_JSON);
		for (var i = 0; i < audio_size; i++){
			audio_files.push(audio_files_JSON[i].path);
			audio_files_string += audio_files_JSON[i].path + ",";
		};
		
		var sheet_files_JSON = file_data_JSON.slice(audio_size, audio_size + sheet_size);
		console.log("Sheet File JSON", audio_files_JSON);
		for (var i = 0; i < sheet_size; i++){
			sheet_files.push(sheet_files_JSON[i].path);
			sheet_files_string += sheet_files_JSON[i].path + ",";
		};

		console.log("Files uploaded successfully");
		
		music_data = {
			owner			: req.session.data.id,
			name			: req.body.music_name,
			description		: req.body.music_description,
			audio			: audio_files_string,
			sheets			: sheet_files_string,
			instrument		: req.body.music_instrument,
			created_date 	: tools.currentTime()[0],
			comparable_date	: tools.currentTime()[1]
		};

		req.getConnection(function (err, conn) {

			if (err){
				console.log(err);
				res.status(422).json([{msg:err.code}]);
				return ;
			}

			var query = conn.query("INSERT INTO music SET ? ", music_data, function (err, rows) {
				if (err) {
					console.log("Error", err);
					for (var i = 0; i < audio_files.length; i++){
						fs.unlink(audio_files[i]);
						fs.unlink(sheet_files[i]);
					}
					res.status(422).json([{msg:err.code}]);
					return ;
				}
				req.flash('notif', 'You have successfully uploaded the music');
				res.render('profile', {notif: req.flash('notif'),
						auth: req.session.authenticated});	
			});
		});
	}
});

module.exports = router;