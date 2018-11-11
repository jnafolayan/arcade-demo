var KITE = 0,
	STAR = 1,
	BOB = 2,
	SNAKE = 3;

function getEnemyName(type) {
	switch (type) {
		case KITE:
			return "kite";
			break;
		case STAR:
			return "star";
			break;
		case BOB:
			return "bob";
			break;
		case SNAKE:
			return "snake";
			break;
		default:
			return "unknown";
			break;
	}
}