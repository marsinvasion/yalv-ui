var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.aggRequest(indexCallback,res);
});

var indexCallback = function(err,result,res){
  if(err){
    util.log(err);
    return res.status(500).end();
  }
  util.log(result);
  res.render('index', { title: 'view logs', result:result });
}

module.exports = router;
