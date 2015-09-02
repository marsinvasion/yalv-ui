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

   logCollection.aggregate([{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}],function(err,result){
     if(err) return callback(err,null);
     callback(null,result);
   })
};
   
var aggRequest = function(callback){
    agg("$request",callback);
}

var list = function(callback){
  logCollection.find().toArray(function(err,result){
    if(err) return callback(err,null);
    callback(null,result);
  });
}

module.exports = {
  agg: agg,
  aggRequest:aggRequest,
  list: list
}
