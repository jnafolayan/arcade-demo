engine.Particle = function(x, y, rotation, color) {
	this.rotation = this.prevRotation = this.renderRotation = 0;

	if (arguments.length) {
		this.x = this.prevX = this.renderX = x;
		this.y = this.prevY = this.renderY = y;
		this.cosRotation = Math.cos(rotation);
		this.sinRotation = Math.sin(rotation);
		this.color = color;
		this.radius = 6;
		this.decay = engine.Utils.rand(0.6, 1.5);
		this.alpha = 1;
	}	
};

engine.Particle.prototype.render = function(e) {
	engine.gfx.circ(e.uiCtx, this.renderX, this.renderY, this.radius * this.alpha);
	// e.uiCtx.globalAlpha = this.alpha;
	engine.gfx.fill(e.uiCtx, this.color);
	e.uiCtx.globalAlpha = 1;
};

engine.Particle.prototype.update = function(e) {
	this.prevX = this.x;
	this.prevY = this.y;
	this.prevRotation = this.rotation;

	this.alpha -= this.decay * e.dt;
	if (this.alpha <= 0) {
		this.alpha = 0;
	}

	this.x += this.cosRotation * engine.Utils.rand(80, 130) * e.dt;
	this.y += this.sinRotation * engine.Utils.rand(80, 130) * e.dt;
};

engine.Particle.create = function(ex, ey, radius, count, color, group) {
	var i, x, y, rotation;
	for (i = 0; i < count; i++) {
		rotation = engine.TWOPI * i / count;
		scale = engine.Utils.rand();
		x = ex + Math.cos(rotation) * radius * scale;
		y = ey + Math.sin(rotation) * radius * scale;
		group.create(x, y, rotation, color);
	}
};