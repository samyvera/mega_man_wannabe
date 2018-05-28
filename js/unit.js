class Unit {
	constructor (pos, ch) {
		this.pos = pos.plus(new Vector(0.16, -0.5));
		this.size = new Vector(0.75, 1.5);
		this.speed = new Vector(0, 0);

		this.knockbackSpeed = 6;

		this.baseLife = 32;
		this.life = 32;

		this.status = null;
		this.isInvincible = false;

		if (ch == "@") {
			this.id = "player";
			this.sprites = "img/player.png";
			this.bulletId = "normalBullet";
			this.direction = true;

			this.gravity = 40;
			this.playerXSpeed = 8;
			this.jumpSpeed = 20;
		}
		else if (ch == "$") {
			this.id = "cpu";
			this.might = 8;
			this.sprites = "img/cpu.png";
			this.bulletId = "fireBullet";
			this.direction = false;

			this.gravity = 35;
			this.playerXSpeed = 6;
			this.jumpSpeed = 20;
		}
	}
}
Unit.prototype.type = 'unit';

Unit.prototype.moveX = function(step, level) {
	this.speed.x = 0;
	if (this.controls[0]) {
		this.speed.x -= this.playerXSpeed;
		this.direction = false;
	}
	if (this.controls[2]) {
		this.speed.x += this.playerXSpeed;
		this.direction = true;
	}

	var motion = new Vector(this.speed.x * step, 0);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if (obstacle) {
		level.unitTouched(this, obstacle);
	}
	else {
		this.pos = newPos;
	}
};

Unit.prototype.moveY = function(step, level) {
	this.speed.y += step * this.gravity;
	var motion = new Vector(0, this.speed.y * step);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if (obstacle) {
		level.unitTouched(this, obstacle);
		if (this.controls[1] && this.speed.y > 0) {
			this.speed.y = -this.jumpSpeed;
		}
		else {
			this.speed.y = 0;
		}
	}
	else {
		this.pos = newPos;
	}
};

Unit.prototype.shoot = function(step, level) {
	if (!this.controls[3]) {
		this.justShot = false;
		if (this.shootCoolDown <= 0 && this.controls === "shooting") {
			this.status = null;
		}
	}
	if (this.controls[3] && !this.justShot) {

		var bullet = new Bullet(this.pos, this.direction, this.bulletId);
		level.actors.push(bullet);

		this.shootCoolDown = 16;
		this.justShot = true;
	}
	if (this.shootCoolDown > 0) {
		this.shootCoolDown--;

		if (this.shootCoolDown <= 0) {
			this.status = null;
		}
	}
	if (this.controls[3] && this.status === null) {
		this.shootCoolDown = 16;
		this.status = "shooting";
	}
}

Unit.prototype.knockback = function(step, level) {
	this.speed.y += step * this.gravity;
	this.speed.x = 0;
	if (this.direction === true) {
		this.speed.x -= this.knockbackSpeed;
	}
	if (this.direction === false) {
		this.speed.x += this.knockbackSpeed;
	}

	var motion = new Vector(0, this.speed.y * step);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if (obstacle) {
		level.unitTouched(this, obstacle);
		this.status = null;
	}
	else {
		this.pos = newPos;
	}
	var motion = new Vector(this.speed.x * step, 0);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if (obstacle) {
		level.unitTouched(this, obstacle);
		this.speed.x = 0;
	}
	else {
		this.pos = newPos;
	}
}

Unit.prototype.getControls = function(keys, cpuKeys) {
	if (this.id === "player") {
		this.controls = [
			keys.left,
			keys.up,
			keys.right,
			keys.shoot
		]
	}
	else if (this.id === "cpu") {
		this.controls = [
			cpuKeys.left,
			cpuKeys.up,
			cpuKeys.right,
			cpuKeys.shoot
		]
	}
}

Unit.prototype.act = function(step, level, keys, cpuKeys) {
	this.getControls(keys, cpuKeys);

	if (this.isInvincible === true) {
		this.invincibleCoolDown--;
		if (this.invincibleCoolDown <= 0) {
			this.isInvincible = false;
		}
	}
	if (this.life <= 0 && level.finishDelay === null) {
		this.status = "hit";
	}

	if (this.status === null || this.status === "shooting") {
		var otherActor = level.actorAt(this);
		if (otherActor) {
			level.unitTouched(this, otherActor.type, otherActor);
		}

		this.moveX(step, level);
		this.moveY(step, level);
		this.shoot(step, level);
	}
	if (this.status === "hit") {
		if (this.life > 0) {
			this.knockback(step, level);
		}
		else {
			this.status = "dead";
			level.finishDelay = 1;
		}
	}

	if (this.status === "dead" && this.id === "player") {
		level.status = "lost";
	}
	if (this.status === "dead" && this.id === "cpu") {
		level.status = "won";
	}
};