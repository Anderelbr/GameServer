var players = [];
module.exports.players = players;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io');

var shortid = require('shortid');
var port = process.env.PORT || 7300;

var rooms = [];
var maxrooms = 3;

var Room = require('./Room.js').room;
var DataBase = require('./DataBase.js');

var ClientClass = require('./Client.js').ClientClass;

//-------------------------------------------------------------------------------------//  
//                           Initialize Server                                         //        
//-------------------------------------------------------------------------------------//

function InitializeServer(){
    
	io = io.listen(http, false);
	io.on('connection', (socket) => {
        socket.on ('GameEnterReq', () => {
            if(rooms[0].CurSize < rooms[0].Size){         
                socket.room = rooms[0].name;
                socket.join(socket.room);

                rooms[0].AddClient();

                console.log("Welcome, you are connected to " + rooms[0].name);
                console.log("Current Size: " + rooms[0].CurSize + "/" + rooms[0].Size);

                socket.emit('GameEnterRes', {channel: socket.room, opcode:"0"});
                
                let Client = new ClientClass(socket);
            };
        });
	});
        
    DataBase.Connect();   
    CreateChannels();
      
	console.log("Server is running on " + port);
};

//-------------------------------------------------------------------------------------//  
//                           Create Channels                                           //        
//-------------------------------------------------------------------------------------//

function CreateChannels (){
    for (let i = 0; i < maxrooms; i++){
        let curoom = new Room ('Channel ' + i, 'Available', shortid.generate(), 0, 20);
        rooms.push(curoom);
	};
};

//-------------------------------------------------------------------------------------//  
//                           Undefined                                                 //        
//-------------------------------------------------------------------------------------//

app.get('/', (req, res) => {
    res.send("<h1>Server is running on " + port + "</h1>");
});

setTimeout(InitializeServer, 100);
http.listen(port);