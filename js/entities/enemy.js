engine.Enemy = function(x, y, type) {
	var data = engine.data.enemies[type];

	engine.Utils.merge(this, data);

	this.type = type;
	this.x = this.renderX = this.prevX = x;
	this.y = this.renderY = this.prevY = y;
	this.rotation = this.renderRotation = this.prevRotation = this.heading = 0;
	this.vx = 0;
	this.vy = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.state = "fresh";

	this.hit = false;
	this.dropsMultiplier = typeof data.dropsMultiplier === "undefined" ? true : false;

	this.texture = engine.textureCache[engine.Types.getEnemyName(type)];
	this.whiteTexture = engine.textureCache[engine.Types.getEnemyName(type) + "_white"];

	this.spawnedTime = 0;
	this.spawnDuration = 1.5;
};

engine.Utils.merge(engine.Enemy.prototype, {
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
					e.ctx.scale(this.scaleX, this.scaleY);
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
					// Initialize commands
					this.thrust(engine.Utils.rand(engine.TWOPI));
					this.state = "alive";
				}
				break;
			case "alive":
				this.behaviour(e);
				this.integrateVelocity(e.dt);
				break;
		}
	},

	slowDown: function(slow) {
		this.vx *= slow;
		this.vy *= slow;
	},

	thrust: function(dir) {
		if (dir == undefined) dir = this.rotation;
		this.heading = dir;
		this.vx = Math.cos(dir) * this.speed;
		this.vy = Math.sin(dir) * this.speed;
	},

	integrateVelocity: function(dt) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	},

	receiveDamage: function(dealer) {
		this.energy -= dealer.damage;
		this.hit = true;
		if (this.energy < 0) {
			this.energy = 0;
			this.state = "dead";
		}
		return this.is("dead");
	},

	destroy: function(e) {
		this.texture = this.whiteTexture = null;
		this.behaviour = null;
	}
});