engine.Gun = function(player) {
	this.player = player;
	this.rotation = 0;
	this.lastFire = 0;
	this.fireInterval = 0.1;
	this.bulletsPerFire = 1;
};

engine.Gun.prototype.fire = function(e) {
	if (e.time - this.lastFire > this.fireInterval) {
		this.lastFire = e.time;
		var offset, i, l, rotation = this.rotation;
		var spread;
		if (this.bulletsPerFire === 1) {
			offset = engine.Utils.rand(-0.02, 0.02);
			e.game.state.bullets.create(this.player, this.rotation + offset, this.player.color, this.player.vx, this.player.vy);
		} else {
			spread = Math.PI / 30 * this.bulletsPerFire;
			for (i = 0; i < this.bulletsPerFire; i++) {
				rotation = (this.rotation - spread / 2) + (spread * i / (this.bulletsPerFire-1));
				offset = engine.Utils.rand(-0.02, 0.02);
				e.game.state.bullets.create(this.player, rotation + offset, this.player.color, this.player.vx, this.player.vy);
			}
		}
		return true;
	}
	return false;
};

engine.Bullet = function(p, rotation, color, vxAdd, vyAdd) {
	this.isBullet = true;
	this.shooter = p;

	if (p) {
		var cos = Math.cos(rotation);
		var sin = Math.sin(rotation);

		this.radius = 15;
		this.x = this.renderX = p.x + cos * this.radius;
		this.y = this.renderY = p.y + sin * this.radius;
		this.prevX = this.x;
		this.prevY = this.y;
		this.rotation = rotation;
		this.prevRotation = this.rotation;
		this.renderRotation = this.rotation;
		this.speed = 350;
		this.color = color;
		this.vx = Math.cos(rotation) * this.speed + vxAdd;
		this.vy = Math.sin(rotation) * this.speed + vyAdd;

		var t = engine.textureCache["bullet_"+color];
		if (!t) {
			t = engine.textureCache["bullet_"+color] = engine.Utils.cache(this.radius * 2, this.radius * 2, function(ctx, w, h) {
				// Scale 'em to allow the blur
				w *= 0.9;
				h *= 0.9;
				ctx.translate(w/2, h/2);
				engine.gfx.path(ctx, [
					[w/2, 0],
					[w*0.1, h*0.2],
					[-w/2, 0],
					[w*0.2, -h*0.2]
				]);
				ctx.shadowColor = color;
				ctx.shadowBlur = 5;
				engine.gfx.fill(ctx, color);
			});
		}

		this.texture = t;
	}
};

engine.Bullet.prototype.render = function(e) {
	e.ctx.save();
	e.ctx.translate(this.renderX, this.renderY);
	e.ctx.rotate(this.renderRotation);
	e.ctx.drawImage(this.texture, -this.radius, -this.radius);
	e.ctx.restore();
};

engine.Bullet.prototype.update = function(e) {
	this.prevX = this.x;
	this.prevY = this.y;
	this.prevRotation = this.rotation;
	this.x += this.vx * e.dt;
	this.y += this.vy * e.dt;
};

engine.Bullet.explode = function(enemy, particles) {
	engine.Particle.create(enemy.x, enemy.y, 0, engine.Utils.randInt(8, 12), enemy.color, particles);
	engine.Particle.create(enemy.x, enemy.y, 20, engine.Utils.randInt(5, 13), enemy.color, particles);
};

engine.Bullet.prototype.destroy = function() {
	this.shooter = null;
	this.texture = null;
};