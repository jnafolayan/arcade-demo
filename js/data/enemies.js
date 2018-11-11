engine.data = engine.data || {};

function createStar(sides, angleOffset, noCurve) {
	var v = [];
	var innerRadius = 1 / 4;
	for (var i = 0; i < sides; i++) {
		var angle = engine.TWOPI * i / sides;
		v.push([Math.cos(angle - angleOffset) * innerRadius, Math.sin(angle - angleOffset) * innerRadius]);
		v.push([Math.cos(angle), Math.sin(angle)]);
		if (noCurve) {
			v.push([Math.cos(angle+offset) * innerRadius, Math.sin(angle+offset) * innerRadius]);
		}
	}
	return v;
}

engine.data.enemies = [
	// Wanderer - Wanders through the screen. Easy to kill. Big damage.
	{
		radius: 20,
		speed: 45,
		damage: 10,
		energy: 2,
		color: "hsl(280, 100%, 60%)",
		polygon: [
			[1,0],
			[0,1],
			[-1,0],
			[0,-1]
		],
		behaviour: function(e) {
			// Randomly change direction
			if (engine.Utils.rand() < 0.008) {
				this.thrust(engine.Utils.rand(engine.TWOPI));
			}
		}
	},
	// Kite - Moves towards the target. Exist in swarms. Very easy to kill. Deals little damage.
	{
		radius: 9,
		speed: 55,
		damage: 4,
		energy: 1,
		color: "hsl(340, 100%, 60%)",
		polygon: [
			[1,0],
			[0.3,1],
			[-1,0],
			[0.3,-1]
		],
		behaviour: function(e) {
			// Slow turning. Faces heading.
			var angle = engine.Utils.angleBetween(this, this.target);
			var wrappedAngle = engine.Utils.wrapAngle(angle);

			var angleDiff = wrappedAngle - engine.Utils.wrapAngle(this.heading);
			var dir = this.heading;

			if (angleDiff > 0) {
				dir += 2 * e.dt;
			}
			else {
				dir -= 2 * e.dt;
			}

			if (engine.Utils.sqrDist(this, this.target) > 500) {
				this.thrust(dir);
				this.rotation = this.heading;
			} else {
				this.slowDown(0.95);
			}
		}
	},
	// Star
	{
		radius: 15,
		speed: 85,
		damage: 30,
		energy: 2,
		color: "hsl(140, 100%, 60%)",
		polygon: createStar(4, 0.1, false),
		behaviour: function(e) {
			// Spins. Closes in on the target.
			this.rotation += 0.05;

			var angle = engine.Utils.angleBetween(this, this.target);
			var wrappedAngle = engine.Utils.wrapAngle(angle);

			var angleDiff = wrappedAngle - engine.Utils.wrapAngle(this.heading);
			var dir = this.heading;

			// Quick turning
			if (angleDiff > 0) {
				dir += 7 * e.dt;
			}
			else {
				dir -= 7 * e.dt;
			}

			if (engine.Utils.sqrDist(this, this.target) > 500) {
				this.thrust(dir);
			} else {
				this.slowDown(0.95);
			}
		}
	},
	// Thorn
	{
		radius: 10,
		speed: 0,
		damage: 20,
		energy: 8,
		color: "hsla(20, 70%, 50%, 0.7)",
		polygon: createStar(8, 0.9, false),
		behaviour: function(e) {
			this.vx = this.vy = 0;
		}
	},
	// Snake
	{
		radius: 11,
		speed: 80,
		color: "hsl(200, 100%, 60%)",
		energy: 8, // Decided based on arm count.
		damage: 22,
		polygon: [
			[1,0],
			[0,1],
			[-1,0],
			[0,-1]
		],
		behaviour: function(e) {
			// Not too slow turning. Faces heading.
			var angle = engine.Utils.angleBetween(this, this.target);
			var wrappedAngle = engine.Utils.wrapAngle(angle);

			var angleDiff = wrappedAngle - engine.Utils.wrapAngle(this.heading);
			var dir = this.heading;

			if (angleDiff > 0) {
				dir += 12 * e.dt;
			}
			else {
				dir -= 12 * e.dt;
			}

			if (engine.Utils.sqrDist(this, this.target) > 500) {
				this.thrust(dir);
				this.rotation = this.heading;
			} else {
				this.slowDown(0.95);
			}

			this.iks.drag(this.x, this.y);

			engine.Utils.each(this.bodies, function(b) {
				b.x = b.arm.x;
				b.y = b.arm.y;
				b.rotation = b.arm.angle;
			});
		},

		ondestroy: function(state) {
			engine.Utils.each(this.bodies, function(body) {
				engine.Bullet.explode(body, state.particles);
				state.enemies.remove(body);
			});
			this.bodies = null;
		}
	},
	// n-headed snake
	{
		radius: 11,
		speed: 50,
		color: "hsl(200, 100%, 60%)",
		energy: 8, // Decided based on arm count.
		damage: 22,
		polygon: [
			[1,0],
			[0,1],
			[-1,0],
			[0,-1]
		],
		behaviour: function(e) {
			var angle = this.angleBase + Math.sin(this.iks.tick++ / this.anglePeriod) * Math.PI/2;
			var x = this.xBase + Math.cos(angle) * this.radiusBase;
			var y = this.yBase + Math.sin(angle) * this.radiusBase;

			this.iks.reach(x, y);

			engine.Utils.each(this.bodies, function(b) {
				b.x = b.arm.x;
				b.y = b.arm.y;
				b.rotation = b.arm.angle;
			});

			this.x = this.arm.x;
			this.y = this.arm.y;
		},

		ondestroy: function(state) {
			engine.Utils.each(this.bodies, function(body) {
				engine.Bullet.explode(body, state.particles);
				state.enemies.remove(body);
			});
			this.bodies = null;
		}
	},
	// Splitter
	{
		radius: 18,
		speed: 100,
		damage: 20,
		energy: 6,
		color: "hsl(0, 80%, 50%)",
		polygon: createStar(5, 0.1, false),
		behaviour: function(e) {
			// Spins. Closes in on the target.
			this.rotation += 0.05;

			var angle = engine.Utils.angleBetween(this, this.target);
			var wrappedAngle = engine.Utils.wrapAngle(angle);

			var angleDiff = wrappedAngle - engine.Utils.wrapAngle(this.heading);
			var dir = this.heading;

			// Quick turning
			if (angleDiff > 0) {
				dir += 5 * e.dt;
			}
			else {
				dir -= 5 * e.dt;
			}

			if (engine.Utils.sqrDist(this, this.target) > 500) {
				this.thrust(dir);
			} else {
				this.slowDown(0.95);
			}
		},
		ondestroy: function(state) {
			var eX = this.x + Math.cos(this.heading - Math.PI / 2) * 10; 
			var eY = this.y + Math.sin(this.heading - Math.PI / 2) * 10; 
			var e;
			state.enemies.add(e = new engine.Enemy(eX, eY, engine.Types.SPLITTER_MINI));
			e.target = this.target;
			eX = this.x + Math.cos(this.heading + Math.PI / 2) * 10; 
			eY = this.y + Math.sin(this.heading + Math.PI / 2) * 10; 
			state.enemies.add(e = new engine.Enemy(eX, eY, engine.Types.SPLITTER_MINI));
			e.target = this.target;
		}
	},
	// Splitter mini
	{
		radius: 12,
		speed: 110,
		damage: 20,
		energy: 6,
		color: "hsl(0, 80%, 50%)",
		polygon: createStar(5, 0.1, false),
		behaviour: function(e) {
			// Spins. Closes in on the target.
			this.rotation += 0.05;

			var angle = engine.Utils.angleBetween(this, this.target);
			var wrappedAngle = engine.Utils.wrapAngle(angle);

			var angleDiff = wrappedAngle - engine.Utils.wrapAngle(this.heading);
			var dir = this.heading;

			// Quick turning
			if (angleDiff > 0) {
				dir += 5 * e.dt;
			}
			else {
				dir -= 5 * e.dt;
			}

			if (engine.Utils.sqrDist(this, this.target) > 500) {
				this.thrust(dir);
			} else {
				this.slowDown(0.95);
			}
		}
	}
];