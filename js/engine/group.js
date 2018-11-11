engine.Group = function(pool) {
	this.children = [];
	this.length = 0;
	this.pool = pool;
};

engine.Group.prototype.add = function(obj) {
	obj.parent = this;
	this.children.push(obj);
	this.length++;
	return obj;
};

engine.Group.prototype.remove = function(obj) {
	if (this.pool) {
		this.pool.release(obj);
	}
	else if (obj.destroy) {
		obj.destroy();
	}
	obj.parent = null;
	this.children.splice(this.children.indexOf(obj), 1);
	this.length--;
};

engine.Group.prototype.get = function(i) {
	return this.children[i];
};

engine.Group.prototype.create = function() {
	if (this.pool) {
		return this.add(this.pool.get(arguments));
	}
	else {
		return null;
	}
};

engine.Group.prototype.each = function(iterator, descending, thisContext) {
	var i;
	if (descending) {
		i = this.length;
		while (i--) {
			iterator.call(thisContext, this.children[i], i, this.children);
		}
	} else {
		for (i = 0; i < this.length; i++) {
			iterator.call(thisContext, this.children[i], i, this.children);
		}
	}
};

engine.Group.prototype.callAll = function(method, descending, a, b, c) {
	var i;
	if (descending) {
		i = this.length;
		while (i--) {
			this.children[i][method](a, b, c);
		}
	} else {
		for (i = 0; i < this.length; i++) {
			this.children[i][method](a, b, c);
		}
	}
};

engine.Group.prototype.filter = function(predicate) {
	var i, result = [];
	for (i = 0; i < this.length; i++) {
		if (predicate(this.children[i], i, this.children) === true) {
			result.push(this.children[i]);
		}
	}
	return result;
};