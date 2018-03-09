
function ActionLane() {
    this.id = 0;
    this.actions = [];
}

ActionLane.prototype.cancel = function() {
    actions.forEach(function(action) {
        action.cancel();
    }, this);
}

ActionLane.prototype.pause = function() {
    actions.forEach(function(action) {
        action.pause();
    }, this);
}

ActionLane.prototype.resume = function() {
    actions.forEach(function(action) {
        action.resume();
    }, this);
}

ActionLane.prototype.block = function() {
    actions.forEach(function(action) {
        action.block();
    }, this);
}

ActionLane.prototype.unblock = function() {
    actions.forEach(function(action) {
        action.unblock();
    }, this);
}

module.exports = ActionLane;