var flipHorizontally = (context, around) => {
	context.translate(around, 0);
	context.scale(-1, 1);
	context.translate(-around, 0);
}

class CanvasDisplay {
	constructor (parent, level) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = Math.min(720, level.width * scale);
		this.canvas.height = Math.min(608, level.height * scale);
		parent.appendChild(this.canvas);
		this.cx = this.canvas.getContext("2d");
		this.cx.imageSmoothingEnabled = false;

		this.level = level;
		this.animationTime = 0;
		this.flipUnit = false;

		this.viewport = {
			left: 0,
			top: 0,
			width: this.canvas.width / scale,
			height: this.canvas.height / scale
		};

		this.drawFrame(0);
	}
}

CanvasDisplay.prototype.clear = function() {
 	this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.drawFrame = function(step) {
	this.animationTime += step;

	this.updateViewport();
	this.clearDisplay();
	this.drawBackground();
	this.drawActors();
	this.drawHUD();
};

CanvasDisplay.prototype.updateViewport = function() {
	var view = this.viewport;
	var player = this.level.player;
	var marginWidth = view.width / 2;
	var marginHeight = view.height / 3;
	var center = player.pos;

	if (center.x < view.left + marginWidth) {
		view.left = Math.max(center.x - marginWidth, 0);
	}
	else if (center.x > view.left + view.width - marginWidth) {
		view.left = Math.min(center.x + marginWidth - view.width,
			this.level.width - view.width);
	}
	if (center.y < view.top + marginHeight) {
    	view.top = Math.max(center.y - marginHeight, 0);
	}
	else if (center.y > view.top + view.height - marginHeight) {
    	view.top = Math.min(center.y + marginHeight - view.height,
			this.level.height - view.height);
	}
};

CanvasDisplay.prototype.clearDisplay = function() {
	if (this.level.status === "won") {
		this.cx.fillStyle = "rgb(252, 124, 60)";
	}
	else if (this.level.status === "lost") {
		this.cx.fillStyle = "rgb(0, 0, 0)";
	}
	else {
		this.cx.fillStyle = "rgb(60, 188, 252)";
	}
	this.cx.fillRect(0, 0,
		this.canvas.width, this.canvas.height);
};

var otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function() {
var view = this.viewport;
var xStart = Math.floor(view.left);
var xEnd = Math.ceil(view.left + view.width);
var yStart = Math.floor(view.top);
var yEnd = Math.ceil(view.top + view.height);

for (let y = yStart; y < yEnd; y++) {
	for (let x = xStart; x < xEnd; x++) {
		var tile = this.level.grid[y][x];
		if (tile == null) {
			continue;
		}
		var screenX = (x - view.left) * scale;
		var screenY = (y - view.top) * scale;
		var tileX;
		var tileY;

		     if (tile === "rock-1") { tileX = 0; tileY = 0; }
		else if (tile === "rock-2") { tileX = scale; tileY = 0; }
		else if (tile === "rock-3") { tileX = scale*2; tileY = 0; }
		else if (tile === "rock-4") { tileX = 0; tileY = scale; }
		else if (tile === "rock-5") { tileX = scale; tileY = scale; }
		else if (tile === "rock-6") { tileX = scale*2; tileY = scale; }

		else if (tile === "wall-a") { tileX = scale*4; tileY = 0; }
		else if (tile === "wall-b") { tileX = scale*3; tileY = 0; }
		else if (tile === "wall-d") { tileX = scale*3; tileY = scale; }
		else if (tile === "wall-c") { tileX = scale*4; tileY = scale; }

		else if (tile === "mt-e") { tileX = 0; tileY = scale*2; }
		else if (tile === "mt-f") { tileX = scale; tileY = scale*2; }
		else if (tile === "mt-g") { tileX = scale*2; tileY = scale*2; }
		else if (tile === "mt-h") { tileX = scale*3; tileY = scale*2; }
		else if (tile === "mt-i") { tileX = scale*4; tileY = scale*2; }
		else if (tile === "mt-j") { tileX = scale*5; tileY = scale*2; }

		else if (tile === "mt-k") { tileX = 0; tileY = scale*3; }
		else if (tile === "mt-l") { tileX = scale; tileY = scale*3; }
		else if (tile === "mt-m") { tileX = scale*2; tileY = scale*3; }
		else if (tile === "mt-n") { tileX = scale*3; tileY = scale*3; }
		else if (tile === "mt-o") { tileX = scale*4; tileY = scale*3; }
		else if (tile === "mt-p") { tileX = scale*5; tileY = scale*3; }

		else if (tile === "mt-q") { tileX = 0; tileY = scale*4; }
		else if (tile === "mt-r") { tileX = scale; tileY = scale*4; }
		else if (tile === "mt-s") { tileX = scale*2; tileY = scale*4; }
		else if (tile === "mt-t") { tileX = scale*3; tileY = scale*4; }
		else if (tile === "mt-u") { tileX = scale*4; tileY = scale*4; }
		else if (tile === "mt-v") { tileX = scale*5; tileY = scale*4; }

		else if (tile === "mt-w") { tileX = scale*5; tileY = scale*5; }
		else if (tile === "spike") { tileX = scale*5; tileY = 0; }
		else if (tile === "spike-2") {tileX = scale*4; tileY = scale*5; }
		else if (tile === "cross") { tileX = scale*5; tileY = scale; }

		this.cx.drawImage(otherSprites,
			tileX,     tileY, scale, scale,
			screenX, screenY, scale, scale);
		}
	}
};

CanvasDisplay.prototype.drawUnit = function(x, y, width, height, actor) {
	var spriteX;
	var spriteY;
	var unit = actor;

	if (unit.status === null || unit.status === "shooting") {
		spriteY = (unit.status === "shooting" ? 1 : 0); spriteX = 4;
		if (unit.speed.x != 0) { spriteX = Math.floor(this.animationTime * 8) % 4; }
		if (unit.speed.y != 0) { spriteX = 5; }
	}
	else if (unit.status === "hit") {
		spriteY = 2; spriteX = 0;
	}
	if (unit.isInvincible) {
		if(Math.floor(this.animationTime * 24) % 2) { spriteY = -1; }
	}
	if (unit.status === "dead") {
		spriteY = 2; spriteX = 0;
	}

	this.cx.save();
	if (!unit.direction) {
		flipHorizontally(this.cx, x + width / 2);
	}
	var unitSprites = document.createElement("img");
	unitSprites.src = actor.sprites;
	this.cx.drawImage(unitSprites,
		spriteX * (width * 3), spriteY * (height * 2), width * 3, height * 2,
		x - width, y - (height / 2),    width * 3, height * 2);
	this.cx.restore();
};

CanvasDisplay.prototype.drawActors = function() {
	this.level.actors.forEach( actor => {
		var width = actor.size.x * scale;
		var height = actor.size.y * scale;
		var x = (actor.pos.x - this.viewport.left) * scale;
		var y = (actor.pos.y - this.viewport.top) * scale;
		
		if (actor.type == "bullet") {

			var bulletSprite = document.createElement("img");
			bulletSprite.src = "img/bullet.png";

			var tileX = actor.spriteX * width;
			this.cx.drawImage(bulletSprite,
				tileX, 0, width, height,
				x,     y, width, height);
		}
		else if (actor.type == "unit") {
			this.drawUnit(x, y, width, height, actor);
		}
	}, this);
};

var healthBar = document.createElement("img");
healthBar.src = "img/healthBar.png";

CanvasDisplay.prototype.drawHUD = function() {
	this.level.actors.forEach( actor => {
		if (actor.id === "player" || actor.id === "cpu") {
			var xHUD = (actor.id === "player" ? scale : scale*2);
			for (let i = 0; i < actor.baseLife; i++) {
				var width = scale/2;
				var height = scale/8;
				var tileY = (actor.id === "player" ? 4 : 8);
				var x = xHUD;
				var y = scale*8 - height*(i+1);
				this.cx.drawImage(healthBar,
				0, 0, width, height,
				x, y, width, height);
				if (actor.life - 1 >= i) {
					this.cx.drawImage(healthBar,
						0, tileY, width, height,
						x,     y, width, height);
				}
			}
		}
	}, this);
}