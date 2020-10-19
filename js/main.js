engine.Utils.addEventListener(window, "load", setupGame);

function setupGame() {
	engine.vendorPrefix = (function(ua) {
	    var ret = "";
	    if (/webkit/.test(ua)) {
	        ret = "webkit";
	    } else if (/MSIE|Trident/.test(ua)) {
	        ret = "ms";
	    } else if (/opera/.test(ua)) {
	        ret = "o";
	    } else if (navigator.product === "Gecko") {
	        ret = "moz";
	    }
	    return ret;
	})(navigator.userAgent.toLowerCase());

	var game = new engine.Game(900, 680, "game", "ui", "wrapper");
	loadTextures(game);

	alert("Press ENTER to start");

	game.setState(engine.states.play);

	log.debug("Game running.");

	if (engine.DEBUG) {
		initStats(game);
		initGUI(game);

    	var keys = engine.keys = {};
    	keys["left"] = keys["right"] = 0;
    	keys["up"] = keys["down"] = 0;

    	engine.Utils.addEventListener(document, "keydown", function(e) {
    		var code = e.keyCode;
    		handleKey(code, 1);
    	});

    	engine.Utils.addEventListener(document, "keyup", function(e) {
    		var code = e.keyCode;
    		handleKey(code, 0);
    	});

    	function handleKey(code, isDown) {
    		switch (code) {
    			case 37:
    				keys["left"] = isDown;
    				break;
    			case 38:
    				keys["up"] = isDown;
    				break;
    			case 39:
    				keys["right"] = isDown;
    				break;
    			case 40:
    				keys["down"] = isDown;
    				break;
    			case 66:
    				keys["b"] = isDown;
    				break;
    			case 70:
    				keys["f"] = isDown;
    				break;
    			default:
    				break;
    		}
    	}
    }
}

function loadTextures(game) {
	engine.textureCache["hexGrid"] = engine.Utils.cache(game.width, game.height, function(ctx, w, h) {
		var hexagonAngle = 30 * Math.PI / 180;
		var size = 20;
		var hexagonRadius = Math.cos(hexagonAngle) * size;
		var hexagonRadiusY = Math.sin(hexagonAngle) * size;
		var hexagonHeight = size * 2;
		// var hexagonWidth = Math.sqrt(3) / 2 * hexagonHeight;
		var hexagonWidth = hexagonRadius * 2;

		var rows = Math.ceil(h / (hexagonRadiusY + size));
		var cols = Math.ceil(w / hexagonWidth);
		var spacing = 5;
		rows -= Math.floor((spacing * rows) / (hexagonRadiusY + size)) - 2;
		cols -= Math.floor((spacing * cols) / hexagonWidth) - 2;

		ctx.strokeStyle = "rgba(20,20,20,0.15)";
		ctx.translate(-hexagonWidth / 2, -hexagonHeight / 2);

		for (var r = 0; r < rows; r++) {
			for (var q = 0; q < cols; q++) {
				if (engine.Utils.rand() < 1.55) drawHexagon(
					q * (hexagonWidth + spacing) + ((r % 2) * hexagonWidth/2),
					r * (hexagonRadiusY + size + spacing),
					false
				);
			}
		}

		function drawHexagon(x, y, fill) {
			ctx.beginPath();
			ctx.moveTo(x + hexagonWidth/2, y);
			ctx.lineTo(x + hexagonWidth, y + size / 2);
			ctx.lineTo(x + hexagonWidth, y + 3 * size / 2);
			ctx.lineTo(x + hexagonWidth/2, y + hexagonHeight);
			ctx.lineTo(x, y + 3 / 2 * size);
			ctx.lineTo(x, y + size / 2);
			ctx.closePath();

			if (fill) {
				ctx.fill();
			} else {
				ctx.stroke();
			}
		}
	});

	// Cache textures (including white).
	engine.Utils.each(engine.data.players, function(o, i) {
		engine.textureCache[engine.Types.getPlayerName(i)] = engine.Utils.cache(o.radius * 2, o.radius * 2, function(ctx) {
			ctx.translate(o.radius, o.radius);
			engine.gfx.path(ctx, o.polygon.map(function(v) {
				return [v[0] * o.radius, v[1] * o.radius];
			}));
			ctx.strokeStyle = o.color;
			ctx.stroke();
		});
		engine.textureCache[engine.Types.getPlayerName(i) + "_white"] = engine.Utils.cache(o.radius * 2, o.radius * 2, function(ctx) {
			ctx.translate(o.radius, o.radius);
			engine.gfx.path(ctx, o.polygon.map(function(v) {
				return [v[0] * o.radius, v[1] * o.radius];
			}));
			ctx.strokeStyle = "#fff";
			ctx.stroke();
		});
	});

	engine.Utils.each(engine.data.enemies, function(o, i) {
		engine.textureCache[engine.Types.getEnemyName(i)] = engine.Utils.cache(o.radius * 2, o.radius * 2, function(ctx) {
			var radius = o.radius * 0.8;
			ctx.translate(radius, radius);
			engine.gfx.path(ctx, o.polygon.map(function(v) {
				return [v[0] * radius, v[1] * radius];
			}));
			ctx.shadowColor = o.color;
			ctx.shadowBlur = 7;
			ctx.strokeStyle = o.color;
			ctx.stroke();
		});
		engine.textureCache[engine.Types.getEnemyName(i) + "_white"] = engine.Utils.cache(o.radius * 2, o.radius * 2, function(ctx) {
			var radius = o.radius * 0.8;
			ctx.translate(radius, radius);
			engine.gfx.path(ctx, o.polygon.map(function(v) {
				return [v[0] * radius, v[1] * radius];
			}));
			ctx.shadowColor = "#fff";
			ctx.shadowBlur = 7;
			ctx.strokeStyle = "#fff";
			ctx.stroke();
		});
	});

	engine.Utils.each(engine.data.powerups, function(o, i) {
		engine.textureCache[engine.Types.getPowerupName(i)] = engine.Utils.cache(o.radius * 2, o.radius * 2, function(ctx) {
			ctx.translate(o.radius, o.radius);
			engine.gfx.path(ctx, o.polygon.map(function(v) {
				return [v[0] * o.radius, v[1] * o.radius];
			}));
			ctx.strokeStyle = o.color;
			ctx.stroke();
		});
	});
}

function initStats(game) {
	game._fps = new Stats();
	game._processing = new Stats();
	game._memory = new Stats();
	game._enemies = new Stats();
	game._bullets = new Stats();
	game._particles = new Stats();
	game._enemiesPanel = game._enemies.addPanel( new Stats.Panel( 'enemies', '#ff8', '#221' ) );
	game._bulletsPanel = game._bullets.addPanel( new Stats.Panel( 'bullets', '#8ff', '#122' ) );
	game._particlesPanel = game._particles.addPanel( new Stats.Panel( 'particles', '#f8f', '#212' ) );
	game._fps.dom.style.left = '0px';
	game._processing.dom.style.left = '100px';
	game._memory.dom.style.left = '200px';
	game._enemies.dom.style.left = '300px';
	game._bullets.dom.style.left = '400px';
	game._particles.dom.style.left = '500px';
	game._fps.showPanel(0);
	game._processing.showPanel(1);
	game._memory.showPanel(2);
	game._enemies.showPanel(3);
	game._bullets.showPanel(3);
	game._particles.showPanel(3);
//	document.body.appendChild(game._fps.dom);
//	document.body.appendChild(game._processing.dom);
//	document.body.appendChild(game._memory.dom);
//	document.body.appendChild(game._enemies.dom);
//	document.body.appendChild(game._bullets.dom);
//	document.body.appendChild(game._particles.dom);
}

function initGUI(game) {
	var gui = new dat.GUI();

	// var folder = gui.addFolder("Debug");
	// folder.open();
//	gui.add(engine.DEBUG, "debugDraw");
//	gui.add(engine.states.play, "fillAlpha").min(0).max(1).step(0.01);
//	gui.close();
}
