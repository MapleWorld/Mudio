var express = require('express');
var router = express.Router();

// Get specific user data
router.get('/user/:user_id', function(req, res, next) {

	if (req.session.authenticated){

		var user_id = req.params.user_id;
		req.getConnection(function(err,conn){
			if (err){
				console.log(err);
				return next("Cannot Connect");
			}
	
			var query = conn.query("SELECT * FROM user LEFT JOIN funding ON user.id = funding.funder_id WHERE id = ? ",[user_id], function(err,rows){

				if(err){
					console.log(err);
					return next("Mysql error, check your query");
				}
	
				//if user not found
				if(rows.length < 1){
					return res.send("user Not found");
				}
	
				res.render('user', {notif: req.flash('notif'),
						 auth: req.session.authenticated,
						 data:rows,
						 user_id: req.session.data.id,
						 admin: req.session.data.admin});	
			});
		});
	}else{
		req.flash('notif', 'You are not login.');
		res.render('login', {notif: req.flash('notif'),
		 				auth: req.session.authenticated});	
	}
});

// Get all user data
router.get('/users', function(req, res, next) {

	if (req.session.authenticated){

		req.getConnection(function(err,conn){
			if (err){
				console.log(err);
				return next("Cannot Connect");
			}
	
			var query = conn.query("SELECT * FROM user", function(err,rows){
	
				if(err){
					console.log(err);
					return next("Mysql error, check your query");
				}
	
				//if user not found
				if(rows.length < 1){
					return res.send("user Not found");
				}
				res.render('users', {notif: req.flash('notif'),
						 auth: req.session.authenticated,
						 data:rows,
						 user_id: req.session.data.id,
						 admin: req.session.data.admin});	
			});
		});
	}else{
		req.flash('notif', 'You are not login.');
		res.render('login', {notif: req.flash('notif'),
						 auth: req.session.authenticated});	
	}
});


// Update the number of reputation for this initiator 
router.put('/user/addInitiatorRep/:user_id', function (req, res) {

	// Increment like by 1 for this project
    var user_id = req.params.user_id;
    
    if (req.session.authenticated){
	    req.getConnection(function (err, conn) {
		
		    if (err) return next("Cannot Connect");
		
			var query = conn.query("SELECT * FROM user WHERE id = ? ",[user_id], function(err,rows){
				if(err){
					console.log(err);
					return next("Mysql error, check your query");
				}
			
				var data = rows[0];
				data.initiator_reputation += 1;
				
				var updateQuery = conn.query("UPDATE user set ? WHERE id = ? ",[data,user_id], function(err, rows){
					if(err){
						console.log(err);
						return next("Mysql error, check your query");
					}
				
					req.flash('notif', 'You liked this user.');
					res.send({redirect: '/'});
				
				});
			});
		});	
	}else{
		req.flash('notif', 'You are not login.');
		res.render('login', {notif: req.flash('notif'),
						 auth: req.session.authenticated});				
	}
});


// Update the number of reputation for this funder
router.put('/user/addFunderRep/:user_id', function (req, res) {

	// Increment like by 1 for this project
    var user_id = req.params.user_id;
    
    if (req.session.authenticated){
	    req.getConnection(function (err, conn) {
		
		    if (err) return next("Cannot Connect");
		
			var query = conn.query("SELECT * FROM user WHERE id = ? ",[user_id], function(err,rows){
				if(err){
					console.log(err);
					return next("Mysql error, check your query");
				}
			
				var data = rows[0];
				data.funder_reputation += 1;
				
				var updateQuery = conn.query("UPDATE user set ? WHERE id = ? ",[data,user_id], function(err, rows){
					if(err){
						console.log(err);
						return next("Mysql error, check your query");
					}
				
					req.flash('notif', 'You liked this user.');
					res.send({redirect: '/'});
				
				});
			});
		});	
	}else{
		req.flash('notif', 'You are not login.');
		res.render('login', {notif: req.flash('notif'),
						 auth: req.session.authenticated});				
	}
});

module.exports = router;
