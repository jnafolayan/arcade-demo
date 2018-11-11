var spatialHash = {};
var hashScale = 10;

function insertToHash(obj) {
	var hash = getHash(obj.x, obj.y);
	if (!spatialHash[hash]) spatialHash[hash] = [];
	spatialHash[hash].push(obj);
}

function getHash(x, y) {
	return Math.round(x / hashScale) + "_" + Math.round(y / hashScale);
}

function collide(obj) {
	var checked = {},
		group,
		hash,
		ele, 
		r;

	for (var y = -1; y < 2; y++) {
		for (var x = -1; x < 2; x++) {
			if (x === 0 && y === 0) continue;
			hash = getHash(obj.x + x * hashScale, obj.y + y * hashScale);
			if (!checked[hash]) {
				checked[hash] = true;
				group = spatialHash[hash];
				for (var i = 0; group && i < group.length; i++) {
					ele = group[i];
					r = ele.radius + obj.radius;
					if (sqrDist(obj, ele) < r * r) {
						return ele;
					}
				}
			}
		}
	}
}

function keepInView(o) {
	if (o.x - o.radius < 0) {
		o.x = o.radius;
	} else if (o.x + o.radius > W) {
		o.x = W - o.radius;
	}
	if (o.y - o.radius < 0) {
		o.y = o.radius;
	} else if (o.y + o.radius > H) {
		o.y = H - o.radius;
	}
}