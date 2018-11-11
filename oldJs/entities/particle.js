function createParticles(x, y, radius, amt, hue) {
	var t = rand(0.2, 0.5);
	for (var i = 0; i < amt; i++) {
		var r = rand(radius * 0.1, radius);
		var angle = PI2 * i / amt;
		particles.push({
			x: x + Math.cos(angle) * r,
			y: y + Math.sin(angle) * r,
			angle: angle,
			radius: 2,
			hue: hue,
			t: t
		});
	}
}

function renderParticle(p) {
	circ(p.x, p.y, p.radius);
	ctx.fillStyle = "hsl(" + p.hue + ", 90%, 60%)";
	ctx.fill();
}

function updateParticle(p, i) {
	if ((p.t -= dt) <= 0) {
		particles.splice(i, 1);
		return;
	}

	p.x += Math.cos(p.angle) * rand(70, 120) * dt;
	p.y += Math.sin(p.angle) * rand(70, 120) * dt;
}