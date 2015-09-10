var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var url = 'mongodb://localhost:27017/yalv';
var logCollection;

MongoClient.connect(url, function(err, mydb) {
  if(err) throw err;
  util.log("Connected correctly to server");
  logCollection = mydb.collection('logs');
});


module.exports = { 


agg:function(aggBy,callback,startDate,endDate,reqId){
  var aggBy = [{$match:{time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}}},{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}]; 
   if(reqId){
     aggBy.unshift({$match:{request:reqId}});
   }
   debugger;
   logCollection.aggregate(aggBy,{allowDisUser:true},function(err,result){
     if(err) return callback(err,null);
     callback(null,result);
   })
},
   
aggRequest:function(callback,startDate,endDate,reqId){
    this.agg("$request",callback,startDate,endDate,reqId);
},

list:function(callback,startDate,endDate,reqId){
  debugger;
  var findBy = {time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}};
  if(reqId){
    findBy = {
      $and : [
        findBy,
	{request: reqId}
      ]
    }
  }
  logCollection.find(findBy).sort({_id:1}).toArray(function(err,result){
    debugger;
    if(err) return callback(err,null);
    callback(null,result);
  });
},

aggHost:function(callback,startDate,endDate,reqId){
  this.agg("$os.hostname",callback,startDate,endDate,reqId);
},

aggApi:function(callback,startDate,endDate,reqId){
  this.agg("$api",callback,startDate,endDate,reqId);
},

aggFunc:function(callback,startDate,endDate,reqId){
  this.agg("$func",callback,startDate,endDate,reqId);
}



}
