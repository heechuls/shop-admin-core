var express = require('express');
var router = express.Router();
var path = require('path');
var auth = require('../app.js').auth;

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/templates', 'index.html'));
  //res.send("Hello World");
});

module.exports = router;
