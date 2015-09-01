var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var url = 'mongodb://localhost:27017/yamf';
var db;

MongoClient.connect(url, function(err, mydb) {
  if(err) throw err;
  util.log("Connected correctly to server");
  db = mydb;
});

 

var agg = function(aggBy,callback,arg){

   var logCollection = db.collection('logs');
   logCollection.aggregate([{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}],function(err,result){
     if(err) return callback(err,null,null);
     callback(null,result,arg);
   })
};
   
var aggRequest = function(callback,arg){
    agg("$request",callback,arg);
}

module.exports = {
  agg: agg,
  aggRequest:aggRequest
}
