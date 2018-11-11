engine.states = engine.states || {};

engine.states.play = {
	enter: function() {
		this.waves = engine.data.waves;
		this.currentWave = 0;
		this.waveStart = 0;
		this.lastSpawn = 0;
		this.spawnCount = 0;
		this.fillAlpha = 0.2;

		this.gameOver = false;
		this.gameOverActive = false;
		this.gameWon = false;

		this.players = new engine.Group();

		this.bullets = new engine.Group(new engine.Pool(engine.Bullet, 50));
		this.particles = new engine.Group(new engine.Pool(engine.Particle, 100));
		this.enemies = new engine.Group();
		this.powerups = new engine.Group(new engine.Pool(engine.Powerup, 20));

		// Holds the individual scores. The players can access this array
		// with their indexes.
		this.scores = [];
		this.scoreMultipliers = [];
		// The global team score.
		this.score = 0;

		this.allObjects = new engine.Group();
		this.allObjects.add(this.players);
		this.allObjects.add(this.bullets);
		this.allObjects.add(this.particles);
		this.allObjects.add(this.enemies);

		// this.addPlayer(100, 100)

		this.waitingForPlayers = true;

		var _this = this;
		this._wrapObject = function(o) {
			_this.wrapObject(o);
		};

		if (engine.DEBUG && engine.DEBUG.playerControllable) {
			engine.Utils.addEventListener(document, "keyup", function(evt) {
				if (evt.key === "Enter") {
					_this.waitingForPlayers = false;
					_this.addPlayer(100, 150, engine.Types.PLAYER_0);

					engine.Utils.removeEventListener(document, "keyup", arguments.callee);
				}
			});
		}
	},

	addPlayer: function(x, y, type) {
		var id = this.players.length;
		this.scores[id] = 0;
		this.scoreMultipliers[id] = 1;
		this.players.add(new engine.Player(id, x, y, [0,1][id]));
	},

	render: function(e) {
		e.ctx.save();
			if (this.waitingForPlayers || this.gameOver) {
				e.ctx.globalAlpha = 0.3;
			} 
			else {
				e.ctx.globalAlpha = 1;
			}
			e.ctx.fillStyle = "rgba(0,0,0,"+this.fillAlpha+")";
			e.ctx.fillRect(0, 0, e.game.width, e.game.height);

			e.ctx.globalCompositeOperation = "lighter";

			e.ctx.drawImage(engine.textureCache["hexGrid"], 0, 0);

			this.enemies.callAll("render", false, e);
			this.players.callAll("render", false, e);
			this.bullets.callAll("render", false, e);
			this.powerups.callAll("render", false, e);
		e.ctx.restore();

		e.uiCtx.clearRect(0, 0, e.game.width, e.game.height);
		e.uiCtx.save();
		this.particles.callAll("render", false, e);
		e.uiCtx.restore();

		if (engine.DEBUG && engine.DEBUG.debugDraw) {
			this.allObjects.each(function(group) {
				group.each(function(obj) {
					engine.gfx.circ(e.uiCtx, obj.renderX, obj.renderY, obj.radius * engine.HIT_RADIUS);
					engine.gfx.stroke(e.uiCtx, "rgba(255, 80, 100, 0.5)");
				});
			});
		}

		this.renderUI(e);
	},

	renderUI: function(e) {
		var gfx = engine.gfx,
			ctx = e.uiCtx;
		ctx.save();

		ctx.shadowColor = "hsl(0, 0%, 100%)";
		ctx.shadowBlur = 10;

		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "hsl(0, 0%, 100%)";
		gfx.font(ctx, this.score, e.game.width * 0.99, e.game.height * 0.01, 2, -1);
		ctx.restore();

		if (engine.DEBUG && engine.DEBUG.playerControllable) {
			ctx.save();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "hsl(0, 0%, 100%)";
			gfx.font(ctx, "X" + this.scoreMultipliers[0], e.game.width * 0.99, e.game.height * 0.15, 2, -1);
			ctx.restore();
		}

		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "hsl(0, 0%, 100%)";
		gfx.font(ctx, "WAVE " + engine.Utils.padLeft(this.currentWave+1+"", 1), e.game.width * 0.5, e.game.height * 0.01, 1);
		ctx.restore();

		gfx.circ(ctx, e.game.width / 2, e.game.height / 2, 2);
		gfx.fill(ctx, "hsl(200, 100%, 60%)");
		gfx.circ(ctx, e.game.width / 2, e.game.height / 2, 8);
		gfx.stroke(ctx, "hsl(200, 100%, 60%)");

		ctx.restore();

		if (this.waitingForPlayers) {
			ctx.save();
			ctx.lineWidth = ~~e.time % 2 === 0 ? 2 : 1;
			ctx.strokeStyle = "hsl(0, 0%, 100%)";
			gfx.font(ctx, "WAITING FOR PLAYERS", e.game.width * 0.5, e.game.height * 0.4, 2, 0);
			ctx.restore();
		}

		if (this.gameOver) {
			ctx.save();
			ctx.lineWidth = ~~e.time % 2 === 0 ? 2 : 1;
			ctx.strokeStyle = "hsl(" + (this.gameWon ? 140 : 0) + ", 100%, 60%)";
			gfx.font(ctx, "GAME " + (this.gameWon ? "WON" : "LOST"), e.game.width * 0.5, e.game.height * 0.4, 4, 0);
			ctx.restore();
		}
	},

	update: function(e) {
		var i, j, l, particle, powerup, player, enemy, bullet, radius, group;

		if (this.waitingForPlayers) return;

		if (engine.DEBUG) {
			this._preUpdateDebug(e.game);

			var p = this.players.get(0);
			if (p && p.is("alive") && engine.DEBUG.playerControllable) {
				if (engine.keys["right"]) {
					p.rotation += 0.1;
					p.weapon.rotation += 0.1;
				}
				else if (engine.keys["left"]) {
					p.rotation -= 0.1;
					p.weapon.rotation -= 0.1;
				}
				if (engine.keys.up) {
					p.thrust();
				} else if (engine.keys.down) {
					p.reverse();
				}
				if (engine.keys.f) {
					p.fire(e);
				}
				if (engine.keys.b) {
					p.activateBomb(this);
				}
			}
		}

		if (this.players.length && !this.gameOverActive) {
			this.updateWaves(e);
		}

		this.enemies.callAll("update", false, e);
		this.players.callAll("update", false, e);
		this.bullets.callAll("update", false, e);
		this.particles.callAll("update", false, e);
		this.powerups.callAll("update", false, e);

		// Pool dead particles
		for (i = this.particles.length - 1; i >= 0; i--) {
			particle = this.particles.get(i);
			if (particle.alpha <= 0) {
				this.particles.remove(particle);
			}
		}

		for (i = this.powerups.length - 1; i >= 0; i--) {
			powerup = this.powerups.get(i);
			if (powerup.lifetime <= 0) {
				this.powerups.remove(powerup);
			}
		}

		// Remove off-screen bullets
		for (i = this.bullets.length - 1; i >= 0; i--) {
			bullet = this.bullets.get(i);
			if (bullet.x + bullet.radius < 0 || 
				bullet.x - bullet.radius > e.game.width || 
				bullet.y + bullet.radius < 0 || 
				bullet.y - bullet.radius > e.game.height
			) {
				this.bullets.remove(bullet);
			}
			else {
				// Bullets vs Enemies
				player = bullet.shooter;
				for (j = this.enemies.length - 1; j >= 0; j--) {
					enemy = this.enemies.get(j);
					if (!enemy.is("alive")) continue;

					radius = (bullet.radius + enemy.radius) * engine.HIT_RADIUS;

					// Avoiding square root call for performance.
					if (engine.Utils.sqrDist(bullet, enemy) < radius * radius) {
						if (enemy.receiveDamage(player)) {
							// Score
							this.scores[player.id] += 1 * this.scoreMultipliers[player.id];
							// Powerup
							var count = engine.Utils.randInt(2, enemy.type < 5 ? 1 + enemy.type : 5);
							while (enemy.dropsMultiplier && count--) {
								this.powerups.create(enemy.x, enemy.y, engine.Types.SCORE_MULTIPLIER);
							}

							if (engine.Utils.rand() < 0.025 && this.score > 5000 && !this.powerups.filter(function(p) {
									return p.type === engine.Types.BULLETS_INC;
								}).length
							) {
								this.powerups.create(enemy.x, enemy.y, engine.Types.BULLETS_INC);
							}

							engine.Bullet.explode(enemy, this.particles);

							if (enemy.ondestroy) {
								enemy.ondestroy(this);
							}

							this.enemies.remove(enemy);
						}
						this.bullets.remove(bullet);
						break;
					}
				}
			}
		}

		// Players vs Enemies/Powerups
		for (i = this.players.length - 1; i >= 0; i--) {
			player = this.players.get(i);
			if (!player.is("alive")) continue;

			for (j = this.enemies.length - 1; j >= 0; j--) {
				enemy = this.enemies.get(j);
				if (!enemy.is("alive")) continue;

				radius = (player.radius + enemy.radius) * engine.HIT_RADIUS;

				// Avoiding square root call for performance.
				if (engine.Utils.sqrDist(player, enemy) < radius * radius) {
					if (player.receiveDamage(enemy)) {
						engine.Bullet.explode(player, this.particles);
						this.players.remove(player);
					}

					engine.Bullet.explode(enemy, this.particles);

					if (enemy.ondestroy) {
						enemy.ondestroy(this);
					}

					this.enemies.remove(enemy);
					break;
				}
			}

			for (j = this.powerups.length - 1; j >= 0; j--) {
				powerup = this.powerups.get(j);
				radius = player.radius + powerup.radius + 10; // fatten the radius

				// Avoiding square root call for performance.
				if (engine.Utils.sqrDist(player, powerup) < radius * radius) {
					powerup.oncollected(player, this);
					this.powerups.remove(powerup);
					break;
				}
			}
		}

		this.score = this.scores.reduce(function(total, score) {
			return total + score;
		});

		this.players.each(this._wrapObject);
		this.enemies.each(this._wrapObject);

		if ((!this.players.length || this.players.score >= 50000) && !this.gameOverActive) {
			this.gameOverActive = true;
			var _this = this;
			setTimeout(function() {
				_this.gameOver = true;

				setTimeout(function() {
					_this.game.setState(_this);
				}, 4000);
			}, 3000);
		}

		if (engine.DEBUG) {
			this._postUpdateDebug(e.game);
		}
	},

	wrapObject: function(o) {
		if (o.x + o.radius < 0 || o.x - o.radius > this.game.width) {
			o.x = engine.Utils.wrap(o.x, -o.radius, this.game.width + o.radius);
			o.prevX = o.x;
		}
		if (o.y + o.radius < 0 || o.y - o.radius > this.game.height) {
			o.y = engine.Utils.wrap(o.y, -o.radius, this.game.height + o.radius);
			o.prevY = o.y;
		}
	},

	updateWaves: function(e) {
		if (this.currentWave >= this.waves.length) return;
		
		var wave = this.waves[this.currentWave];
		if (wave.expiry !== 0 && e.time - this.waveStart > wave.expiry) {
			wave = this.waves[++this.currentWave];
			this.waveStart = e.time;
			this.spawnCount = 0;
		}

		if (wave !== undefined && e.time - this.lastSpawn > wave.interval) {
			this.lastSpawn = e.time;
			if (!wave.once || (wave.once === true && this.spawnCount === 0)) {
				var type = engine.Utils.pick(wave.enemies);
				engine.EnemyFactory.summon(type, e);
				this.spawnCount++;
			}
		}
	},

	_preUpdateDebug: function(game) {
		game._fps.begin();
		game._processing.begin();
		game._memory.begin();
		game._enemies.begin();
		game._bullets.begin();
		game._particles.begin();
	},

	_postUpdateDebug: function(game) {
	    game._fps.end();
	    game._processing.end();
	    game._memory.end();
	    game._enemies.end();
	    game._bullets.end();
	    game._enemiesPanel.update(this.enemies.length, 1000);
	    game._bulletsPanel.update(this.bullets.length, 1000);
	    game._particlesPanel.update(this.particles.length, 1000);
	}
};