var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session')
//var routes = require('./routes/index');
//var users = require('./routes/users');

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash') // session 관련해서 사용됨. 로그인 실패시 session등 클리어하는 기능으로 보임.
var basicAuth = require('basic-auth');

var app = express();

var mysql = require('mysql');

var db_local = {
	host : 'localhost',
	user : 'root',
	password: '95WhGksGmf!6',
	database: 'talktudy'
};

var db_godomall = {
	host : '52.78.130.219',
	user : 'root',
	password : 'xhrxjel0101',
	database : 'talktudy'
}

var db_connection = db_godomall;

var db = mysql.createConnection( db_connection );

// view engine setup
app.set('public', path.join(__dirname, 'public'));
//app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(cookieParser());
app.use('/static/', express.static(path.join(__dirname, 'public')));
/*app.use(methodOverride());
app.use(expressSession());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


app.use('/', this);
//app.use('/users', users);
*/


app.get('/', function(req, res) {
    // load the single view file
    // (angular will handle the page changes on the front-end)
    //res.sendFile(__dirname + '/public/index.html');
    //res.sendFile(__dirname + '/public/index.html');
    res.sendFile('index.html');
    //res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var user_list_all = function(req, res) {
	db.query('SELECT * FROM gd_member WHERE 1 ORDER BY m_no', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
            console.log(rows);
			//res.render('category_list', { title : title, data : rows });
		}
	});
};

var auth = function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	}

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	}

	if (user.name == 'talktudy' && user.pass == 'xhrxjel0101') {
		return next();
	} else {
		return unauthorized(res);
	}
}

app.auth = auth;

/* GET home page. */

/*app.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log("app.js")
  user_list_all(req, res);
  res.sendFile("index.htm");
});
*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//serializer와 deseriazlier는 필수로 구현해야 함.

// 인증 후, 사용자 정보를 Session에 저장함
passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});

// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize');
    console.log(user);
    done(null, user);
    //});
});

passport.use(new LocalStrategy({
        usernameField : 'userid',
        passwordField : 'password',
        passReqToCallback : true
    }
    ,function(req,userid, password, done) {
        if(userid=='hello' && password=='world'){
            var user = { 'userid':'hello',
                          'email':'hello@world.com'};
            return done(null,user);
        }else{
            return done(null,false);
        }
    }
));

var handleDisconnect = function() {
	db.on('error', function (err) {
		if (!err.fatal) {
			return;
		}

		if (err.code !== "PROTOCOL_CONNECTION_LOST") {
			throw err;
		}

		db = mysql.createConnection( db_connection );
		handleDisconnect();
	});
}

handleDisconnect();

// 서버 시작
app.listen(process.env.PORT || 3000, function () {
	console.log('talktudy app running on port 3000');
});


module.exports = app;
