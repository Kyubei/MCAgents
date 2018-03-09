var EMPTY = {};
var NO_OP = function() {};

module.exports = createPool;
function createPool(factory, opts) {
    return new Pool(factory, opts);
}

function Pool(factory, opts) {
    this.factory = factory;
    this.recycled = [];
    opts = opts || EMPTY;
    this.prepare = opts.prepare || NO_OP;
    this.max = opts.max || Infinity;
}

Pool.prototype.get = function() {
    if (this.recycled.length) {
        var obj = this.recycled.pop();
        this.prepare(obj);
        return obj;
    } else {
        return this.factory();
    }
}

Pool.prototype.recycle = function(obj) {
	if (this.recycled.length < this.max) {
		this.recycled.push(obj);	
	}
}