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
    },
    host: function(callback){
      db.aggHost(callback);
    },
    api: function(callback){
      db.aggApi(callback);
    },
    func: function(callback){
      db.aggFunc(callback);
    }
  },
  function(err, results){
    debugger;
    if(err){
      util.log(err);
      return res.status(500).end();
    }
    debugger;
    res.render('index', { title: 'view logs', reqAgg:JSON.stringify(results.reqAgg), all:JSON.stringify(results.all), host:JSON.stringify(results.host),api:JSON.stringify(results.api),service:JSON.stringify(results.func) });
  });
});


module.exports = router;
