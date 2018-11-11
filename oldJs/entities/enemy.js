function scheduleSummon(type, delay, oninit) {
	summons.push({
		type: type,
		t: delay,
		oninit: oninit || no0p
	});
}

function updateSummons() {
	var i = summons.length;
	var s;
	while (i--) {
		s = summons[i];
		s.t -= dt;
		if (s.t <= 0) {
			s.oninit(SummonFactory.summon(s.type));
			summons.splice(i, 1);
		}
	}
}

var imageCache = {};

function createEnemy(x, y, type, dontAdd) {
	var data = enemiesData[type];

	if (!imageCache[getEnemyName(type)]) {
		var canvas = imageCache[getEnemyName(type)] = document.createElement("canvas");
		var context = canvas.getContext("2d");
		canvas.width = data.radius * 2;
		canvas.height = data.radius * 2;
		var tmp = ctx;

		ctx = context;
		ctx.translate(data.radius, data.radius);
		path(data.verts);
		ctx.shadowColor = "hsl(" + data.hue + ", " + data.saturation + "%, " + data.lightness + "%)";
		ctx.shadowBlur = 10;
		stroke("hsl(" + data.hue + ", " + data.saturation + "%, " + data.lightness + "%)");

		ctx = tmp;
	}


	var e = merge({
		x: x,
		y: y,
		angle: 0,
		vx: 0,
		vy: 0,
		targetAngleOffset: rand(-0.3, 0.3),
		state: "spawning",
		spawnTime: 2,
		createdTime: t,
		hit: false,
		lives: 1,
		type: type,
		image: imageCache[getEnemyName(type)]
	}, data);

	e.color = "hsl(" + e.hue + ", " + e.saturation + "%, " + e.lightness + "%)";
	enemies.push(e);

	return e;
}

var improviseWave = 5;
function updateWave() {
	// TODO: Recheck
	if (!players.length) return;
	if (waveIndex < waves.length && score > waves[waveIndex].score) {
		var wave = waves[waveIndex++];
		wave.setup();
	} else if (waveIndex >= waves.length) {
		var opts = [KITE, STAR, SNAKE];
		var n = ~~rand(10, 15);
		var i = 0;
		for (; i < n; i++) {
			waves.push({
				score: score + i * 2000 - 1 + rand(2000, 4000),
				setup: pick(waves).setup
			});
		}
	} else if (waveIndex < waves.length && score < waves[waveIndex].score && !enemies.length) {
		improviseWave -= dt;
		if (improviseWave <= 0) {
		console.log(9)
			improviseWave = 5;
			waves.unshift({
				score: score - 1,
				setup: waves.slice(0, waves.indexOf(waves[waveIndex]) + 1).setup
			});
		}
	}
}

function updateEnemy(e, i) {
	if (e.state === "spawning") {
		if (t - e.createdTime > e.spawnTime) {
			e.state = "alive";
		}
		return;
	}

	if (e.state === "dead" || e.lives <= 0) {
		enemies.splice(i, 1);
		createParticles(e.x, e.y, e.radius, ~~rand(10, 15), e.hue);
		if (e.bodies) {
			each(e.bodies, function(b) {
				b.dead = true;
			});
		}
		return;
	}

	each(e.behaviours, function(b) {
		Behaviours[b](e, e.target);
	});

	e.angle = wrapAngle(e.angle);

	e.x += e.vx * dt;
	e.y += e.vy * dt;

	keepInView(e);

	// var other = collide(e);
	// if (other) {
	// 	var r = (e.radius + other.radius) * 0.7;
	// 	var d = dist(e, other);
	// 	if (d < r) {
	// 		var normalX = (other.x - e.x) / d;
	// 		var normalY = (other.y - e.y) / d;
	// 		var sep = r - d;
	// 		e.x -= normalX * sep/2;
	// 		e.y -= normalY * sep/2;
	// 		other.x += normalX * sep/2;
	// 		other.y += normalY * sep/2;
	// 	}
	// }

	insertToHash(e);
}

function renderEnemy(e) {
	ctx.save();
	ctx.translate(e.x, e.y);

	if (e.state === "spawning") {
		var s = clamp((t - e.createdTime) / e.spawnTime, 0, 1);
		ctx.scale(s, s);
		ctx.beginPath();
		path(e.verts);
		ctx.globalAlpha = s;
		ctx.strokeStyle = e.color;
		ctx.stroke();
	} else {
		ctx.rotate(e.angle);
		ctx.drawImage(e.image, -e.radius, -e.radius);
	}

	// if (DEBUG) {
	// 	circ(0, 0, e.radius);
	// 	stroke("rgba(200, 50, 100, 0.3)");
	// }
	ctx.restore();

}