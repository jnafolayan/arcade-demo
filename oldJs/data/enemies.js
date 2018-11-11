var enemiesData = [];

// Kites are well, kites. They track the player in swarms.
enemiesData[KITE] = {
	radius: 8,
	speed: 100,
	hue: 60,
	saturation: 100,
	lightness: 60,
	killPoints: 20,
	lives: 2,
	verts: [
		[7,0],
		[2,5],
		[-8.5,0],
		[2,-5]
	],
	behaviours: ["chase", "lookAt"]
};

function createStar(sides, radius, angleOffset, noCurve) {
	var v = [];
	var innerRadius = radius / 4;
	for (var i = 0; i < sides; i++) {
		var angle = PI2 * i / sides;
		v.push([Math.cos(angle - angleOffset) * innerRadius, Math.sin(angle - angleOffset) * innerRadius]);
		v.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
		if (noCurve) {
			v.push([Math.cos(angle+offset) * ir, Math.sin(angle+offset) * ir]);
		}
	}
	return v;
}

enemiesData[STAR] = {
	radius: 13,
	speed: 70,
	hue: 300,
	saturation: 100,
	lightness: 60,
	killPoints: 40,
	verts: createStar(3, 13, 0.3),
	behaviours: ["chase", "spin"]
};

enemiesData[SNAKE] = {
	speed: 80,
	radius: 8,
	hue: 200,
	saturation: 100,
	lightness: 60,
	bodyRadius: 8,
	lives: 6,
	verts: [
		[8,0],
		[0,8],
		[-8,0],
		[0,-8]
	],
	behaviours: ["chase", "lookAt", "snake"]
};