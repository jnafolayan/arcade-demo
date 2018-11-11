engine.Player = function(id, x, y, type) {
	var data = engine.data.players[type];

	this.x = this.prevX = this.renderX = x;
	this.y = this.prevY = this.renderY = y;
	this.radius = data.radius;
	this.rotation = this.prevRotation = this.renderRotation = 0;
	this.vx = 0;
	this.vy = 0;
	this.state = "fresh";

	this.id = id;
	this.speed = 200;
	this.thrusting = true;
	this.color = data.color;

	this.energy = this.fullEnergy = 100;
	this.damage = 2;
	this.bombCount = 1;
	this.nextBomb = 5000;
	this.hit = false;

	this.texture = engine.textureCache[engine.Types.getPlayerName(type)];
	this.whiteTexture = engine.textureCache[engine.Types.getPlayerName(type) + "_white"];

	this.spawnedTime = 0;
	this.spawnDuration = 0.5;

	this.weapon = new engine.Gun(this);
};

engine.Utils.merge(engine.Player.prototype, {
	is: function(state) {
		return this.state === state;
	},

	render: function(e) {
		e.ctx.save();
			e.ctx.translate(this.renderX, this.renderY);
			e.ctx.rotate(this.renderRotation);
			switch (this.state) {
				case "spawning":
					var scale = (e.time - this.spawnedTime) / this.spawnDuration;
					scale = engine.Utils.clamp(scale, 0, 1);
					e.ctx.scale(scale, scale);
					// fall-through
				case "alive":
					// Thrust
					var velSq = this.vx * this.vx + this.vy * this.vy;
					var thrustThreshold = 13 * 13;
					if (velSq > thrustThreshold) {
						engine.gfx.path(e.ctx, [
							[-8, -2],
							[-velSq/4000 - engine.Utils.rand(9, 12) | 0, 0],
							[-8, 2]
						], true);
						engine.gfx.stroke(e.ctx, this.color);
					}
					
					e.ctx.shadowColor = this.hit ? "#fff" : this.color;
					e.ctx.shadowBlur = 12;
					e.ctx.drawImage(this.hit ? this.whiteTexture : this.texture, -this.radius, -this.radius);
					this.hit = false;
					break;
			}
		e.ctx.restore();
	},

	update: function(e) {
		this.prevX = this.x;
		this.prevY = this.y;
		this.prevRotation = this.rotation;
		switch (this.state) {
			case "fresh":
				this.spawnedTime = e.time;
				this.state = "spawning";
				break;
			case "spawning": 
				if (e.time - this.spawnedTime > this.spawnDuration) {
					this.state = "alive";
				}
				break;
			case "alive": 
				if (e.game.state.scores[this.id] > this.nextBomb) {
					this.nextBomb += 5000;
					this.bombCount++;
				}
				
				if (!this.thrusting) {
					this.vx *= 0.95;
					this.vy *= 0.95;
				}
				this.thrusting = false;
				this.x += this.vx * e.dt;
				this.y += this.vy * e.dt;
				break;
		}
	},

	receiveDamage: function(dealer) {
		this.energy -= dealer.damage;
		if (this.energy < 0) {
			this.energy = 0;
			this.state = "dead";
		}
		this.hit = true;
		return this.state === "dead";
	},

	activateBomb: function(state) {
		if (this.bombCount > 0) {
			this.bombCount--;
			state.enemies.each(function(enemy) {
				engine.Bullet.explode(enemy, state.particles);
				state.enemies.remove(enemy);
			}, true);
		}
	},

	thrust: function() {
		if (!this.is("alive")) return;
		this.vx = Math.cos(this.rotation) * this.speed;
		this.vy = Math.sin(this.rotation) * this.speed;
		this.thrusting = true;
	},

	reverse: function() {
		if (!this.is("alive")) return;
		// Reversing is much slower than thrusting
		var slow = 0.4;
		this.vx = Math.cos(this.rotation) * -this.speed * slow;
		this.vy = Math.sin(this.rotation) * -this.speed * slow;
		// this.thrusting = false;
	},

	fire: function(e) {
		if (this.weapon.fire(e)) {
			// Play sound
		}
	}
});