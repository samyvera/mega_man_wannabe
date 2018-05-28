var getCpuArrows = (level, step) => {
	var arrows = {left:false, up:false, right:false, shoot:false};

	if (level.cpu.direction === true && level.cpu.pos.x < level.player.pos.x ||
		level.cpu.direction === false && level.cpu.pos.x > level.player.pos.x) {
		var cpuFacePlayer = true;
	}
	else {
		var cpuFacePlayer = false;
	}

	if (level.cpu.pos.x > level.player.pos.x + level.cpu.size.x*15 && cpuFacePlayer === true ||
		level.cpu.pos.x > level.player.pos.x + level.cpu.size.x && cpuFacePlayer === false ||
		level.cpu.isInvincible === true && cpuFacePlayer === true && level.cpu.direction === false) {
		arrows.left = true;
	}
	if (level.cpu.pos.x < level.player.pos.x + level.cpu.size.x && cpuFacePlayer === false ||
		level.cpu.pos.x < level.player.pos.x - level.cpu.size.x*15 && cpuFacePlayer === true ||
		level.cpu.isInvincible === true && cpuFacePlayer === true && level.cpu.direction === true) {
		arrows.right = true;
	}


	if (level.cpu.status !== "shooting" &&
		level.cpu.status !== "hit") {
		arrows.shoot = true;
	}
	
	if (level.obstacleAt(level.cpu.pos.plus(new Vector(level.cpu.size.x, 0)), level.cpu.size) ||
		level.obstacleAt(level.cpu.pos.plus(new Vector(-level.cpu.size.x, 0)), level.cpu.size) ||
		level.cpu.pos.y > level.player.pos.y*1.1) {
		arrows.up = true;
	}

	return arrows;
}