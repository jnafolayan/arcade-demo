engine.EnemyFactory = {};

engine.EnemyFactory.summon = function(type, e) {
	var builder = engine.EnemyFactory.builders[type];
	if (builder) {
		builder(e);
	} else {
		log.error("No builder available for the " + engine.Types.getEnemyName(type) + " enemy type.");
	}
};

engine.EnemyFactory.builders = [];

engine.EnemyFactory.builders[engine.Types.WANDERER] = function(e) {
	var count = engine.Utils.randInt(3, 6);
	var border = 10;
	var x, y, r, iters, maxIters = 5;
	while (count--) {
		iters = 0;
		do {
			if (++iters > maxIters) break;
			x = engine.Utils.rand(border, e.game.width - border);
			y = engine.Utils.rand(border, e.game.width - border);
		} while (!e.game.state.players.filter(function(o) {
			return engine.Utils.sqrDist(o, { x: x, y: y }) < 30 * 30;
		}).length)

		var enemy = new engine.Enemy(x, y, engine.Types.WANDERER);
		e.game.state.enemies.add(enemy);
	}
};

engine.EnemyFactory.builders[engine.Types.KITE] = function(e) {
	var count = engine.Utils.randInt(4, 7), i;

	var summonX = engine.Utils.rand(e.game.width);
	var summonY = engine.Utils.rand(e.game.height);

	for (i = 0; i < count; i++) {
		var enemy = new engine.Enemy(summonX + engine.Utils.rand(-10, 10), summonY + engine.Utils.rand(-10, 10), engine.Types.KITE);
		enemy.target = engine.Utils.pick(e.game.state.players.children);
		e.game.state.enemies.add(enemy);
	}
};

engine.EnemyFactory.builders[engine.Types.STAR] = function(e) {
	var starRadius = 12;
	var radius = e.game.width / 2 * 0.35;
	var count = engine.Utils.randInt(5, 8), i;

	var summonY = engine.Utils.pick([e.game.height * 0.1, e.game.height * 0.85]);
	var summonX = (e.game.width - starRadius * 2 + 5 * (count-1)) / 2 + starRadius;
	for (i = 0; i < count; i++) {
		var enemy = new engine.Enemy(summonX, summonY, engine.Types.STAR);
		enemy.target = engine.Utils.pick(e.game.state.players.children);
		e.game.state.enemies.add(enemy);
		summonX += starRadius * 2 + 5;
	}
};

engine.EnemyFactory.builders[engine.Types.THORN] = function(e) {
	var count = engine.Utils.randInt(5, 7), i;

	var summonX = engine.Utils.rand(e.game.width);
	var summonY = engine.Utils.rand(e.game.height);

	for (i = 0; i < count; i++) {
		var enemy = new engine.Enemy(summonX + engine.Utils.rand(-30, 30), summonY + engine.Utils.rand(-30, 30), engine.Types.THORN);
		e.game.state.enemies.add(enemy);
	}
};

engine.EnemyFactory.builders[engine.Types.SNAKE] = function(e) {
	var armCount = engine.Utils.randInt(13, 19);
 	
 	var sisterSnake = e.game.state.enemies.filter(function(enemy) {
 		return enemy.type === engine.Types.SNAKE;
 	})[0];

 	var x, y;
 	if (sisterSnake) {
 		x = sisterSnake.x + engine.Utils.rand(-100, 100);
 		y = sisterSnake.y + engine.Utils.rand(-100, 100);
 	}
 	else {
 		x = engine.Utils.rand(armCount*10, e.game.width - armCount*10);
 		y = engine.Utils.rand(armCount*10, e.game.height - armCount*10);
 	}

 	var iks = new IKSystem(x, y);
 	var angle = engine.Utils.rand(engine.TWOPI);
 	var player = engine.Utils.pick(e.game.state.players.children);
 	var bodies = [];

 	for (var i = 0; i < armCount; i++) {
 		var enemy = new engine.Enemy(0, 0, engine.Types.KITE);
		e.game.state.enemies.add(enemy);
 		var arm = iks.addArm(enemy.radius * 2, angle);
 		angle += engine.TWOPI / armCount * 0.8;
 		enemy.x = arm.x;
 		enemy.y = arm.y;
 		enemy.arm = arm;
 		enemy.behaviour = engine.no0p;
 		enemy.energy = 1000000000000; // Can't be killed directly.
 		bodies.push(enemy);
 	}

 	var head = new engine.Enemy(arm.x, arm.y, engine.Types.SNAKE);
	e.game.state.enemies.add(head);
 	head.target = player;
 	head.iks = iks;
 	head.bodies = bodies;
 	head.energy = armCount / 1.1;
};

engine.EnemyFactory.builders[engine.Types.N_SNAKE] = function(e) {
	var snakeCount = snakeI = engine.Utils.randInt(4, 6);
	var baseAngle = engine.Utils.rand(engine.TWOPI);
	var armCount = engine.Utils.randInt(8, 10);

	while (snakeI--) {
		var angle = baseAngle + engine.TWOPI * snakeI / snakeCount;
	 	
	 	var x = e.game.width / 2;
	 	var y = e.game.height / 2;
	 	
	 	var iks = new IKSystem(x, y);
	 	var player = engine.Utils.pick(e.game.state.players.children);
	 	var bodies = [];

	 	for (var i = 0; i < armCount; i++) {
	 		var enemy = new engine.Enemy(0, 0, engine.Types.KITE);
			e.game.state.enemies.add(enemy);
	 		var arm = iks.addArm(enemy.radius * 2, angle);
	 		angle += engine.TWOPI / armCount * 0.2;
	 		enemy.x = arm.x;
	 		enemy.y = arm.y;
	 		enemy.arm = arm;
	 		enemy.behaviour = engine.no0p;
	 		enemy.energy = 1000000000000; // Can't be killed directly.
	 		bodies.push(enemy);
	 	}

	 	var head = new engine.Enemy(arm.x, arm.y, engine.Types.N_SNAKE);
		e.game.state.enemies.add(head);
	 	head.target = player;
	 	head.iks = iks;
	 	head.bodies = bodies;
	 	head.energy = armCount / 1.1;
	 	head.anglePeriod = engine.Utils.randInt(50, 90);
	 	head.angleBase = angle;
	 	head.xBase = x;
	 	head.yBase = y;
	 	head.radiusBase = bodies.reduce(function(t, enemy) {
	 		return t + enemy.radius * 2;
	 	}, 0);
	 	head.arm = iks.addArm(head.radius * 2, angle);
	 	iks.tick = 0;
	}
};

engine.EnemyFactory.builders[engine.Types.SPLITTER] = function(e) {
	var starRadius = 12;
	var radius = e.game.width / 2 * 0.35;
	var count = engine.Utils.randInt(1, 3), i;

	var summonX = engine.Utils.pick([engine.Utils.rand(e.game.width * 0.3), engine.Utils.rand(e.game.width * 0.8, e.game.width)]);
	var summonY = engine.Utils.pick([engine.Utils.rand(e.game.height * 0.3), engine.Utils.rand(e.game.height * 0.8, e.game.height)]);

	for (i = 0; i < count; i++) {
		var enemy = new engine.Enemy(summonX, summonY, engine.Types.SPLITTER);
		enemy.target = engine.Utils.pick(e.game.state.players.children);
		e.game.state.enemies.add(enemy);
		summonX += starRadius * 2 + 5;
	}
};