var raf = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		return setTimeout(callback, 1000 / 60);
	};


var dt = 0,
	lt = new Date().getTime(),
	t = 0,

	// Size
	lastSizeCheck = 0,
	sizeCheckInterval = 0.2;

function gameLogic() {
	if (DEBUG) {
		if (keys["left"]) {
			player.turning = -1;
		} else if (keys["right"]) {
			player.turning = 1;
		} else {
			player.turning = 0;
		}
		player.thrusting = Boolean(keys["up"]) ? 1 : Boolean(keys["down"]) ? -1 : 0;
		player.shooting = Boolean(keys["f"]);
	}

	updateWave();
	updateSummons();

	spatialHash = {};
	each(enemies, updateEnemy, true);
	each(bullets, updateBullet, true);
	each(players, updatePlayer, true);
	each(particles, updateParticle, true);
}

function renderGame() {
	ctx = gameCtx;

	ctx.globalAlpha = 1;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, W, H);
	ctx.globalAlpha = 1;

	ctx.save();

		ctx.globalCompositeOperation = "lighter";
		// Player
		each(players, renderPlayer);
		// Enemies
		each(enemies, renderEnemy);
		// Bullets
		each(bullets, renderBullet);
		// Particles
		each(particles, renderParticle);

	ctx.restore();

	// UI
	ctx = uiCtx;

	ctx.clearRect(0, 0, W, H);
	ctx.save();

		// Time
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "hsl(150, 100%, 60%)";
		font(formatTime(t), W * 0.5, 50, 1);
		ctx.restore();
		// Score
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "hsl(150, 100%, 60%)";
		font("TEAM SCORE", W * 0.95, 50, 1.3, -1);
		ctx.restore();

		ctx.save();
		ctx.strokeStyle = "hsl(150, 100%, 50%)";
		ctx.lineWidth = 1.4;
		font("" + score, W * 0.95, 70, 1.1, -1);
		ctx.restore();

		ctx.save();
		ctx.strokeStyle = "hsl(140, 100%, 50%)";
		var lifeW = 10;
		var spacing = 4;
		ctx.translate((W - (player.lives * lifeW + (player.lives-1) * spacing)) / 2 + lifeW/2, 80 + 4);
		for (var i = 0; i < player.lives; i++) {
			path([
				[ 0,-5],
				[ 5, 5],
				[ 0, 2],
				[-5, 5]
			]);
			ctx.stroke();
			ctx.translate(lifeW + spacing, 0);
		}
		ctx.restore();

		var mult = ""+player.scoreMult;
		ctx.save();
		ctx.strokeStyle = "hsl(150, 100%, 50%)";
		ctx.lineWidth = (t % 2 > 1) ? 2.0 : 1.5;
		font(mult, W * 0.95, 200, 2, -1);
		font("X", -getTextWidth(mult, 2) - 8, 7, 1.2, -1);
		ctx.restore();

	ctx.restore();
}

function loop() {	
	if(DEBUG){
		_fps_.begin();
	    _processing_.begin();
	    _memory_.begin();
	    _enemies_.begin();
	}

	var now = new Date().getTime();
	dt = (now - lt) / 1000;
	lt = now;

	// Cap at 1s
	if (dt > 1) return;

	t += dt;

	if (t - lastSizeCheck > sizeCheckInterval) {
		checkSize();
		lastSizeCheck = t;
	}

	switch (state) {
		case s_game:
			gameLogic();
			renderGame();
			break;
	}

	if(DEBUG){
	    _fps_.end();
	    _processing_.end();
	    _memory_.end();
	    _enemies_.end();
	    enemiesPanel.update(enemies?enemies.length:0, 1000);
	}

	raf(loop);
};

state = s_game;
raf(loop);