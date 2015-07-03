var express = require('express');
var router = express.Router();
	
router.get('/profile', function(req, res) {
		
	if(req.session.authenticated) {

		var error_msg = {
			msg: "Error"
		};
	
		// Check with data in MySQL
		req.getConnection(function (err, conn) {
			if (err){
				console.log(err);
				return next("Cannot Connect");
			}
			
			var sql = 'SELECT * FROM music WHERE owner  =' + 
						conn.escape(req.session.data.id);
						
			conn.query(sql, function(err, rows) {
				if (err) {
					console.log(err);
				}
				
				res.render('profile', {notif: req.flash('notif'),
					 auth: req.session.authenticated,
					 data: rows,
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

module.exports = router;
