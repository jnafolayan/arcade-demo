function path(pts, noclose) {
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
}

function tr(x, y, angle) {
	ctx.translate(x, y);
	ctx.rotate(angle);
}

function stroke(color) {
	ctx.strokeStyle = color;
	ctx.stroke();
}

function fill(color) {
	ctx.fillStyle = color;
	ctx.fill();
}

function circ(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, PI2, false);
}

function getTextWidth(text, fontSize) {
	return fontSize * 8 * text.length + (text.length-1) * fontSize * 2.5;
}

function font(text, x, y, fontSize, align) {
	var l = getTextWidth(text, fontSize);
	var letter;
  	ctx.translate(x + (align ? (align>0 ? 0 : -l) : -l/2), y);
  	for (var i= 0; i < text.length; i++) {
  		letter = text.charAt(i);
    	path(glyphs[letter] && glyphs[letter].map(function(o) {
      		return o && [4*fontSize*o[0], 5*fontSize*o[1]];
    	}), true);
    	ctx.lineJoin = "round";
    	ctx.stroke();
    	ctx.translate(fontSize * 10.5, 0);
  	}
}