var path      			= require('path');
var mysql 				= require('mysql');
var multer     			= require('multer');
var express  			= require('express');
var bodyParser 			= require('body-parser');
var cookieParser 		= require('cookie-parser');
var flash 				= require('connect-flash');
var session 			= require('express-session');
var expressValidator 	= require('express-validator');
var connection  		= require('express-myconnection');

var app 				= express();

/*Set EJS template Engine*/
app.engine('html', require('ejs').__express);
app.set('views','./views');
app.set('view engine','html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser('secretString'));

app.use(session({
	cookieName: "session",
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	secret: 'Lonely Boy',
	resave: true,
	saveUninitialized: true,
	cookie: {maxAge: 3600000}
	}	
));
app.use(flash());

// Routes	
var router 			= express.Router();
var home 			= require('./routes/home');
var user 			= require('./routes/user');
var about 			= require('./routes/about');
var login 			= require('./routes/login');
var logout			= require('./routes/logout');
var upload 			= require('./routes/upload');
var profile			= require('./routes/profile');
var register 		= require('./routes/register');

app.use('/', home);
app.use('/', user);
app.use('/', about);
app.use('/', login);
app.use('/', logout);
app.use('/', upload);
app.use('/', profile);
app.use('/', register);

//var tools = require('./public/js/tools');
//console.log(tools.currentTime());
	
//start Server
var server = app.listen(8080,function(){
   console.log("Listening to port %s",server.address().port);
});





