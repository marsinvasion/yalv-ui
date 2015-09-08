var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var url = 'mongodb://localhost:27017/yalv';
var logCollection;

MongoClient.connect(url, function(err, mydb) {
  if(err) throw err;
  util.log("Connected correctly to server");
  logCollection = mydb.collection('logs');
});

var date = new Date();
date.setDate(date.getDate()-2);

module.exports = { 


agg:function(aggBy,callback){
   logCollection.aggregate([{$match:{time:{$gt:date.toISOString()}}},{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}],{allowDisUser:true},function(err,result){
     if(err) return callback(err,null);
    callback(null,result);
   })
},
   
aggRequest:function(callback){
    this.agg("$request",callback);
},

list:function(callback){
  var date = new Date();
  date.setDate(date.getDate()-2);
  logCollection.find({time:{$gt:date.toISOString()}}).sort({_id:1}).toArray(function(err,result){
    if(err) return callback(err,null);
    callback(null,result);
  });
},

aggHost:function(callback){
  this.agg("$os.hostname",callback);
},

aggApi:function(callback){
  this.agg("$api",callback);
},

aggFunc:function(callback){
  this.agg("$func",callback);
},

setDate:function(d){
  this.date = d;
}

}
