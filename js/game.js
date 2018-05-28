var arrowCodes = {37: "left", 87: "up", 39: "right", 88: "shoot"};

var trackKeys = codes => {
	var pressed = Object.create(null);
	var handler = event => {
		if (codes.hasOwnProperty(event.keyCode)) {
			var down = event.type == "keydown";
			pressed[codes[event.keyCode]] = down;
			event.preventDefault();
		}
	}
	addEventListener("keydown", handler);
	addEventListener("keyup", handler);
	return pressed;
}

var arrows = trackKeys(arrowCodes);

var runAnimation = frameFunc => {
 	var lastTime = null;
 	var frame = time => {
	   	var stop = false;
	   	if (lastTime != null) {
	   		var timeStep = Math.min(time - lastTime, 100) / 1000;
	   		stop = frameFunc(timeStep) === false;
	   	}
	   	lastTime = time;
	   	if (!stop) {
	   		requestAnimationFrame(frame);
	   	}
	}
	requestAnimationFrame(frame);
}

var runLevel = (level, Display, andThen) => {
	var display = new Display(document.body, level);
	runAnimation( step => {
		level.animate(step, arrows, getCpuArrows(level, step));
		display.drawFrame(step);
		if (level.isFinished()) {
			display.clear();
			if (andThen) {
				andThen(level.status);
			}
			return false;
		}
	});
}

var runGame = (plans, Display) => {
	var startLevel = n => {
		runLevel(new Level(plans[n]), Display, status => {
			if (status === 'lost') {
				console.log('You lost ...');
				startLevel(n);
			}
			else if (n < plans.length - 1) {
				startLevel(n + 1);
			}
			else {
				console.log('You win !');
				startLevel(n);
			}
		});
	}
	startLevel(0);
}