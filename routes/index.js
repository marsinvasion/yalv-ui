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
  getResult(res,s,e,postCallback,req.body.options);
});

var getResult = function(res,startDate,endDate,reqCallback,options){

  async.parallel({
    reqAgg: function(callback){
      db.aggRequest(callback,startDate,endDate,options);
    },
    all: function(callback){
      db.list(callback,startDate,endDate,options);
    },
    host: function(callback){
      db.aggHost(callback,startDate,endDate,options);
    },
    api: function(callback){
      db.aggApi(callback,startDate,endDate,options);
    },
    func: function(callback){
      db.aggFunc(callback,startDate,endDate,options);
    }
  },
  function(err, results){
    if(err){
      util.log(err);
      return res.status(500).end();
    }
    results.autoComplete = [];
    async.parallel([
      function(parCallback){
        async.each(results.reqAgg,function(req,callback){
          results.autoComplete.push({label:req._id,type:'requestId'});
          callback();
        },function(){  
	  parCallback();
        });
      },
      function(parCallback){
        async.each(results.host,function(req,callback){
	  debugger;
          results.autoComplete.push({label:req._id,type:'host'});
          callback();
        },function(){  
	  parCallback();
        });
      },
      function(parCallback){
        async.each(results.api,function(req,callback){
          results.autoComplete.push({label:req._id,type:'api'});
          callback();
        },function(){  
	  parCallback();
        });
      },
      function(parCallback){
        var data=[];
        async.each(results.func,function(req,callback){
          results.autoComplete.push({label:req._id,type:'func'});
          callback();
        },function(){  
	  parCallback();
        });
      }
    ],
    function(err){
        debugger;
        reqCallback(res,results);
    });
  });
}

var getCallback = function(res,results){
  debugger;
  res.render('index', { title: 'Log Viewer', reqAgg:JSON.stringify(results.reqAgg), all:JSON.stringify(results.all), host:JSON.stringify(results.host),api:JSON.stringify(results.api),service:JSON.stringify(results.func),autoComplete:results.autoComplete });

}

var postCallback = function(res,results){
  var data = {};
  data.reqAgg=JSON.stringify(results.reqAgg);
  data.all=JSON.stringify(results.all);
  data.host=JSON.stringify(results.host);
  data.api=JSON.stringify(results.api);
  data.service=JSON.stringify(results.func);
  data.autoComplete=JSON.stringify(results.autoComplete);
  res.json(data);
}

module.exports = router;
