var express = require('express');
var router = express.Router();
var path = require('path');
var GLOBALS = require('../public/javascripts/globals.js').GLOBALS;
var db = require('../app.js').db;

// 교구 특성 업데이트
router.post('/change-features', function (req, res) {

	var data = {
		tool_features: req.body.tool_features,
		goodsno: req.body.goodsno
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
	db.query('SELECT sno, catnm, category FROM gd_category', function (err, rows, fields) {
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

	db.query('Select goodsno, goodsnm, tool_features, catnm FROM (SELECT A.goodsno, A.goodsnm, A.tool_features, B.category FROM gd_goods A LEFT JOIN gd_goods_link B ON A.goodsno = B.goodsno GROUP BY A.goodsno) C, gd_category D WHERE C.category = D.category', function (err, rows, fields) {
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

	db.query('SELECT m_no, nickname, regdt, (SELECT COUNT(*) FROM gd_n_nuribox_own_tools WHERE gd_n_nuribox_own_tools.m_no = gd_member.m_no AND gd_n_nuribox_own_tools.nuribox_own_type = 0) AS own_cnt, (SELECT COUNT(*) FROM gd_n_nuribox_own_tools WHERE gd_n_nuribox_own_tools.m_no = gd_member.m_no AND gd_n_nuribox_own_tools.nuribox_own_type = 1) AS own_img_cnt, (SELECT COUNT(*) FROM gd_n_nuribox_need_tools WHERE gd_n_nuribox_need_tools.m_no = gd_member.m_no) AS need_cnt from gd_member WHERE nickname LIKE "%' + search + '%" ORDER BY m_no', function (err, rows, fields) {
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
			res.send(rows[0]);
		}
	});
});

//어린이집 전체 목록
router.get('/user-list-all', function (req, res) {
	db.query('SELECT m_no, nickname, regdt, (SELECT COUNT(*) FROM gd_n_nuribox_own_tools WHERE gd_n_nuribox_own_tools.m_no = gd_member.m_no AND gd_n_nuribox_own_tools.nuribox_own_type = 0) AS own_cnt, (SELECT COUNT(*) FROM gd_n_nuribox_own_tools WHERE gd_n_nuribox_own_tools.m_no = gd_member.m_no AND gd_n_nuribox_own_tools.nuribox_own_type = 1) AS own_img_cnt, (SELECT COUNT(*) FROM gd_n_nuribox_need_tools WHERE gd_n_nuribox_need_tools.m_no = gd_member.m_no) AS need_cnt FROM gd_member ORDER BY m_no', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});
//카테고리 리스트
router.get('/ct-list-all', function (req, res) {
	db.query('SELECT * FROM gd_category ORDER BY sno', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});
//카테고리 리스트

router.get('/get-items/:userno', function (req, res) {
	var userno = req.params.userno;
	console.log(userno);
	db.query('SELECT * FROM gd_n_nuribox_own_tools WHERE m_no = ' + userno, function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});
//최근아이템
router.get('/get-recent-item/:userno', function (req, res) {
	var userno = req.params.userno;
	db.query('SELECT gd_n_nuribox_item.m_no,goodsno,nickname FROM gd_n_nuribox_item LEFT JOIN gd_member ON gd_n_nuribox_item.m_no = gd_member.m_no WHERE gd_n_nuribox_item.m_no <> ' + userno + ' AND goodsno=(SELECT goodsno FROM gd_n_nuribox_item WHERE gd_n_nuribox_item.m_no = ' + userno + ' AND is_order=1 LIMIT 1) GROUP BY gd_n_nuribox_item.m_no ORDER BY gd_n_nuribox_item.m_no LIMIT 4', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			res.send(err);
		} else {
			var mems = rows;
			var tmp={};
			tmp.target = rows[0].goodsno;
			tmp.mems = rows;
			db.query('SELECT goodsno,is_order,return_type,m_no FROM gd_n_nuribox_item WHERE m_no IN (SELECT m_no FROM gd_n_nuribox_item WHERE m_no <> ' + userno + ' AND goodsno=(SELECT goodsno FROM gd_n_nuribox_item WHERE m_no = ' + userno + ' AND is_order=1 LIMIT 1) GROUP BY m_no) AND goodsno IN (SELECT goodsno FROM gd_n_nuribox_item WHERE m_no= ' + mems[0].m_no + ' ORDER BY is_order) ORDER BY m_no, goodsno', function (err, rows, fields) {
				if (err) {
					console.log(new Date());
					console.log("error!!!!!!!" + err);
				} else {
					
					tmp.datas= rows;
					db.query('SELECT gd_n_nuribox_item.goodsno, gd_goods.goodsnm,tool_features FROM gd_n_nuribox_item LEFT JOIN gd_goods ON gd_n_nuribox_item.goodsno =gd_goods.goodsno WHERE m_no= ' + mems[0].m_no + ' GROUP BY goodsno ORDER BY gd_n_nuribox_item.goodsno', function (err, rows, fields) {
						if (err) {
							console.log(new Date());
							console.log("error!!!!!!!" + err);
						} else {
							console.log("해냈다");
							
							tmp.items = rows;
							console.log(tmp);
							res.send(tmp);

						}
					});
				}
			});
		}
	});
});
//카테고리 리스트

router.get('/nec-items/:userno', function (req, res) {
	var userno = req.params.userno;
	console.log(userno + "입니다");
	db.query('SELECT * FROM gd_n_nuribox_need_tools WHERE m_no = ' + userno, function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {

			res.send(rows);
		}
	});
});
//SELECT A.m_no, A.name, A.regdt, B.own FROM gd_member A, (SELECT count(C.nuribox_own_no) own FROM gd_n_nuribox_own_tools C WHERE m_no = m_no) B ORDER BY A.m_no;
//보유 교구 목록
router.get('/own-tool-list/:userno', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT nuribox_own_no, catnm, nuribox_own_nm FROM `gd_n_nuribox_own_tools` A LEFT JOIN gd_category B ON A.nuribox_own_category_no = B.sno Where nuribox_own_type = 0 and m_no = ' + userno, function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

//보유 교구 목록
router.get('/own-tool-image-list/:userno', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT nuribox_own_no, nuribox_own_image_url FROM `gd_n_nuribox_own_tools` A LEFT JOIN gd_category B ON A.nuribox_own_category_no = B.sno Where nuribox_own_type = 1 and m_no = ' + userno, function (err, rows, fields) {
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
router.post('/insert-own-tool', function (req, res) {
	var data = {
		m_no: req.body.m_no,
		nuribox_own_category_no: req.body.sno,
		nuribox_own_nm: req.body.toolName,
		nuribox_own_type: 0, //Text
	};

	db.query('INSERT INTO gd_n_nuribox_own_tools SET ?', data, function (err, result) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(result);
		}
	});
});

router.get('/own-tool-list/:userno', function (req, res) {
	var userno = req.params.userno;

	db.query('SELECT nuribox_own_no, catnm, nuribox_own_nm FROM `gd_n_nuribox_own_tools` A LEFT JOIN gd_category B ON A.nuribox_own_category_no = B.sno Where nuribox_own_type = 0 and m_no = ' + userno, function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});
//보유/필요 여부와 카테고리 목록
router.get('/nec-list/:userno', function (req, res) {
	var userno = req.params.userno;
	db.query('SELECT * FROM  gd_n_nuribox_need_tools WHERE m_no=' + userno, function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			window.alert(JSON.stringify(rows));
			res.send(rows);
		}
	});
});

//보유/필요 여부와 카테고리 목록
router.get('/nuribox-list/:userno', function (req, res) {
	var userno = req.params.userno;
	db.query('SELECT sno, catnm, category, (SELECT COUNT( * ) FROM gd_n_nuribox_own_tools WHERE gd_n_nuribox_own_tools.m_no = ' + userno + ' AND gd_category.category = gd_n_nuribox_own_tools.nuribox_own_category_no) AS own_cnt, (SELECT COUNT( * ) FROM gd_n_nuribox_need_tools WHERE gd_n_nuribox_need_tools.m_no = ' + userno + ' AND gd_category.category = gd_n_nuribox_need_tools.nuribox_need_category_no) AS need_cnt FROM gd_category order by need_cnt desc', function (err, rows, fields) {
		if (err) {
			console.log(new Date());
			console.log(err);
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

//동일 반품 사유가 있는지 검색
router.post('/return_list_with_reason', function (req, res) {
	var data = {
		m_no: req.body.m_no,
		return_type: req.body.return_type,
	};
	db.query('SELECT count(*) count FROM gd_n_nuribox_item A, gd_n_nuribox B where A.nuribox_no = B.nuribox_no and B.m_no = ' + data.m_no + ' and A.return_type = ' + data.return_type, function (err, rows, fields) {
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
