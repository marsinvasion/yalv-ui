var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var util = require('util');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  var startDate = new Date();
  startDate.setDate(startDate.getDate()-2);
  var endDate = new Date();
  getResult(res,startDate,endDate,"get");
});

router.post('/', function(req, res, next) {
  var s;
  if(req.body.startDate){
    s = new Date(req.body.startDate);
  }else{
    s = new Date();
    s.setDate(s.getDate()-2);
  }
  var e;
  if(req.body.endDate) e = new Date(req.body.endDate);
  else e = new Date();
  getResult(res,s,e,"post");
});

var getResult = function(res,startDate,endDate,type){

  async.parallel({
    reqAgg: function(callback){
      db.aggRequest(callback,startDate,endDate);
    },
    all: function(callback){
      db.list(callback,startDate,endDate);
    },
    host: function(callback){
      db.aggHost(callback,startDate,endDate);
    },
    api: function(callback){
      db.aggApi(callback,startDate,endDate);
    },
    func: function(callback){
      db.aggFunc(callback,startDate,endDate);
    }
  },
  function(err, results){
    if(err){
      util.log(err);
      return res.status(500).end();
    }
    if('post'===type){
      var data = {};
      data.reqAgg=JSON.stringify(results.reqAgg);
      data.all=JSON.stringify(results.all);
      data.host=JSON.stringify(results.host);
      data.api=JSON.stringify(results.api);
      data.service=JSON.stringify(results.func);
      res.json(data);
    }else{
      res.render('index', { title: 'Log Viewer', reqAgg:JSON.stringify(results.reqAgg), all:JSON.stringify(results.all), host:JSON.stringify(results.host),api:JSON.stringify(results.api),service:JSON.stringify(results.func) });
    }
  });
}

module.exports = router;
