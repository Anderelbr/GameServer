var room = require('./Room.js');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, false);
var shortid = require('shortid');

var port = process.env.PORT || 7300;

var rooms = [];
var maxrooms = 3;


app.get('/', function (req, res){
	res.send("<h1>Server is running on " + port + "</h1>");
	StartSocket();
});

function StartSocket(){
	io.on('connection', function (socket){
		socket.on ('GameEnterReq', function(){
			if(rooms[0].cursize <  rooms[0].size){

			socket.room = rooms[0].name;
			socket.join(socket.room);

			rooms[0].curize++;
			console.log("Welcome, you are connected to " + rooms[0].name);
			};
		});
	});

	//Create Channels
	for (var i = 0; i < maxrooms; i++){
		var roomm = new room ('Channel ' + i, 'Available', shortid.generate(), 0, 3);
		rooms.push(roomm);
	};
};

console.log("Server is running on " + port);
http.listen(port);