var players = [];

function createPlayer(x, y, hue) {
	var p = {
		x: x,
		y: y,
		angle: 0,
		speed: 150,
		vx: 0,
		vy: 0,
		inertia: 2,
		invI: 1 / 2,
		thrusting: 0,
		turning: 0,
		friction: 0.97,
		radius: 10,
		hue: Math.floor(players.length / 3 * 360),
		score: 0,
		scoreMult: 1,
		lives: 3,
		lastShot: 0,
		shotInterval: 0.1,
		nextLife: rand(20, 30),
		dead: false,
		reviveTimeout: 0,
		nextScoreMult: rand(10, 15)
	};

	players.push(p);
	return p;
}

function renderPlayer(p) {
	if (p.reviveTimeout > 0) {
		circ(p.x, p.y, 10);
		fill("hsla(" + p.hue + ", 100%, 55%, 0.2)");
		return;
	}

	ctx.save();
	ctx.translate(p.x, p.y);
	ctx.rotate(p.angle);
	path(playerVerts);
	stroke("hsl(" + p.hue + ", 100%, 55%)");
	fill("hsla(" + p.hue + ", 100%, 55%, 0.2)");

	// Thrust
	var velSq = p.vx * p.vx + p.vy * p.vy;
	var thrustThreshold = 13 * 13;
	if (velSq > thrustThreshold) {
		path([
			[-8, -2],
			[-velSq/4000 - rand(9, 12) | 0, 0],
			[-8, 2]
		], true);
		ctx.stroke();
	}

	// if (DEBUG) {
	// 	circ(0, 0, p.radius);
	// 	stroke("rgba(200, 50, 100, 0.3)");
	// }
	ctx.restore();
}

function updatePlayer(p, i) {
	p.nextScoreMult -= dt;
	if (p.nextScoreMult <= 0) {
		p.scoreMult *= 2;
		p.nextScoreMult = rand(10, 15) * p.scoreMult / 5;
	}

	p.nextLife -= dt;
	if (p.nextLife <= 0) {
		p.lives++;
		if (p.lives > maxLives) {
			p.lives = maxLives;
		}
		p.nextLife = rand(20, 30);
	}

	if (p.turning !== 0) {
		p.angle += p.turning * rotSpeed * p.invI * dt;
	}

	p.angle = wrapAngle(p.angle);

	if (p.thrusting !== 0) {
		p.vx = Math.cos(p.angle) * p.speed * p.thrusting * (p.thrusting < 0 ? 0.55 : 1);
		p.vy = Math.sin(p.angle) * p.speed * p.thrusting * (p.thrusting < 0 ? 0.55 : 1);
	}

	if (p.shooting && t - p.lastShot > p.shotInterval) {
		p.lastShot = t;
		var offset = rand(-0.35, 0.35);
		var r = p.radius * 1.5;
		createBullet(p.x + Math.cos(p.angle+offset) * r, p.y + Math.sin(p.angle+offset) * r, p.angle, p.hue, p);
		// Reaction force
		p.vx -= Math.cos(p.angle) * 2;
		p.vy -= Math.sin(p.angle) * 2;
	}

	p.vx *= p.friction;
	p.vy *= p.friction;

	p.x += p.vx * dt;
	p.y += p.vy * dt;

	keepInView(p);

	var enemy = collide(p);

	if (p.reviveTimeout > 0) {
		p.reviveTimeout -= dt;
	}

	if (enemy && (p.reviveTimeout <= 0)) {
		createParticles(p.x, p.y, p.radius, ~~rand(10, 15), p.hue);
		enemy.lives--;
		enemy.dead = true;
		p.lives--;
		p.scoreMult = 1;

		if (p.lives <= 0) {
			players.splice(i, 1);
			each(enemies, function(e) {
				if (e.target === p) {
					e.target = pick(players) || { x: rand(W), y: rand(H) };
				}
			});
		} else {
			p.reviveTimeout = 4;
		}
	}
}