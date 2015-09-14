var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var url = 'mongodb://localhost:27017/yalv';
var logCollection;

MongoClient.connect(url, function(err, mydb) {
  if(err) throw err;
  util.log("Connected to mongo");
  logCollection = mydb.collection('logs');
});


module.exports = { 

matchAggBy:function(options){
  var aggBy = [];
  if(options){
   debugger;
   for(var i=0;i<options.length;i++){
     if('requestId' === options[i].key){
       aggBy.push({$match:{request:options[i].val}});
     }
     else if('host' === options[i].key){
       aggBy.push({$match:{hostname:options[i].val}});
     }
     if('api' === options[i].key){
       aggBy.push({$match:{api:options[i].val}});
     }
     if('func' === options[i].key){
       aggBy.push({$match:{func:options[i].val}});
     }
   }
  }
  return aggBy;
},

agg:function(aggBy,callback,startDate,endDate,options){
  var args = this.matchAggBy(options);
  args.push({$match:{time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}}});
  args.push({ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}); 
  debugger;
  logCollection.aggregate(args,{allowDisUser:true},function(err,result){
  debugger;
     if(err) return callback(err,null);
     callback(null,result);
   })
},
   
aggRequest:function(callback,startDate,endDate,options){
    this.agg("$request",callback,startDate,endDate,options);
},

list:function(callback,startDate,endDate,options){
  var time = {time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}};
  var args = [];
  if(options){
  for(var i=0;i<options.length;i++){
    if('requestId'===options[i].key){
      args.push({request: options[i].val});
    }
    else if('host'===options[i].key){
      args.push({hostname: options[i].val});
    }
    else if('api'===options[i].key){
      args.push({api: options[i].val});
    }
    else if('func'===options[i].key){
      args.push({func: options[i].val});
    }
  }
  args.push(time);
  args = {$and:args};
  }else{
    args = time;
  }
  debugger;
  logCollection.find(args).toArray(function(err,result){
    debugger;
    if(err) return callback(err,null);
    callback(null,result);
  });
},

aggHost:function(callback,startDate,endDate,options){
  this.agg("$hostname",callback,startDate,endDate,options);
},

aggApi:function(callback,startDate,endDate,options){
  this.agg("$api",callback,startDate,endDate,options);
},

aggFunc:function(callback,startDate,endDate,options){
  this.agg("$func",callback,startDate,endDate,options);
}



}
