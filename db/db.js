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


agg:function(aggBy,callback,startDate,endDate,searchId, searchType){
  var aggBy = [{$match:{time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}}},{ $group:{ _id:aggBy, avgTime:{$avg:"$timeElapsed"}}}]; 
   if(searchType && searchId){
     if('requestId' === searchType){
       aggBy.unshift({$match:{request:searchId}});
     }
     else if('host' === searchType){
       aggBy.unshift({$match:{hostname:searchId}});
     }
     if('api' === searchType){
       aggBy.unshift({$match:{api:searchId}});
     }
     if('func' === searchType){
       aggBy.unshift({$match:{func:searchId}});
     }
   }
   debugger;
   logCollection.aggregate(aggBy,{allowDisUser:true},function(err,result){
     if(err) return callback(err,null);
     callback(null,result);
   })
},
   
aggRequest:function(callback,startDate,endDate,searchId,searchType){
    this.agg("$request",callback,startDate,endDate,searchId,searchType);
},

list:function(callback,startDate,endDate,searchId,searchType){
  debugger;
  var findBy = {time:{$gt:startDate.toISOString(),$lt:endDate.toISOString()}};
  if('requestId'===searchType){
    findBy = {
      $and : [
        findBy,
	{request: searchId}
      ]
    }
  }
  else if('host'===searchType){
    findBy = {
      $and : [
        findBy,
	{hostname: searchId}
      ]
    }
  }
  else if('api'===searchType){
    findBy = {
      $and : [
        findBy,
	{api: searchId}
      ]
    }
  }
  else if('func'===searchType){
    findBy = {
      $and : [
        findBy,
	{func: searchId}
      ]
    }
  }
  logCollection.find(findBy).sort({_id:1}).toArray(function(err,result){
    debugger;
    if(err) return callback(err,null);
    callback(null,result);
  });
},

aggHost:function(callback,startDate,endDate,searchId,searchType){
  this.agg("$hostname",callback,startDate,endDate,searchId,searchType);
},

aggApi:function(callback,startDate,endDate,searchId,searchType){
  this.agg("$api",callback,startDate,endDate,searchId,searchType);
},

aggFunc:function(callback,startDate,endDate,searchId,searchType){
  this.agg("$func",callback,startDate,endDate,searchId,searchType);
}



}
