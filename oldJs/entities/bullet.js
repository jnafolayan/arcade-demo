function createBullet(x, y, angle, hue, sender) {
	var b = {
		x: x,
		y: y,
		angle: angle,
		radius: 3,
		hue: hue,
		speed: 200,
		sender: sender
	};

	bullets.push(b);
	return b;
}

function renderBullet(b) {
	circ(b.x, b.y, b.radius);
	ctx.fillStyle = "hsl(" + b.hue + ", 90%, 60%)";
	ctx.fill();
}

function updateBullet(b, i) {
	b.x += Math.cos(b.angle) * b.speed * dt;
	b.y += Math.sin(b.angle) * b.speed * dt;

	var obj = collide(b);
	if (obj && (obj.lives-- <= 0)) {
		console.log(score)
		b.sender.score += obj.killPoints * b.sender.scoreMult;
		score += obj.killPoints * b.sender.scoreMult;
		bullets.splice(i, 1);
		obj.dead = true;
	} else if (b.x + b.radius < 0 || b.x - b.radius > W || b.y + b.radius < 0 || b.y - b.radius > H) {
		bullets.splice(i, 1);
	}
}