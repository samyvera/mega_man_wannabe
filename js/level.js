var scale = 32;
var maxStep = 0.5;

var actorChars = {
	'@': Unit,
	'$': Unit
};

class Level {
	constructor (plan) {
		this.width = plan[0].length;
		this.height = plan.length;
		this.grid = [];
		this.actors = [];

		for (let y = 0; y < this.height; y++) {
			var line = plan[y], gridLine = [];
			for (let x = 0; x < this.width; x++) {
				var ch = line[x], fieldType = null;
				var Actor = actorChars[ch];
				if (Actor) {
					this.actors.push(new Actor(new Vector(x, y), ch));
				}
				else if (ch === '!') { fieldType = 'spike'; } 
				else if (ch === '|') { fieldType = 'spike-2'; }
				else if (ch === 'x') { fieldType = 'cross'; }

				else if (ch === '1') { fieldType = 'rock-1'; }
				else if (ch === '2') { fieldType = 'rock-2'; }
				else if (ch === '3') { fieldType = 'rock-3'; }
				else if (ch === '4') { fieldType = 'rock-4'; }
				else if (ch === '5') { fieldType = 'rock-5'; }
				else if (ch === '6') { fieldType = 'rock-6'; }

				else if (ch === 'a') { fieldType = 'wall-a'; }
				else if (ch === 'b') { fieldType = 'wall-b'; }
				else if (ch === 'c') { fieldType = 'wall-c'; }
				else if (ch === 'd') { fieldType = 'wall-d'; }

				else if (ch === 'e') { fieldType = 'mt-e'; }
				else if (ch === 'f') { fieldType = 'mt-f'; }
				else if (ch === 'g') { fieldType = 'mt-g'; }
				else if (ch === 'h') { fieldType = 'mt-h'; }
				else if (ch === 'i') { fieldType = 'mt-i'; }
				else if (ch === 'j') { fieldType = 'mt-j'; }
				else if (ch === 'k') { fieldType = 'mt-k'; }
				else if (ch === 'l') { fieldType = 'mt-l'; }
				else if (ch === 'm') { fieldType = 'mt-m'; }
				else if (ch === 'n') { fieldType = 'mt-n'; }
				else if (ch === 'o') { fieldType = 'mt-o'; }
				else if (ch === 'p') { fieldType = 'mt-p'; }
				else if (ch === 'q') { fieldType = 'mt-q'; }
				else if (ch === 'r') { fieldType = 'mt-r'; }
				else if (ch === 's') { fieldType = 'mt-s'; }
				else if (ch === 't') { fieldType = 'mt-t'; }
				else if (ch === 'u') { fieldType = 'mt-u'; }
				else if (ch === 'v') { fieldType = 'mt-v'; }
				else if (ch === 'w') { fieldType = 'mt-w'; }


				gridLine.push(fieldType);
			}
			this.grid.push(gridLine);
		}

		this.player = this.actors.filter(actor => {
			return actor.type === 'unit' && actor.id === "player";
		})[0];
		this.cpu = this.actors.filter(actor => {
			return actor.type === 'unit' && actor.id === "cpu";
		})[0];
		this.status = this.finishDelay = null;
	}
}
Level.prototype.isFinished = function() {
	return this.status != null & this.finishDelay < 0;
};

Level.prototype.obstacleAt = function(pos, size) {
	var xStart = Math.floor(pos.x);
	var xEnd = Math.ceil(pos.x + size.x);
	var yStart = Math.floor(pos.y);
	var yEnd = Math.ceil(pos.y + size.y);

	if (xStart < 0 || xEnd > this.width || yStart < 0) {
		return "wall";
	}
	if (yEnd > this.height) {
		return "void";
	}
	for (let y = yStart; y < yEnd; y++) {
		for (let x = xStart; x < xEnd; x++) {
			var fieldType = this.grid[y][x];
			if (
				fieldType === "spike" || fieldType === "spike-2" ||
				fieldType === "rock-1" || fieldType === "rock-2" ||
				fieldType === "rock-3" || fieldType === "rock-5" ||
				fieldType === "rock-5" || fieldType === "rock-6" ||
				fieldType === "wall-a" || fieldType === "wall-b" ||
				fieldType === "wall-c" || fieldType === "wall-d" ||
				fieldType === "cross"
			) {
				return fieldType;
			}
		}
	}
};

Level.prototype.actorAt = function(actor) {
	for (let i = 0; i < this.actors.length; i++) {
		var other = this.actors[i];
		if (other != actor &&
				actor.pos.x + actor.size.x > other.pos.x &&
				actor.pos.x < other.pos.x + other.size.x &&
				actor.pos.y + actor.size.y > other.pos.y &&
				actor.pos.y < other.pos.y + other.size.y) {
			return other;
		}
	}
};

Level.prototype.animate = function(step, keys, cpuKeys) {
	if (this.status != null) {
		this.finishDelay -= step;
	}
	while (step > 0) {
		var thisStep = Math.min(step, maxStep);
		this.actors.forEach( actor => {
			actor.act(thisStep, this, keys, cpuKeys);
		}, this);
		step -= thisStep;
	}
};

Level.prototype.unitTouched = function(unit, type, actor) {
	if (type === "unit" && unit.id === "player" && unit.isInvincible === false) {
		unit.life -= actor.might;
		unit.isInvincible = true;
		unit.invincibleCoolDown = 100;
		unit.status = "hit";
		unit.speed.y = -unit.knockbackSpeed;
	}
	else if (type == "bullet" && unit.isInvincible === false) {
		this.actors = this.actors.filter(element => element !== actor);
		unit.life -= actor.might;
		unit.isInvincible = true;
		unit.invincibleCoolDown = 100;
		unit.status = "hit";
		unit.speed.y = -unit.knockbackSpeed;
	}
	else if (type == "spike" && unit.isInvincible === false || type == "spike-2" && unit.isInvincible === false) {
		if (unit.id === "player") {
			unit.life -= unit.life;
			unit.status = "hit";
		}
		else if (unit.id === "cpu") {
			unit.life -= 4;
			unit.isInvincible = true;
			unit.invincibleCoolDown = 100;
			unit.status = "hit";
			unit.speed.y = -unit.knockbackSpeed;
		}
	}
	else if (type == "void") {
		unit.isInvincible = false;
		unit.invincibleCoolDown = 0;
		unit.life -= unit.life;
		unit.status = "hit";
	}
};