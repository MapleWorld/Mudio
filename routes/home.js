var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	// Check with data in MySQL
	req.getConnection(function (err, conn) {
		if (err){
			console.log(err);
			return ;
		}
		
		var sql = 'SELECT * FROM music;';
					
		conn.query(sql, function(err, rows) {
			if (err) {
				console.log(err);
			}
			
			res.render('home', {notif: req.flash('notif'),
				 auth: req.session.authenticated,
				 data: rows});
		});
	});
});

module.exports = router;
