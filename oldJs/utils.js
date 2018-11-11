var PI2 = 2 * Math.PI;

function no0p() {}

// DOM
function listen(el, type, cb) {
    if (el.attachEvent) {
        el.attachEvent( "on" + type, cb );
    } else {
        el.addEventListener(type, cb, false);
    }
}

// Miscellanous
function clamp(value, min, max) {
	return value < min ? min : value > max ? max : value;
}

function dist(a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function sqrDist(a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return dx * dx + dy * dy;
}

function wrap(value, min, max) {
    if (value < min) return max + (value % max);
    if (value >= max) return value % max;
    return value;
}

function wrapAngle(a) {
    return wrap(a, 0, PI2);
}

function roundNearest(d, n) {
    return Math.round(d / n) * n;
}

function angleBetween(p0, p1) {
    return Math.atan2(p1.y - p0.y, p1.x - p0.x);
}

function smoothstep(min, max, value) {
 	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
 	return x * x * (3 - 2 * x);
}

function lerp(a, b, k) {
	return k * (b - a) + a;
}

function merge(t, src) {
    for (var n in src) {
        t[n] = src[n];
    }
    return t;
}

function rand( a, b ) {
    if ( a === undefined ) {
        a = 0;
        b = 1;
    }
    if ( b === undefined ) {
        b = a;
        a = 0;
    }
    return a + Math.random() * ( b - a );
}

// Array
function callAll(arr, func) {
    var i = arr.length;
    while (i--) {
        arr[i][func](i);
    }
}

function pick(arr) {
    return arr[~~rand(arr.length)];
}

function each(arr, cb, reverse) {
    if (reverse) {
        for (var i = arr.length-1; i >= 0; i--) {
            cb(arr[i], i, arr);
        }
    } else {
        for (var i = 0; i < arr.length; i++) {
            cb(arr[i], i, arr);
        }
    }
}

// Inheritance
function getSuper(o) {
    var sup = {};
    for (var i in o) {
        if (o[i] && o[i].call) {
            sup[i] = (function(fn) {
                return function() {
                    fn.apply(o, arguments);
                }
            })(o[i]);
        }
    }
    return sup;
}

function cache(w, h, cb) {
    var c = document.createElement( "canvas" );
    c.width = w;
    c.height = h;
    var layer = cq(w, h);
    return cb( layer, w, h ) || layer.canvas;
}

function scaleVerts(arr, scale) {
    return arr.map(function(a) {
        return a.map(function(n, i) {
            if (i === 0) return n + (n - W/2) * scale;
            else return n + (n - H/2) * scale;
        });
    });
}

function formatTime(t) {
    t = ~~t;
    var seconds = "" + Math.max( 0, t % 60 ),
        minutes = "" + ~~Math.max( 0, t / 60 );

    while( seconds.length < 2 ) {
        seconds = "0" + seconds;
    }
    while( minutes.length < 2 ) {
        minutes = "0" + minutes;
    }
    return minutes + ":" + seconds;
}