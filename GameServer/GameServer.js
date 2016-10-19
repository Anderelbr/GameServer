var rooms = require('./Room.js');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, false);

var port = process.env.PORT || 7300;

app.get('/', function (req, res){
	res.send("<h1>Server is running on " + port + "</h1>");
	StartSocket();
});

function StartSocket(){
	io.on('connection', function (socket){
		socket.on ('GameEnterReq', function(){
			console.log("New connection");
			socket.emit('GameEnterRes');
		});
	});
};

console.log("Server is running on " + port);
http.listen(port);