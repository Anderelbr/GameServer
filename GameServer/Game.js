var mongodb = require('mongodb').MongoClient;
var config = require('./config.js');

var shortid = require('shortid');

var players = [];
var buffer = [];

function ConnectDB (callback){
	mongodb.connect(config.dburl, function (err, db){
		if(err)
			throw err;

		callback(db);
	});
};

function Server (socket){    
    var player = {
        playerid: "",
                        
        name: "",
        channel: "",
                        
        money: 0,
        level: 0,
                        
        location: "",
        pos: "",
                        
        accid: "",
        charid: "",
                        
        objid: "",
        
        moveSpeed: 0,
        rotSpeed: 0,
          
        lastposition: {
            x: 0,
            y: 0,
            z: 0
        },
                        
        lastmovetime: 0
    };
    
	this.LoadPlayer = function (data){ 
		ConnectDB(function(db){
			db.collection("characters").find({charid:data.charid}).toArray(function(err, result){
				if(result.length > 0){  
                    player = {
                    playerid: shortid.generate(),

                    name: result[0].name,
                    channel: data.channel,

                    money: result[0].money,
                    level: result[0].level,

                    location: result[0].location,
                    pos: result[0].pos,

                    accid: result[0].accid,
                    charid: result[0].charid,

                    objid: result[0].objid,
                        
                    moveSpeed: result[0].moveSpeed,
                    rotSpeed: result[0].rotSpeed,

                    lastposition: {
                        x: 0,
                        y: 0,
                        z: 0
                    },

                    lastmovetime: 0
                    };  
                    
                    for(var i = 0; i < players.length; i++){  
                        //This part load all players that now are connected
                        socket.emit('WorldEnterRes', {loadedplayer:players[i], opcode:"1"}); 
                    };
                    
                    //This part add my player to list of characters and send a message to the client but instantiate my player
                    players.push(player);
                    socket.emit('WorldEnterRes', {loadedplayer:player, opcode:"0"});
                    
                    //This part send to all players connected that i'm now are connected and instantiate my player
                    socket.broadcast.to(player.channel).emit('WorldEnterRes', {loadedplayer:player, opcode:"1"});
                }else{
					socket.emit('WorldEnterRes', {message: "Fail to create character", opcode:"3"});
				};
			});
		});
	};
    
    this.Move = function (data){   
    
    var clientdate = new Date(Date.parse(data.time));    
        
    var playerindex = players.indexOf(player);       
    var moveData = {posx: data.pos.x, posy: data.pos.y, posz: data.pos.z, moveSpeed: players[playerindex].moveSpeed, rotSpeed: players[playerindex].rotSpeed, state: data.state, time:Date.now(), playerid: players[playerindex].playerid};  
         
    if(buffer.length >= 10){
        for (var i = buffer.length - 1; i > 0; i--){
            //EJ: Slot 20 = Slot 19
            buffer[i] = buffer[i - 1];
        };
    }else{
        buffer.push(moveData);
    };
        
    buffer[0] = moveData;    
        
    if(buffer[0].time > clientdate.getTime()){
        for(var i = 0; i < buffer.length; i++){
          if(buffer[i].time <= clientdate.getTime() || i === buffer.length - 1){
              socket.broadcast.to(players[playerindex].channel).emit('MoveRes', buffer[i]);  
          };
        };
    };    
    }
    
    this.DisconnectedPlayer = function (data){   

    var playerindex = players.indexOf(player);
        
    socket.broadcast.to(players[playerindex].channel).emit('DisconnectRes', {playerid: players[playerindex].playerid});
    console.log("Player Disconnected: " + players[playerindex].name);
        
    players.splice(playerindex, 1);
    };
}

module.exports.Server = Server;