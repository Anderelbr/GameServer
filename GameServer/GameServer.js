var room = require('./Room.js').room;
var game = require('./Game.js');

var shortid = require('shortid');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io');

var port = process.env.PORT || 7300;

var rooms = [];
var maxrooms = 3;

var serverunning = false;

function StartEvents(server,socket){
    socket.on ('GameEnterReq', function(){
        if(rooms[0].cursize <  rooms[0].size){         
            socket.room = rooms[0].name;
            socket.join(socket.room);

            rooms[0].cursize++;

            console.log("Welcome, you are connected to " + rooms[0].name);
            console.log("Current Size: " + rooms[0].cursize + "/" + rooms[0].size);

            socket.emit('GameEnterRes', {channel: socket.room, opcode:"0"});
        };
    });
    
    socket.on('MoveReq', server.Move);
    socket.on('WorldEnterReq', server.LoadPlayer);  
    
    socket.on('disconnect', server.DisconnectedPlayer);
};

function InitializeServer(){
    if(!serverunning){
        
	io = io.listen(http, false);
    
	io.on('connection', function (socket){
		var server = new game.Server(socket);
		StartEvents(server,socket);
	});

	//TODO:Create Channels
	for (var i = 0; i < maxrooms; i++){
		var curoom = new room ('Channel ' + i, 'Available', shortid.generate(), 0, 20);
		rooms.push(curoom);
	};
    
    serverunning = true;
	console.log("Server is running on " + port);
    };
};

app.get('/', function (req, res){
	res.send("<h1>Server is running on " + port + "</h1>");
	InitializeServer();
});

http.listen(port);