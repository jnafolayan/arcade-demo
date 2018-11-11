engine.gfx = {};

engine.gfx.stroke = function(ctx, color) {
	ctx.strokeStyle = color;
	ctx.stroke();
};

engine.gfx.fill = function(ctx, color) {
	ctx.fillStyle = color;
	ctx.fill();
};

engine.gfx.circ = function(ctx, x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, engine.TWOPI, false);
};

engine.gfx.calcTextWidth = function(text, fontSize) {
	return fontSize * 8 * text.length + (text.length-1) * fontSize * 2.5;
};

engine.gfx.font = function(ctx, text, x, y, fontSize, align) {
	text = "" + text;
	var l = engine.gfx.calcTextWidth(text, fontSize);
	var letter;
	ctx.save();
  	ctx.translate(x + (align ? (align>0 ? 0 : -l) : -l/2), y);
  	for (var i= 0; i < text.length; i++) {
  		letter = text.charAt(i);
    	engine.gfx.path(ctx, engine.data.glyphs[letter] && engine.data.glyphs[letter].map(function(o) {
      		return o && [4*fontSize*o[0], 5*fontSize*o[1]];
    	}), true);
    	ctx.lineJoin = "round";
    	ctx.stroke();
    	ctx.translate(fontSize * 10.5, 0);
  	}
	ctx.restore();
};

engine.gfx.path = function(ctx, pts, noclose) {
	ctx.beginPath();
	var mt = true;
	var p;
	for (var i = 0; pts && i < pts.length; i++) {
    	p = pts[i];
    	if (p) {
	     	if (mt) ctx.moveTo(p[0], p[1]);
	     	else ctx.lineTo(p[0], p[1]);
	     	mt = false;
	   	} else {
	   		mt = true;
	   	}
	}
  	if (!noclose) ctx.closePath();
};