/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),	
	app = require("express")(),	
	http = require("http").Server(app),			
	io = require("socket.io")(http),				
	Player = require("./Player").Player,
	port = process.env.PORT || 8000;	

/**************************************************
** APPLICATION ROUTING
**************************************************/

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/public/:filename", function(req, res){
	res.sendFile(__dirname + "/public/" + req.params.filename);
});

/**************************************************
** GAME VARIABLES
**************************************************/
var players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	http.listen(port, function(){
		util.log("BitStrike started! Listening on " + port + "...");
		io.on("connection", function onSocketConnection(client) {

			// Listen for client disconnected
			client.on("disconnect", onClientDisconnect);

			// Listen for new player message
			client.on("new-player", onNewPlayer);

			// Listen for move player message
			client.on("move-player", onMovePlayer);

			// Listen for chat messages
			client.on("chat-message", onChatMessage);

		});
	});
	
}

// Chat message received
function onChatMessage(data){
	util.log("[CHAT] " + data.name + " : " + data.msg);
	this.broadcast.emit("chat-message", {"msg" : data.msg, "name": data.name});
}

// Socket client has disconnected
function onClientDisconnect() {
	util.log(playerById(this.id).name + "(" + this.id + ") left the game.");

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove-player", {id: this.id});
}

// New player has joined
function onNewPlayer(data) {
	util.log(data.name + "(" + this.id + ") joined the game.");

	// Create a new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	newPlayer.name = data.name;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new-player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), name: newPlayer.name});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new-player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), name: existingPlayer.name});
	}
		
	// Add new player to the players array
	players.push(newPlayer);
}

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move-player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
}


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	}
	
	return false;
}


/**************************************************
** RUN THE GAME
**************************************************/
init();
