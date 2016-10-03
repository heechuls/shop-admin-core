var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {  
  var app = require('../app.js');
  app.user_list_all(req, res);
  res.sendFile(path.join(__dirname, '../public/templates', 'index.html'));
  //res.send("Hello World");
});

module.exports = router;
