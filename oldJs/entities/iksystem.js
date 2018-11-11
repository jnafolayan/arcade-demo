function createArm(x, y, length, angle) {
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
}

function createIKSystem(x, y) {
	var iks = {
		x: x,
		y: y,
		arms: [],
		lastArm: null,

		addArm: function(length, angle) {
			var arm = createArm(0, 0, length, angle || 0);
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
		},

		drag: function(x, y) {
			var pos = { x: x, y: y };
			var arm = this.lastArm;
			while (arm) {
				arm.angle = angleBetween(arm, pos);
				arm.x = pos.x - Math.cos(arm.angle) * arm.length;
				arm.y = pos.y - Math.sin(arm.angle) * arm.length;
				pos = arm;
				arm = arm.parent;
			}
		},

		reach: function(x, y) {
			this.drag(x, y);
			this.update();
		},

		update: function() {
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
		},

		render: function() {
			ctx.save();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#00f";
			for (var i = 0; i < this.arms.length; i++) {
				var arm = this.arms[i];
				ctx.beginPath();
				ctx.moveTo(arm.x, arm.y);
				ctx.lineTo(arm.x + Math.cos(arm.angle) * arm.length, arm.y + Math.sin(arm.angle) * arm.length);
				ctx.stroke();
			}
			ctx.restore();
		}
	};
	return iks;
}