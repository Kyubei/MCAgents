
var ActionList = require('../ActionList/actionList.js')
function Process() {
    ActionList.call(this);
    this.on('success', function() {
        this.OnSuccess();
    })
    this.on('fail', function() {
        this.OnFail();
    })
}

Process.prototype = Object.create(ActionList.prototype);
Process.prototype.constructor = Process;

Process.prototype.update = function () {
    if(this.success()) {
        this.emit('success');
    } else if (this.fail()) {
        this.emit('fail');
    } else {
        ActionList.prototype.update.call(this, tick, agent);
    }

}

Process.prototype.success = function () {
    return true;
}

Process.prototype.fail = function () {
    return false;
}

Process.prototype.OnSuccess = function () {
    this.complete();
}

Process.prototype.OnFail = function () {
    this.complete();  
}
module.exports = Process;