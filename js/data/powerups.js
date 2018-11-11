engine.data = engine.data || {};

engine.data.powerups = [
	{
		radius: 5,
		color: "hsl(150, 100%, 60%)",
		polygon: [
			[1,0],
			[-1,1],
			[-1,-1]
		],
		oncollected: function(player, state) {
			state.scoreMultipliers[player.id]++;
		}
	},
	{
		radius: 11,
		color: "hsl(220, 100%, 65%)",
		polygon: [
			[1,0.5],
			[-1,0.5],
			[-1,-0.5],
			[1,-0.5]
		],
		oncollected: function(player, state) {
			if (player.weapon.bulletsPerFire < 4) {
				player.weapon.bulletsPerFire++;
			}
		}
	}
];