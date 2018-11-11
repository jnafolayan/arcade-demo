// DOM
engine.Utils = {};

engine.Utils.addEventListener = function(el, type, cb) {
    if (el.attachEvent) {
        el.attachEvent( "on" + type, cb );
    } 
    else {
        el.addEventListener(type, cb, false);
    }
};

engine.Utils.removeEventListener = function(el, type, cb) {
    if (el.attachEvent) {
        el.removeEvent( "on" + type, cb );
    } 
    else {
        el.removeEventListener(type, cb, false);
    }
};

// Miscellanous
engine.Utils.clamp = function(value, min, max) {
	return value < min ? min : value > max ? max : value;
};

engine.Utils.dist = function(a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
};

engine.Utils.sqrDist = function(a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return dx * dx + dy * dy;
};

engine.Utils.wrap = function(value, min, max) {
    if (value < min) return max + (value % max);
    if (value >= max) return value % max;
    return value;
};

engine.Utils.wrapAngle = function(a) {
    return engine.Utils.wrap(a, 0, engine.TWOPI);
};

engine.Utils.roundNearest = function(d, n) {
    return Math.round(d / n) * n;
};

engine.Utils.angleBetween = function(p0, p1) {
    return Math.atan2(p1.y - p0.y, p1.x - p0.x);
};

engine.Utils.smoothstep = function(min, max, value) {
 	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
 	return x * x * (3 - 2 * x);
};

engine.Utils.lerp = function(a, b, k) {
	return k * (b - a) + a;
};

engine.Utils.merge = function(t, src) {
    for (var n in src) {
        t[n] = src[n];
    }
    return t;
};

engine.Utils.extend = function(t, src) {
    for (var n in src) {
        if (typeof t[n] === "undefined") {
            t[n] = src[n];
        }
    }
    return t;
};

engine.Utils.rand = function( a, b ) {
    if (a === undefined) {
        a = 0;
        b = 1;
    }
    else if (b === undefined) {
        b = a;
        a = 0;
    }
    return a + Math.random() * (b - a);
};

engine.Utils.randInt = function( a, b ) {
    if (a === undefined) {
        a = 0;
        b = 1;
    }
    else if (b === undefined) {
        b = a;
        a = 0;
    }
    return ~~(a + Math.random() * (b - a + 1));
};

engine.Utils.cache = function(w, h, cb) {
    var c = document.createElement( "canvas" );
    c.width = w;
    c.height = h;
    return cb( c.getContext("2d"), w, h ) || c;
};

// Array
engine.Utils.callAll = function(arr, func, a, b, c) {
    var i = arr.length;
    while (i--) {
        arr[i][func](a, b, c);
    }
};

engine.Utils.pick = function(arr) {
    return arr[~~engine.Utils.rand(arr.length)];
};

engine.Utils.each = function(arr, cb, reverse) {
    if (reverse) {
        for (var i = arr.length-1; i >= 0; i--) {
            cb(arr[i], i, arr);
        }
    } else {
        for (var i = 0; i < arr.length; i++) {
            cb(arr[i], i, arr);
        }
    }
};

engine.Utils.padLeft = function(n, length) {
    while (n.length < length) {
        n = "0" + n;
    }
    return n;
};

engine.Utils.formatTime = function(t) {
    t = ~~t;
    var seconds = "" + Math.max( 0, t % 60 ),
        minutes = "" + ~~Math.max( 0, t / 60 );

    return engine.Utils.padLeft(minutes, 2) + ":" + engine.Utils.padLeft(seconds, 2);
};

// Borrowed from PlaygroundJS source code.
engine.Utils.fastApply = function(subject, thisContext, args) {
    switch (args.length) {
        case 0:
            return subject.call(thisContext);
        case 1:
            return subject.call(thisContext, args[0]);
        case 2:
            return subject.call(thisContext, args[0], args[1]);
        case 3:
            return subject.call(thisContext, args[0], args[1], args[2]);
        case 4:
            return subject.call(thisContext, args[0], args[1], args[2], args[3]);
        case 5:
            return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4]);
        case 6:
            return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7:
            return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        case 8:
            return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        case 9:
            return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        default:
            return subject.apply(thisContext, args);
    }
}