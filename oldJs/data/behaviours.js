var Behaviours = {};

Behaviours["chase"] = function(actor, target) {
	if (!target) {
		actor.vx *= 0.96;
		actor.vy *= 0.96;
		return;
	}

	// if (rand() < 0.2) {
		var angle = angleBetween(actor, target) + actor.targetAngleOffset;
		actor.targetAngle = angle;

		actor.vx = Math.cos(angle) * actor.speed;
		actor.vy = Math.sin(angle) * actor.speed;
	// }
};

Behaviours["lookAt"] = function(actor) {
	actor.angle = actor.targetAngle;
};

Behaviours["spin"] = function(actor) {
	actor.angle += rand(0.15);
};

Behaviours["snake"] = function(e) {
	e.iks.drag(e.x, e.y);

	each(e.bodies, function(b) {
		b.x = b.arm.x;
		b.y = b.arm.y;
		b.angle = b.arm.angle;
	});
};