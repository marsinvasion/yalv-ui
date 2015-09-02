var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var util = require('util');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  async.parallel({
    reqAgg: function(callback){
      db.aggRequest(callback);
    },
    all: function(callback){
      db.list(callback);
    }
  },
  function(err, results){
    debugger;
    if(err){
      util.log(err);
      return res.status(500).end();
    }
    res.render('index', { title: 'view logs', reqAgg:results.reqAgg, all:results.all });
  });
});


module.exports = router;
