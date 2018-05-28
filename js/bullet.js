class Bullet {
	constructor (pos, direction, id) {
		if (id === "normalBullet") {
			this.spriteX = 0;
			this.might = 4;
		}
		else if (id === "fireBullet") {
			this.spriteX = 1;
			this.might = 4;
		}
		this.size = new Vector(0.5, 0.5);
		if (direction === true) {
			this.pos = new Vector(pos.x + 1.3, pos.y + 0.4);
			this.speed = new Vector(16, 0);
		}
		else {
			this.pos = new Vector(pos.x - 1.1, pos.y + 0.4);
			this.speed = new Vector(-16, 0);
		}
	}
}
Bullet.prototype.type = 'bullet';

Bullet.prototype.act = function(step, level) {
	var newPos = this.pos.plus(this.speed.times(step));
	if (!level.obstacleAt(newPos, this.size) || level.obstacleAt(newPos, this.size) === '') {
		this.pos = newPos;
	}
	else if (this.repeatPos) {
		this.pos = this.repeatPos;
	}
	else {
		level.actors = level.actors.filter(element => element !== this);
	}
};