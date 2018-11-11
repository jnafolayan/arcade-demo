engine.Powerup = function(x, y, type) {
	if (arguments.length) {
		engine.Utils.merge(this, engine.data.powerups[type]);

		this.x = engine.Utils.rand(x - 50, x + 50);
		this.y = engine.Utils.rand(y - 50, y + 50);
		this.rotation = engine.Utils.rand(engine.TWOPI);

		this.type = type;
		this.alpha = 1;
		this.alphaChangePeriod = 1 / engine.Utils.rand(2, 6);
		this.texture = engine.textureCache[engine.Types.getPowerupName(type)];
		this.color = "hsl(140, 100%, 50%)";

		this.lifetime = engine.Utils.rand(4, 6);
	}
};

engine.Powerup.prototype.update = function(e) {
	this.rotation += 0.07;
	this.lifetime -= e.dt;
	this.alpha = 0.4 + Math.sin(e.time * this.alphaChangePeriod * engine.TWOPI) * 0.3; 
};

engine.Powerup.prototype.render = function(e) {
	e.ctx.save();
	e.ctx.translate(this.x, this.y);
	e.ctx.rotate(this.rotation);
	e.ctx.globalAlpha = this.alpha;
	e.ctx.drawImage(this.texture, -this.radius, -this.radius);
	e.ctx.restore();
};