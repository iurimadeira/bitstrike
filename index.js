var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
})

io.on("connection", function(socket){
	var username;

	socket.on("user-connected", function(name){
		username = name;
		console.log(name + " joined the game.");
		io.emit("user-connected", username);
	});

	socket.on("chat-message", function(msg){
		console.log("message: " + msg);
		io.emit("chat-message", msg);
	});

	socket.on("disconnect", function(socket){
		console.log(username + " has left the game.");
		io.emit("user-disconnected", username);
	});
});

http.listen(3000, function(){
	console.log("BitStrike started! Listening on " + 3000 + "...");
});