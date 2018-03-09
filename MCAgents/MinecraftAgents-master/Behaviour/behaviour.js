// var Action = require('./action.js')
var ActionList = require('../ActionList/actionList.js')
// TODO: have the ActionList listen to an action completed to call next action.
// Use an init method to 
// Would I need a delta???

// A Behaviour is an action list which the agent determines its completion. The Behaviour an agent emulates is decided by the agent's brain.
// This is meerly an abstraction place holder. We might want a higher api between actual Behaviours and action lists.
function Behaviour() {
    ActionList.call(this);
}

Behaviour.prototype = Object.create(ActionList.prototype);
Behaviour.prototype.constructor = Behaviour;
module.exports = Behaviour;
