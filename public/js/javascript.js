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

function fundProject(formID, errorDivID, projectID, funderID, projectCommunity){
	urlAddress = '/project/fund/' + projectID + "-" + funderID + "-" + projectCommunity;
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function findProjects(formID, errorDivID){
	urlAddress = '/projects/find';
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function funderUpdateData(formID, errorDivID){
	urlAddress = '/funder/update';
	errorMessage(urlAddress, formID, errorDivID, "put");
}

function initiatorUpdateData(formID, errorDivID){
	urlAddress = '/initiator/update';
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

function createProject(formID, errorDivID){
	urlAddress = '/create_project';
	errorMessage(urlAddress, formID, errorDivID, "post");
}

function updateProject(formID, errorDivID, projectId){
	urlAddress = '/edit_project/' + projectId;
	errorMessage(urlAddress, formID, errorDivID, "put");
}

function likeProject(projectID){
	urlAddress = '/like/' + projectID;

	$.ajax({     
		url: urlAddress,
		type:"put",
		success:function(res){
			window.location = res.redirect;
			return false;
		}
   });
}

function addFunderRep(userID){
	urlAddress = '/user/addFunderRep/' + userID;

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

function deleteProject(projectID){
	$.ajax({     
		url: '/delete_project/' + projectID,
		type:'DELETE',
		success:function(res){
			window.location = res.redirect;
			return false;
		}
   });
}







