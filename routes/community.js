var express = require('express');
var router = express.Router();

router.get('/community/:project_community', function(req, res) {
	
	var project_community = req.params.project_community;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM project WHERE community = ?',[project_community] , function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

			if (req.session.authenticated){
			res.render('community', {notif: req.flash('notif'),
					 auth: req.session.authenticated,
					 data:rows,
					 admin: req.session.data.admin});	
			}else{
				res.render('community', {notif: req.flash('notif'),
						 auth: req.session.authenticated,
						 data:rows});	
			}
         });

    });

});

module.exports = router;
