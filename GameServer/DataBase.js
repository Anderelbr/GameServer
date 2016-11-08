var mongodb = require('mongodb').MongoClient;
var config = require('./config.js');

var DataBase = null;

//-------------------------------------------------------------------------------------//  
//                           Data Base Manager                                         //        
//-------------------------------------------------------------------------------------//

function Connect(){
    mongodb.connect(config.dburl, function (err, db){   
        
        if(err)
            throw err;
        
        DataBase = db;
    }); 
};

function Find(collection, obj, callback) {
    DataBase.collection(collection).find(obj).toArray(function (err, result){
        
        if(err)
            throw err;
        
        callback(result);
    });
};

module.exports.Connect = Connect;
module.exports.Find = Find;