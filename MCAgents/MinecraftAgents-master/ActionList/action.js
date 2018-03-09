// http://becausejavascript.com/node-js-event-emitters/
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// http://allenchou.net/2012/07/action-lists-they-are-cooler-than-commands/
// https://gamedevelopment.tutsplus.com/tutorials/the-action-list-data-structure-good-for-ui-ai-animations-and-more--gamedev-9264
var EventEmitter = require('events').EventEmitter;
function Action() {
    EventEmitter.call(this);
    this.started = false;
    this.finished = false;
    this.paused = false;
    this.blocking = false;
    this.abort = false;
    this.laneID = 0;
    // this.on('start', this.OnStarted); // maybe?
    // this.on('complete', this.OnCompleted);
}

Action.prototype = Object.create(EventEmitter.prototype);
Action.prototype.constructor = Action;

// Action.prototype.OnStarted = function () {

// }

// Action.prototype.OnCompleted = function () {

// }

Action.prototype.update = function(delta, agent) {

};

Action.prototype.block = function() {
    this.blocking = true;
}

Action.prototype.unblock = function() {
    this.blocking = false;
}


// Events

Action.prototype.start = function() {
    this.emit('started');
    this.started = true;
};

Action.prototype.fail = function() {
    this.finished = true;
    this.abort = true;
    this.emit('failed');
    this.emit('finished');
};

Action.prototype.complete = function() {
    this.finished = true;
    this.emit('completed');
    this.emit('finished');
};

Action.prototype.pause = function() {
    this.paused = true;
    this.emit('paused');
};
Action.prototype.resume = function() {
    this.paused = false;
    this.emit('resumed');
};

Action.prototype.cancel = function() {
    this.finished = true;
    this.emit('cancelled');
    this.emit('finished');
};

module.exports = Action;
