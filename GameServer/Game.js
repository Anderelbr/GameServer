var mongodb = require('mongodb').MongoClient;
var config = require('./config.js');

function ConnectDB (callback){
	mongodb.connect(config.dburl, function (err, db){
		if(err)
			throw err;

		callback(db);
	});
};

function EnterWorld (socket){

	this.LoadPlayer = function (data){

		var channel = data.channel;
		var charid = {charid:data.charid};

		ConnectDB(function(db){
			db.collection("characters").find(charid).toArray(function(err, result){
				if(result.length > 0){
					socket.sockets.in(channel).emit('WorldEnterRes', {loadedplayer:result[0], opcode:"0"});
				}else{
					socket.sockets.in(channel).emit('WorldEnterRes', {opcode:"1"});
				};
			});
		});
	};
};

module.exports.EnterWorld = EnterWorld;