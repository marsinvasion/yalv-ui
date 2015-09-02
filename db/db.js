var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var url = 'mongodb://localhost:27017/yamf';
var logCollection;

MongoClient.connect(url, function(err, mydb) {
  if(err) throw err;
  util.log("Connected correctly to server");
  logCollection = mydb.collection('logs');
});

 

var agg = function(aggBy,callback){
  var date = new Date();
  date.setDate(date.getDate()-2);
   logCollection.aggregate([{$match:{time:{$gt:date.toISOString()}}},{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}],{allowDisUser:true},function(err,result){
     if(err) return callback(err,null);
     callback(null,result);
   })
};
   
var aggRequest = function(callback){
    agg("$request",callback);
}

var list = function(callback){
  var date = new Date();
  date.setDate(date.getDate()-2);
  logCollection.find({time:{$gt:date.toISOString()}}).toArray(function(err,result){
    if(err) return callback(err,null);
    callback(null,result);
  });
}

module.exports = {
  agg: agg,
  aggRequest:aggRequest,
  list: list
}
