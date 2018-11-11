var engine = {};
engine.no0p = function() {};

//Constants
engine.DEBUG = {
	debugDraw: false,
	playerControllable: true
};

engine.TWOPI = 2 * Math.PI;
engine.HIT_RADIUS = 0.75;

engine.textureCache = {};

engine.scheduleFrame = (function() {
	var raf = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			return setTimeout(callback, 1000 / 60);
		};
	return function(cb) {
		return raf(cb);
	}
})();