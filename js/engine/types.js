engine.Types = {
	WANDERER: 0,
	KITE: 1,
	STAR: 2,
	THORN: 3,
	SNAKE: 4,
	N_SNAKE: 5,
	SPLITTER: 6,
	SPLITTER_MINI: 7,

	SCORE_MULTIPLIER: 0,
	BULLETS_INC: 1,

	PLAYER_0: 0,
	PLAYER_1: 1
};

engine.Types.getEnemyName = function(type) {
	switch (type) {
		case engine.Types.WANDERER:
			return "wanderer";
		case engine.Types.KITE:
			return "kite";
		case engine.Types.STAR:
			return "star";
		case engine.Types.THORN:
			return "thorn";
		case engine.Types.SNAKE:
			return "snake";
		case engine.Types.N_SNAKE:
			return "n_snake";
		case engine.Types.SPLITTER:
			return "splitter";
		case engine.Types.SPLITTER_MINI:
			return "splitter_mini";
		default:
			return "unknown";
	}
};

engine.Types.getPowerupName = function(type) {
	switch (type) {
		case engine.Types.SCORE_MULTIPLIER:
			return "score_multiplier";
		case engine.Types.BULLETS_INC:
			return "bullets_inc";
		default:
			return "unknown";
	}
};

engine.Types.getPlayerName = function(type) {
	switch (type) {
		case engine.Types.PLAYER_0:
			return "player0";
		case engine.Types.PLAYER_1:
			return "player1";
		default:
			return "unknown";
	}
};