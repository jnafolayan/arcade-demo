var SummonFactory = {};

SummonFactory.summon = function(type) {
	var builder = SummonFactory.builders[type];
	if (builder) {
		builder();
	} else {
		log.error("No builder available for the " + getEnemyName(type) + " enemy type.");
	}
};

SummonFactory.builders = [];

SummonFactory.builders[KITE] = function() {
	var radius = rand(60, 80);
	var centerX = rand(radius, W - radius);
	var centerY = rand(radius, H - radius);

	var n = Math.floor(radius / 5);
	for (var i = 0; i < n; i++) {
		var angle = PI2 * i / n;
		var e = createEnemy(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, KITE);
		e.target = pick(players);
	}
}

SummonFactory.builders[STAR] = function() {
	var radius = 100;
	var n = 5;
	if (!player) return;
	for (var i = 0; i < n; i++) {
		var angle = PI2 * i / n;
		var player = pick(players);
		var e = createEnemy(player.x + Math.cos(angle) * radius, player.y + Math.sin(angle) * radius, STAR);
		e.target = player;
	}
}

SummonFactory.builders[BOB] = function() {
	var r = 15;
	var xNumber = W / r;
	var yNumber = H / r;
	for (var x = r; x < W;) {
		var e = createEnemy(x, r, STAR);
		e.target = pick(players);
		e.bobData = { x: [H - r, r ] };
		x += r;
	}
	for (var x = r; x < W;) {
		var e = createEnemy(x, H - r, STAR);
		e.bobData = { x: [r, H - r ] };
		x += r;
	}
}

SummonFactory.builders[SNAKE] = function() {
	var data = enemiesData[SNAKE];
	var armCount = ~~rand(13, 19);
 	
 	var iks = createIKSystem(rand(armCount*10, W - armCount*10), rand(armCount*10, H - armCount*10));
 	var angle = rand(PI2);
 	var player = pick(players);
 	var bodies = [];

 	for (var i = 0; i < armCount; i++) {
 		var arm = iks.addArm(data.bodyRadius * 2, angle);
 		var e = createEnemy(arm.x, arm.y, KITE);
 		e.arm = arm;
 		e.behaviours = [];
 		e.lives = 10000;
 		bodies.push(e);
 	}

 	var head = createEnemy(arm.x, arm.y, SNAKE);
 	head.target = player;
 	head.iks = iks;
 	head.bodies = bodies;
 	head.lives = armCount;
 	head.killPoints = armCount * enemiesData[KITE].killPoints;
}