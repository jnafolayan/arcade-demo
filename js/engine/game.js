engine.Game = function(width, height, main, ui, wrapper) {
	var game = this;

	this.canvas = document.getElementById(main);
	this.uiCanvas = document.getElementById(ui);
	this.wrapper = document.getElementById(wrapper);

	this.context = this.canvas.getContext("2d");
	this.uiContext = this.uiCanvas.getContext("2d");

	this.resize(width, height);

	this.state = null;

	this.fps = 50;
	this.dt = 1/this.fps;
	this.time = 0;

	this.loopArg = {
		time: 0,
		dt: this.dt,
		ctx: this.context,
		uiCtx: this.uiContext,
		game: this
	};

	this.boundLoop = function() {
		game.loop();
	};

	engine.scheduleFrame(this.boundLoop);
};

engine.Utils.merge(engine.Game.prototype, {
	resize: function(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.uiCanvas.width = width;
		this.uiCanvas.height = height;

		this.width = width;
		this.height = height;
	},

	setupAirConsole: function() {
		var _this = this;
        var ac = this.airconsole = new AirConsole();

        ac.onConnect = function(device_id) {

        };

        ac.onDisconnect = function(device_id) {
          	var player = ac.convertDeviceIdToPlayerNumber(device_id);
          	if (player != undefined) {
            	ac.setActivePlayers(1);
          	}
        };

        ac.onMessage = function(device_id, data) {
	        var player = ac.convertDeviceIdToPlayerNumber(device_id);
          	if (player != undefined && player <= 2) {
          		if (data.btn_start === "down" && (!this.state || (this.state && this.state.gameOver))) {
          			_this.startState(engine.states.play);
          			setTimeout(function() {
          				_this.state.addPlayer(engine.Utils.rand(_this.width), engine.Utils.rand(_this.height));
          				if (player === 2) {
          					_this.state.addPlayer(engine.Utils.rand(_this.width), engine.Utils.rand(_this.height));
          				}
          			});
          		}
          		if (_this.state) {
      				var p = _this.state.players[player];
      				var pad = data.dpad;
      				var dir = pad && pad.directionchange;

      				if (p && p.is("alive")) {
      					if (pad && dir && dir.pressed) {
							if (dir.key === "left") {
								p.rotation -= 0.1;
								p.weapon.rotation -= 0.1;
							}
							else if (dir.key === "right") {
								p.rotation += 0.1;
								p.weapon.rotation += 0.1;
							}
							if (dir.key === "up") {
								p.thrust();
							} else if (engine.keys.down) {
								p.reverse();
							}
						}
						else {
							if (data.btn_a === "down") {
								p.fire(_this.loopArg);
							}
							if (data.btn_b === "up") {
								p.activateBomb(_this.state);
							}
						}
					}
          		}
          		console.log(data);
          	}
        };
	},

	checkSize: (function() {
		var lastW, lastH;
		return function() {
			// var windowWidth = window.innerWidth,
			// 	windowHeight = window.innerHeight;

			// if (lastW == windowWidth && lastH == windowHeight) {
			// 	return;
			// }

			// var scaleX = this.width / windowWidth,
			// 	scaleY = this.height / windowHeight,
			// 	scale = 1 / Math.max(scaleX, scaleY),
			// 	transform = engine.vendorPrefix ? engine.vendorPrefix + "Transform" : "transform";
	
		 //    lastW = windowWidth;
		 //    lastH = windowHeight;

			// if (
			// 	document.fullscreenElement || 
			// 	document.webkitFullscreenElement || 
			// 	document.mozFullScreenElement || 
			// 	document.msFullscreenElement
			// ) {
		 //      	this.wrapper.style[transform + "Origin"] = "center";
		 //     	this.wrapper.style[transform + "Origin"] = "center";
		 //    } 
		 //    else {
		 //     	this.wrapper.style[transform + "Origin"] = "0 0";
		 //     	this.wrapper.style[transform + "Origin"] = "0 0";
		 //    }

			// var border = ~~(scale * 12);

			// this.wrapper.style.border = border + "px solid rgb(10,10,10)";
			// this.wrapper.style[transform] = "scale(" + scale + ")";
			// this.wrapper.style.top = Math.floor((windowHeight - this.height * scale)/2) + "px";
			// this.wrapper.style.left = Math.floor((windowWidth - this.width * scale)/2) + "px"

			// var smoothingProp = "imageSmoothingEnabled";
			// if (typeof this.context[smoothingProp] === "undefined") {
			// 	smoothingProp = engine.vendorPrefix ? engine.vendorPrefix + "ImageSmoothingEnabled" : "";
			// }

			// if (smoothingProp.length !== 0) {
			// 	this.context[smoothingProp] = false;
			// }
			var ratio = this.width / this.height,
				newWidth, newHeight;

			if (window.innerWidth / window.innerHeight > ratio) {
				// The window's width is larger, scale on the x axis
				newHeight = window.innerHeight * 0.8;
				newWidth = newHeight * ratio;
			} else {
				// Scale on the y axis
				newWidth = window.innerWidth * 0.8;
				newHeight = newWidth / ratio;
			}

			newWidth = ~~newWidth;
			newHeight = ~~newHeight;

			var border = ~~(newWidth / this.width * 10);

			this.wrapper.style.width = newWidth + "px";
			this.wrapper.style.height = newHeight + "px";
			this.wrapper.style.marginLeft = Math.floor((window.innerWidth - newWidth) / 2 - border) + "px";
			this.wrapper.style.marginTop = Math.floor((window.innerHeight - newHeight) / 2 - border) + "px";
			this.wrapper.style.border = border + "px solid rgb(10,10,10)";
		}
	})(),

	setState: function(state) {
		if (this.state && typeof this.state.leave === "function") {
			this.state.game = null;
			this.state.leave();
		}

		this.state = state;
		this.state.game = this;
		this.state.enter();
	},

	loop: (function() {
		var lastTime = 0,
			lastSizeCheck = 0,
			sizeCheckInterval = 0.2,

			now,
			accum = 0,
			iterations = 0,
			t,
			game,
			elapsed;

		return function() {
			game = this;
			now = new Date().getTime();
			elapsed = (now - lastTime) / 1000;
			lastTime = now;

			// Cap at 1s
			if (elapsed > 1) elapsed = 0;

			if (this.time - lastSizeCheck > sizeCheckInterval) {
				this.checkSize();
				lastSizeCheck = this.time;
			}

			accum += elapsed;
			iterations = 5;

			if (this.state) {
				while (accum >= this.dt && iterations--) {
					this.loopArg.time = this.time;
					this.state.update(this.loopArg);
					this.time += this.dt;
					accum -= this.dt;
				}

				t = (accum % this.dt) / this.dt;
				this.state.allObjects.each(function(group) {
					group.each(function(o) {
						o.renderX = engine.Utils.lerp(o.prevX, o.x, t);
						o.renderY = engine.Utils.lerp(o.prevY, o.y, t);
						o.renderRotation = engine.Utils.lerp(o.prevRotation, o.rotation, t);
					});
				});

				this.state.render(this.loopArg);
			}

			engine.scheduleFrame(this.boundLoop);
		}
	})()
});