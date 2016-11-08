var EventsManager = require('./GameServer.js');
var DataBase = require('./DataBase.js');

var obj = require('./Objects.js');
var loadash = require('lodash');

var players = EventsManager.players;
var moveBuffer = [];

class ClientClass {
    
    constructor (socket){
        this.socket = socket;
        this.socket.on("MoveReq", this.MovePlayer.bind(this));
        
        this.socket.on("WorldEnterReq", this.LoadPlayer.bind(this));  
        this.socket.on("disconnect", this.DisconnectPlayer.bind(this));
    };
    
    LoadPlayer(data){      
      DataBase.Find("characters", {charid:data.charid}, (result) => {
            if(result.length > 0){  

                //Create player 
                let player = new obj.player(result, data);

                //This part load all players that now are connected
                loadash.each(players, (player, i) => {                          
                    this.socket.emit('WorldEnterRes', {loadedplayer:player, opcode:"1"}); 
                });

                //This part add my player to list of characters and send a message to the client but instantiate my player
                players.push(player);
                this.socket.emit('WorldEnterRes', {loadedplayer:player, opcode:"0"});

                //This part send to all players connected that i'm now are connected and instantiate my player
                this.socket.broadcast.to(player.channel).emit('WorldEnterRes', {loadedplayer:player, opcode:"1"});
            }else{
                this.socket.emit('WorldEnterRes', {message: "Fail to create character", opcode:"2"});
            };
        });  
    };
    
    MovePlayer (data){
        
        let player = null;
        let date = new Date(Date.parse(data.time));    

        //Find Player
        for (let i = 0; i < players.length; i++){
            if (players[i].playerid === data.playerid){
                player = players[i];  
            };
        };
        
        let moveData = new obj.move(data, player);

        if(moveBuffer.length >= 10){
            for (let i = moveBuffer.length - 1; i > 0; i--){
                //EJ: Slot 20 = Slot 19
                moveBuffer[i] = moveBuffer[i - 1];
            };
        }else{
            moveBuffer.push(moveData);
        };

        moveBuffer[0] = moveData;    

        if(moveBuffer[0].time > date.getTime()){
            for(let i = 0; i < moveBuffer.length; i++){
                if(moveBuffer[i].time === date.getTime() || i === moveBuffer.length - 1){
                    this.socket.broadcast.to(player.channel).emit('MoveRes', moveBuffer[i]);  
                };
            };
        };
    };
    
    DisconnectPlayer (data){
        let player = null;  

        //Find player
        for(let i = 0; i < players.length; i++){
            if(players[i].playerid === data.playerid){
                player = players[i];  
            };  
        };

        this.socket.broadcast.to(player.channel).emit('DisconnectRes', {playerid: player.playerid});
        console.log("Player Disconnected: " + player.name);

        players.splice(players.indexOf(player), 1);
    };
};

module.exports.ClientClass = ClientClass;