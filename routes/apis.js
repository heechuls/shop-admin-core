var express = require('express');
var router = express.Router();
var path = require('path');
var GLOBALS = require('../public/javascripts/globals.js').GLOBALS;
var db = require('../app.js').db;

router.get('/category-lists', function (req, res) {
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

module.exports = router;
