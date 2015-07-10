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
router.use(multer({ 
	dest: './uploaded/',
	changeDest: function(dest, req, res) {
		var stat = null;
		var new_path = dest + req.session.data.id;
		try {
			// using fs.statSync; NOTE that fs.existsSync is now deprecated; fs.accessSync could be used but is only nodejs >= v0.12.0
		  	stat = fs.statSync(new_path);
		} catch(err) {
		  	// for nested folders, look at npm package "mkdirp"
		  	fs.mkdirSync(new_path);
		}
		if (stat && !stat.isDirectory()) {
		  	// Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
		  	throw new Error('Directory cannot be created because an inode of a different type exists at "' + new_path + '"');
		}
		return new_path
	},
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
	} else {
		res.render('login', {notif: req.flash('notif'),
			auth: req.session.authenticated});	
	}
});

//post data to DB | POST
router.post('/upload', function (req, res) {

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

		for (var i = 0; i < file_data_JSON.length; i++){
			if (file_data_JSON[i].fieldname === "music_audio_files"){
				audio_files.push(file_data_JSON[i].path);
				audio_files_string += file_data_JSON[i].path + ",";
			}else {
				sheet_files.push(file_data_JSON[i].path);
				sheet_files_string += file_data_JSON[i].path + ",";
			}
		};

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

		console.log(music_data);
		
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
				console.log("Files uploaded successfully");
				req.flash('notif', 'You have successfully uploaded the music');
				res.render('profile', {notif: req.flash('notif'),
						auth: req.session.authenticated});	
			});
		});
	}
});

module.exports = router;