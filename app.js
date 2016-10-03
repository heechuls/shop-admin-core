var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var GLOBALS = require('./public/javascripts/globals.js').GLOBALS;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/templates', express.static('/public/templates'));
app.use('/', routes);
app.use('/users', users);

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


/*
// 서버 시작
app.listen(process.env.PORT || 3000, function () {
	console.log('talktudy app running on port 3000');
});
*/

var user_list_all = function(req, res) {
	db.query('SELECT m_no, name, regdt FROM gd_member WHERE 1 ORDER BY m_no', function (err, rows, fields) {
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

//APIs through HTTP Post
app.get(GLOBALS.API_HOME + 'userinfo/:userno', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT * FROM gd_member WHERE m_no = ' + userno, function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send( rows[0] );
		}
	});
});

app.get(GLOBALS.API_HOME + 'user-list-all/', function (req, res) {
	db.query('SELECT m_no, name, regdt FROM gd_member WHERE 1 ORDER BY m_no', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
            res.send(rows);
		}
	});
});

//추천인 있는 사용자 목록
app.get(GLOBALS.API_HOME + 'recomm-list/', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT A.m_no, A.name aname, A.recommid, A.regdt, B.name bname, B.m_id FROM gd_member A JOIN gd_member B ON B.m_id = A.recommid', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

//카테고리 목록
app.get(GLOBALS.API_HOME + 'category-list/', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT sno, catnm, category FROM gd_category' , function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

//교구 목록
app.get(GLOBALS.API_HOME + 'tool-list/', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT goodsno, goodsnm, tool_features FROM gd_goods' , function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});


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

app.auth = auth;

/* GET home page. */

/*app.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log("app.js")
  user_list_all(req, res);
  res.sendFile("index.htm");
});
*/

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

module.exports = app;
module.exports.user_list_all = user_list_all;
module.exports.__dirname = __dirname;
