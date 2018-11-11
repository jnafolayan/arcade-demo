engine.data = engine.data || {};

engine.data.waves = [
	{
		enemies: [6,6,0,0,1,0],
		interval: 4,
		expiry: 12
	},
	{
		enemies: [0,0,1,1,1,0,0],
		interval: 3,
		expiry: 10
	},
	{
		enemies: [1,1,1,0,2,2,1],
		interval: 5,
		expiry: 13
	},
	{
		enemies: [2,3,1,3,3,2,3],
		interval: 3.9,
		expiry: 11
	},
	{
		enemies: [3,1,3,4,2,3,3],
		interval: 3,
		expiry: 10
	},
	{
		enemies: [4,1,2,4,2,2,1],
		interval: 3,
		expiry: 13
	},
	{
		enemies: [5],
		once: true,
		interval: 3,
		expiry: 10
	},
	{
		enemies: [6, 6, 6, 2, 2, 1, 4, 5, 2, 3, 3, 0],
		interval: 4,
		expiry: 20
	},
	{
		enemies: [0,0,0,0,1,2],
		interval: 2,
		expiry: 10
	},
	{
		enemies: [1, 6, 2, 0, 0, 2],
		interval: 4,
		expiry: 15
	},
	{
		// Infinite mode
		enemies: [0,0,0,1,1,1,1,2,2,2,3,3,4,4,4,5,5,6,6,6,6],
		interval: 4,
		expiry: 0
	}
];