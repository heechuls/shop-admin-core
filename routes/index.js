var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log("index.js");
  router.user_list_all(req, res);
  res.sendFile("index.htm");
});

module.exports = router;
