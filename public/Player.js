/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		moveAmount = 2,
		name;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var update = function(keys) {
		var moved = false;
		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
			moved = true;
		} else if (keys.down) {
			y += moveAmount;
			moved = true;
		}

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
			moved = true;
		} else if (keys.right) {
			x += moveAmount;
			moved = true;
		}

		return moved;
	};

	var draw = function(ctx) {
		ctx.fillRect(x-5, y-5, 10, 10);
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw
	};
};