var express = require('express');
var router = express.Router();
var path = require('path');
var GLOBALS = require('../public/javascripts/globals.js').GLOBALS;
var db = require('../app.js').db;

// 교구 특성 업데이트
router.post('/change-features', function (req, res) {

	var data = {
		tool_features : req.body.tool_features,
		goodsno : req.body.goodsno
	};
	db.query('UPDATE gd_goods SET tool_features = ' + data.tool_features + ' WHERE goodsno = ' + data.goodsno, function (err, result) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(result);
		}
	});
});

//교구 카테고리 목록
router.get('/category-list', function (req, res) {
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

//추천인 있는 사용자 목록
router.get('/recomm-list', function (req, res) {
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

//교구 목록
router.get('/tool-list', function (req, res) {
	var userno = req.params.userno;

	db.query('Select goodsno, goodsnm, tool_features, catnm FROM (SELECT A.goodsno, A.goodsnm, A.tool_features, B.category FROM gd_goods A LEFT JOIN gd_goods_link B ON A.goodsno = B.goodsno GROUP BY A.goodsno) C, gd_category D WHERE C.category = D.category' , function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

//어린이집 검색
router.get('/user-list/:search', function (req, res) {
	var search = req.params.search;

	db.query('SELECT m_no, name, regdt FROM gd_member WHERE name LIKE "' + search + '" ORDER BY m_no', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
            res.send(rows);
		}
	});
});

//APIs through HTTP Post
router.get('/userinfo/:userno', function (req, res) {
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

//어린이집 전체 목록
router.get('/user-list-all', function (req, res) {
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

//보유 교구 등록
router.post('/insert-tool', function (req, res) {
	var data = {
		m_no : req.body.m_no,
		nuribox_own_category_no : req.body.sno,
		nuribox_own_nm : req.body.toolName,
		nuribox_own_type : 0, //Text
	};

	db.query('INSERT INTO gd_n_nuribox_own_tools SET ?', data, function (err, rows, fields) {
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
