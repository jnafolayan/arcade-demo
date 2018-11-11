engine.Command = function(obj) {
	this.obj = obj;
};

engine.Command.prototype.execute = function() {};

engine.Command.fromString = function(obj, str) {
	var Command = engine.Command._commands[str];
	if (Command) {
		return new Command(obj);
	} else {
		return null;
	}
};

// Randomly change direction
engine.Command.Wander = function(obj) {
	engine.Command.call(this, obj);

	this.executionTime = 0;
};

engine.Command.Wander.prototype.execute = function(e) {
	if (e.time > this.executionTime) {
		this.executionTime = e.time + engine.Utils.rand(this.obj.wander, this.obj.wander * 2);
		var dir = engine.Utils.rand() * engine.TWOPI;
		this.obj.vx = Math.cos(dir) * this.obj.speed;
		this.obj.vy = Math.sin(dir) * this.obj.speed;
	}
};

engine.Command.Spin = function(obj) {
	engine.Command.call(this, obj);

	this.speed = 5;
};

engine.Command.Spin.prototype.execute = function(e) {
	this.obj.rotation += this.speed * e.dt;
};

engine.Command.Chase = function(obj) {
	engine.Command.call(this, obj);

	this.rotationTarget = 0;
};

engine.Command.Chase.prototype.execute = function(e) {
	var angle = engine.Utils.angleBetween(this.obj, this.obj.target);
	var wrappedAngle = engine.Utils.wrapAngle(angle);

	var angleDiff = wrappedAngle - engine.Utils.wrapAngle(this.obj.rotation);
	var rotation = this.obj.rotation;

	if (angleDiff > 0) {
		rotation += this.speed * e.dt;
	}
	else {
		rotation -= this.speed * e.dt;
	}

	this.obj.rotation = rotation;
	this.obj.vx = Math.cos(rotation) * this.obj.speed;
	this.obj.vy = Math.sin(rotation) * this.obj.speed;
};

engine.Command._commands = {
	"wander": engine.Command.Wander,
	"spin": engine.Command.Spin,
	"chase": engine.Command.Chase
};