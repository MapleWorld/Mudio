var express = require('express');
var router = express.Router();
/*require the ibm_db module*/
var ibmdb = require('ibm_db');
// Include external javascript functions 
var tools = require('../public/js/tools');

router.get('/register', function (req, res) {
	if(req.session.authenticated) {
        req.flash('notif', 'You are already logged in.');
    	res.redirect('/');
    	return ;
    }
    
	res.render('register', {notif: req.flash('notif'),
					 auth: req.session.authenticated});	
});

//post data to DB | POST
router.post('/register', function (req, res) {

	// Validation
	req.assert('user_name', 'User Name is required').notEmpty();
	req.assert('email','A valid email is required').isEmail();
	req.assert('password','Enter a password 6 - 20').len(6,20);

	var errors = req.validationErrors();

	if (errors) {
		res.status(422).json(errors);
		return;
	}

	/* EMAIL AND USERNAME MUST BE UNIQUE */
	// Get data
	var data = {
		username : req.body.user_name,
		password : req.body.password,
		email : req.body.email,
		created_date : tools.currentTime()[0],
		comparable_date: tools.currentTime()[1]
	};

	console.log("Test program to access DB2 sample database");
	
	/*Connect to the database server
	  param 1: The DSN string which has the details of database name to connect to, user id, password, hostname, portnumber 
	  param 2: The Callback function to execute when connection attempt to the specified database is completed
	*/
	ibmdb.open("DRIVER={DB2};DATABASE=SAMPLE;UID=Maple;PWD=Lonely110;HOSTNAME=localhost;port=50000", function(err, conn){
        if(err) {
          	console.error("error: ", err.message);
        } else {

			//conn.query("INSERT INTO TESTING (name) values('" + data.username + "')", function(err, rows) {
			//conn.query("INSERT INTO user SET ? ", data, function (err, rows) {
			//"INSERT INTO user SET ? ", data
			conn.query("INSERT INTO TESTING (name) values('" + data.username + "')", function(err, rows) {
	
				if (err) {			
					console.log("error sucker");
					var register_error = {
						msg: err.code
					};
					res.status(422).json([register_error]);
					return ;
				}
				
				conn.close(function(){
					console.log("Connection Closed");
				});
				
				req.flash('notif', 'You have successfully created an account');
				res.send({redirect: '/'});
			});
		}
	});
});

module.exports = router;
