function errorMessage(urlAddress, formID, errorDivID, action){
	$.ajax({     
		url: urlAddress,
		type:action,
		data:$(formID).serialize(),
		success:function(res){
			window.location = res.redirect;
			return false;
		},
		
		error:function(xhr, status, error){
			console.log(xhr.responseText);
			var err = '<div class="alert alert-danger">';
			$.each(JSON.parse(xhr.responseText) , function(i, item) {
				 err +='<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+item.msg;
				 err += '</br>'
			});
			err += '</div>'
			$(errorDivID).html(err);    
			return false;
		}
   });
}

function more_upload_button(){
	var more_upload = '<input type="file" name="music_sheet_file" size="40" class="form-control-static">';
	$("#more_music_sheet").append(more_upload);    
}

function findMusic(formID, errorDivID){
	urlAddress = '/musics/find';
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function userUpdateData(formID, errorDivID){
	urlAddress = '/user/update';
	errorMessage(urlAddress, formID, errorDivID, "put");
}

function loginUser(formID, errorDivID){
	urlAddress = '/login';
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function registerUser(formID, errorDivID){
	urlAddress = '/register';
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function uploadMusic(formID, errorDivID){
	urlAddress = '/upload';
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function updateMusic(formID, errorDivID, musicId){
	urlAddress = '/edit_music/' + musicId;
	errorMessage(urlAddress, formID, errorDivID, "put");
}

function likeMusic(musicID){
	urlAddress = '/like/' + musicID;

	$.ajax({     
		url: urlAddress,
		type:"put",
		success:function(res){
			window.location = res.redirect;
			return false;
		}
   });
}

function addInitiatorRep(userID){
	urlAddress = '/user/addInitiatorRep/' + userID;

	$.ajax({     
		url: urlAddress,
		type:"put",
		success:function(res){
			window.location = res.redirect;
			return false;
		}
   });
}

function deleteMusic(musicID){
	$.ajax({     
		url: '/delete_music/' + musicID,
		type:'DELETE',
		success:function(res){
			window.location = res.redirect;
			return false;
		}
   });
}







