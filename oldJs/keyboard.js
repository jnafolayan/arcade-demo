if (DEBUG) {
	var keys = {};
	keys["left"] = keys["right"] = 0;
	keys["up"] = keys["down"] = 0;

	listen(document, "keydown", function(e) {
		var code = e.keyCode;
		handleKey(code, 1);
	});

	listen(document, "keyup", function(e) {
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
			case 70:
				keys["f"] = isDown;
				break;
			default:
				break;
		}
	}
}
