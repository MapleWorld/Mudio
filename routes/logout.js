var express = require('express');
var router = express.Router();

// Delete user session
router.get('/logout', function (req, res) {

    if(req.session.authenticated) {
    	delete req.session.user;
    	delete req.session.authenticated;
        req.flash('notif', 'You are logged out.');
    	res.redirect('/');
    	return ;
    }
    
    req.flash('notif', 'You are not login.');
	res.render('login', {notif: req.flash('notif')});
});

module.exports = router;
