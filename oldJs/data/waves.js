var waves = [
	{
		score: -1,
		setup: function() {
			scheduleSummon(KITE, 1.5);
			scheduleSummon(KITE, 6.0);
			scheduleSummon(KITE, 12.0);
			scheduleSummon(KITE, 14.0);
		}
	},
	{
		score: 900,
		setup: function() {
			scheduleSummon(STAR, 1.5);
			scheduleSummon(STAR, 5.5);
			scheduleSummon(STAR, 8.5);
		}
	},
	{
		score: -1,
		setup: function() {
			scheduleSummon(SNAKE, 1.8);
			// scheduleSummon(KITE, 6.2);
		}
	}
];