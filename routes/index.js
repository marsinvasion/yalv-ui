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
  getResult(res,startDate,endDate,getCallback,null);
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
  getResult(res,s,e,postCallback,req.body.searchId, req.body.searchType);
});

var getResult = function(res,startDate,endDate,reqCallback,searchId,searchType){

  async.parallel({
    reqAgg: function(callback){
      db.aggRequest(callback,startDate,endDate,searchId,searchType);
    },
    all: function(callback){
      db.list(callback,startDate,endDate,searchId,searchType);
    },
    host: function(callback){
      db.aggHost(callback,startDate,endDate,searchId, searchType);
    },
    api: function(callback){
      db.aggApi(callback,startDate,endDate,searchId, searchType);
    },
    func: function(callback){
      db.aggFunc(callback,startDate,endDate,searchId, searchType);
    }
  },
  function(err, results){
    if(err){
      util.log(err);
      return res.status(500).end();
    }
    reqCallback(res,results);
  });
}

var getCallback = function(res,results){
  res.render('index', { title: 'Log Viewer', reqAgg:JSON.stringify(results.reqAgg), all:JSON.stringify(results.all), host:JSON.stringify(results.host),api:JSON.stringify(results.api),service:JSON.stringify(results.func) });

}

var postCallback = function(res,results){
  var data = {};
  data.reqAgg=JSON.stringify(results.reqAgg);
  data.all=JSON.stringify(results.all);
  data.host=JSON.stringify(results.host);
  data.api=JSON.stringify(results.api);
  data.service=JSON.stringify(results.func);
  res.json(data);
}

module.exports = router;
