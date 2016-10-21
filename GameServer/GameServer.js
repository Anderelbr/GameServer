var room = require('./Room.js').room;

var app = require('express')();
var http = require('http').Server(app);
var ioo = require('socket.io');
var shortid = require('shortid');

var port = process.env.PORT || 7300;

var rooms = [];
var maxrooms = 3;


app.get('/', function (req, res){
	res.send("<h1>Server is running on " + port + "</h1>");
	InitializeServer();
});

function InitializeServer(){

	var io = ioo.listen(http, false);

	io.on('connection', function (socket){
		socket.on ('GameEnterReq', function(){
			if(rooms[0].cursize <  rooms[0].size){

			socket.room = rooms[0].name;
			socket.join(socket.room);

			rooms[0].cursize++;

			console.log("Welcome, you are connected to " + rooms[0].name);
			console.log("Size: " + rooms[0].size);
			console.log("Current Size: " + rooms[0].cursize);

			socket.emit('GameEnterRes');
			};
		});

		socket.on('WorldEnterReq', function(){

		});
	});

	//Create Channels
	for (var i = 0; i < maxrooms; i++){
		var curoom = new room ('Channel ' + i, 'Available', shortid.generate(), 0, 3);
		rooms.push(curoom);
	};

	console.log("Server is running on " + port);
};

http.listen(port);