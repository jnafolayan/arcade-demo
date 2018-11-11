function IKSystem(x, y) {
	this.x = x;
	this.y = y;
	this.arms = [];
	this.lastArm = null;
}

IKSystem.prototype.createArm = function(x, y, length, angle) {
	var arm = {
		x: x,
		y: y,
		length: length,
		angle: angle,
		parent: null,
		endX: function() {
			return this.x + Math.cos(this.angle) * this.length;
		},
		endY: function() {
			return this.y + Math.sin(this.angle) * this.length;
		}
	};
	return arm;
};

IKSystem.prototype.addArm = function(length, angle) {
	var arm = this.createArm(0, 0, length, angle || 0);
	if (this.lastArm) {
		arm.x = this.lastArm.endX();
		arm.y = this.lastArm.endY();
		arm.parent = this.lastArm;
	} else {
		arm.x = this.x;
		arm.y = this.y;
	}
	this.lastArm = arm;
	this.arms.push(arm);
	return arm;
};

IKSystem.prototype.drag = function(x, y) {
	var pos = { x: x, y: y };
	var arm = this.lastArm;
	while (arm) {
		arm.angle = engine.Utils.angleBetween(arm, pos);
		arm.x = pos.x - Math.cos(arm.angle) * arm.length;
		arm.y = pos.y - Math.sin(arm.angle) * arm.length;
		pos = arm;
		arm = arm.parent;
	}
};

IKSystem.prototype.reach = function(x, y) {
	this.drag(x, y);
	this.update();
};

IKSystem.prototype.update = function(e) {
	for (var i = 0; i < this.arms.length; i++) {
		var arm = this.arms[i];
		if (arm.parent) {
			arm.x = arm.parent.endX();
			arm.y = arm.parent.endY();
		} else {
			arm.x = this.x;
			arm.y = this.y;
		}
	} 
};

IKSystem.prototype.render = function(e) {
	e.ctx.save();
	e.ctx.lineWidth = 3;
	e.ctx.strokeStyle = "#00f";
	for (var i = 0; i < this.arms.length; i++) {
		var arm = this.arms[i];
		e.ctx.beginPath();
		e.ctx.moveTo(arm.x, arm.y);
		e.ctx.lineTo(arm.x + Math.cos(arm.angle) * arm.length, arm.y + Math.sin(arm.angle) * arm.length);
		e.ctx.stroke();
	}
	e.ctx.restore();
};