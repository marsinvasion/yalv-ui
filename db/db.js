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


agg:function(aggBy,callback,startDate,endDate){
   logCollection.aggregate([{$match:{time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}}},{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}],{allowDisUser:true},function(err,result){
     if(err) return callback(err,null);
    callback(null,result);
   })
},
   
aggRequest:function(callback,startDate,endDate){
    this.agg("$request",callback,startDate,endDate);
},

list:function(callback,startDate,endDate){
  debugger;
  logCollection.find({time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}}).sort({_id:1}).toArray(function(err,result){
    debugger;
    if(err) return callback(err,null);
    callback(null,result);
  });
},

aggHost:function(callback,startDate,endDate){
  this.agg("$os.hostname",callback,startDate,endDate);
},

aggApi:function(callback,startDate,endDate){
  this.agg("$api",callback,startDate,endDate);
},

aggFunc:function(callback,startDate,endDate){
  this.agg("$func",callback,startDate,endDate);
}



}
