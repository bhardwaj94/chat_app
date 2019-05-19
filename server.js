var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on("join", function(name){
        people[socket.id] = name;
		io.emit("update", "You have connected to the server.");
		io.emit("update", name + " has joined the server.")
		io.emit("update-people", people);
	});
    socket.on('disconnect', function(msg){
        io.emit("update", people[socket.id] + " has left the server.");
		delete people[socket.id];
		io.emit("update-people", people);
    });
    socket.on('send', function(msg){
        console.log('message: ' + msg);
        io.emit('chat', people[socket.id], msg);
      });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});