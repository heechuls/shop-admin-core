var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var GLOBALS = require('./public/javascripts/globals.js').GLOBALS;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var mysql = require('mysql');

var db_godomall = {
	host : '52.78.130.219',
	user : 'root',
	password : 'xhrxjel0101',
	database : 'talktudy'
}

var db_connection = db_godomall;
var db = mysql.createConnection( db_connection );

module.exports = app;
module.exports.__dirname = __dirname;
module.exports.db = db;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var api = require('./routes/apis');

app.use('/templates', express.static('/public/templates'));
app.use('/', routes);
app.use('/apis', api);

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
module.exports.auth = auth;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

// 서버 시작
app.listen(process.env.PORT || 3000, function () {
	console.log('talktudy app running on port 3000');
});