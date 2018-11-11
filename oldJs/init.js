var player,
	players = [],
	summons = [],
	enemies = [],
	bullets = [],
	particles = [],
	playerVerts = [[8,0],[-8,6],[-6,0],[-8,-6]],
	// All entities can rotate 360deg per second. Tune with inertia.
	rotSpeed = PI2,

	maxLives = 5,
	waveIndex = 0,
	score = 0;

if (DEBUG) {
	player = createPlayer(W/2, H/2, 200);
}