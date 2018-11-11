engine.Pool = function(objClass, fill) {
	this.objClass = objClass;
	this.objects = [];
	this.length = 0;

	if (typeof fill === 'number' && fill > 0) {
		while (fill--) {
			this.objects.push(new this.objClass());
		}
	}
};

engine.Pool.prototype.get = function(args) {
	var obj;
	if (this.length !== 0) {
		obj = this.objects.pop();
		this.length--;
	}
	else {
		obj = new this.objClass();
	}
	engine.Utils.fastApply(this.objClass, obj, args);
	return obj;
};

engine.Pool.prototype.release = function(obj) {
	if (obj.destroy) {
		obj.destroy();
	}
	this.objects.push(obj);
	this.length++;
};