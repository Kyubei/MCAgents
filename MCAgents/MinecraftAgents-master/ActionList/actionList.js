
// Should an ActionList be an action? Or should we have an action that spawns an action?
// each lane used for sensor or actuator
// use actionlist as state machine?
//   function update(delta)
//   {
//       this.complete();
//       this.parent.push(new newState(), 0);
//   }
var createPool = require('../Pool/pool.js');
var Action = require('./action.js')
var ActionLane = require('./actionLane.js')
// TODO: have the ActionList listen to an action completed to call next action.
// Use an init method to 
// Would I need a delta???
function ActionList() {
    Action.call(this);
    // We will use lanes to handle reactions?
    this.lanes = []; // An array of lanes // maybe linked list would be faster???
    this.size = 0;
    this.totalTime = 0;
    this.direction = 0;
    this.find = undefined;
}

ActionList.prototype = Object.create(Action.prototype);
ActionList.prototype.constructor = ActionList;

ActionList.prototype.getLane = function (laneID) {
    laneID = laneID || 0;
    var lane = this.lanes[laneID];
    if (!lane) {
        lane = new ActionLane();
        lane.id = laneID;
        this.lanes[laneID] = lane;
    }
    return lane;
}

ActionList.prototype.pushBack = function (action, laneID) {
    laneID = laneID || 0;
    this.getLane(laneID).actions.push(action);
    action.laneID = laneID;
    action.parent = this;
    ++this.size;
    return this;
}

ActionList.prototype.pushFront = function (action, laneID) {
    laneID = laneID || 0; // these arent needed but maybe its faster than declaring a lane?
    this.getLane(laneID).actions.unshift(action);
    action.laneID = laneID;
    action.parent = this;
    ++this.size;
    return this;
}

ActionList.prototype.cancelLane = function (laneID) {
    this.getLane(laneID).cancel();
}

ActionList.prototype.pauseLane = function (laneID) {
    this.getLane(laneID).pause();
}

ActionList.prototype.resumeLane = function (laneID) {
    this.getLane(laneID).resume();
}

ActionList.prototype.blockLane = function (laneID) {
    this.getLane(laneID).block();
}

ActionList.prototype.unblockLane = function (laneID) {
    this.getLane(laneID).unblock();
}

ActionList.prototype.update = function (delta, agent) {
    // Dont do the action
	if (this.paused) {
		console.log("no update as we are paused");
	}
	if (this.finished) {
		console.log("no update as we are finished");
	}
	if (this.abort) { //make it seem like its finished
		this.size = 0;
		return;
	}
    if (this.paused || this.finished)
        return;
    this.totalTime++;
    //console.log("actionlist total time: "+this.totalTime);
    for (var i = 0; i < this.lanes.length; i++) {
        var lane = this.lanes[i];
        for (var i = 0; i < lane.actions.length; i++) {
            var action = lane.actions[i];
            // action completed remove it
            if (action.finished) {
                lane.actions.splice(i, 1);
                i--;
                --this.size;
        		//console.log("finished an action. removing it. now the size is: "+this.size);
        		if (action.abort) {
            		//console.log("action has abort flag. making list seem empty!");
        			this.size = 0;
        			this.abort = true;
        			break;
        		}
                continue;
            }

            if (!action.paused) {
                if (!action.started) {
                    action.start();
                    if (action.finished) {
                        lane.actions.splice(i, 1);
                        i--;
                        --this.size;
                		//console.log("just started and finished an action. now the size is: "+this.size);
                		if (action.abort) {
                    		//console.log("action has abort flag. making list seem empty!");
                			this.size = 0;
                			this.abort = true;
                			break;
                		}
                        continue;
                    }
                }

                action.update(delta, agent);

                if (action.finished) {
                    lane.actions.splice(i, 1);
                    i--;
                    --this.size;
            		//console.log("finished an action (3). now the size is: "+this.size);
            		if (action.abort) {
                		//console.log("action has abort flag. making list seem empty!");
            			this.size = 0;
            			this.abort = true;
            			break;
            		}
                    continue;
                }
            }

            if (action.blocking)
                break;
        }
    }

    // recycle lanes

    if (this.size === 0) {
    	//this.finished = true;
        // this.complete();
    }
}

module.exports = ActionList;


