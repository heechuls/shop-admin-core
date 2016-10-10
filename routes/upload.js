var express = require('express');
var router = express.Router();
var db = require('../app.js').db;

var multer = require('../app.js').multer;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        if(file.originalname != undefined)
            cb(null, req.body.m_no + '-' + currentTime() + ".jpg");
        else
            cb(null, "no filename");
  }
});
var upload = multer({ storage : storage });

router.get('/', function(req, res, next){
  res.render('upload');
});

router.post('/', upload.single("filename"), function (req, res, next) {
    console.log(req.body); //form fields
    console.log(req.file);
    if(req.body.m_no == undefined || req.file.filename == "no filename"){
        res.send(400);
        return;
    }
    //var downUrl = req.file.filename;
    //var retval = createOutput(downUrl, url);
    //res.send(retval);
    insertDB(req.body.m_no, req.file.filename, function(result) {
        res.send(result);
        return;
    });
});

function currentTime(){
  var current = new Date();
    var yyyy = current.getFullYear().toString();
    var mm = (current.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = current.getDate().toString();
    var date = yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
    var hour = current.getHours().toString();
    var min = current.getMinutes().toString();
    var sec = current.getSeconds().toString();
    var time = (hour[1]?hour:"0"+hour[0]) + (min[1]?min:"0"+min[0]) + (sec[1]?sec:"0"+sec[0]); // padding

  return date + "-" + time;
}

function createOutput(downUrl){
 return jbuilder.create(function(json) {
      json.set('downUrl', downUrl);
  });
}

function insertDB(m_no, url, done){
	var data = {
		m_no : m_no,
        nuribox_own_type : 1,
		nuribox_own_image_url : url
	};
	db.query('INSERT INTO gd_n_nuribox_own_tools SET ?', data, function (err, result) {
		if (err) {
			console.log(new Date());
			console.log(err);
            if(done != null)
                done(err);
		} else {
            if(done != null)
                done(result);
		}
        return;
	});
}    

module.exports = router;