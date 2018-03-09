var Process = require('../Process/process.js')

function GetWoodBlock() { //This would become [FindWood, WalkToWood, ChopWood]
    Process.call(this);
    this.currentAmount = 0;
    this.amount = 1;
    this.blocking = true;
}

GetWoodBlock.prototype = Object.create(Process.prototype);
GetWoodBlock.prototype.constructor = GetWoodBlock;

GetWoodBlock.prototype.success = function () {
    if(this.currentAmount >= this.amount) {
        return true;
    }
    return false;
}

GetWoodBlock.prototype.fail = function () {
    if (this.size === 0) {
        return true;
    }
    return false;
}

// When would we have an action modify 
function FindWoodBlock() { //This would become [Look, BrainLook, MoveForward]
    Process.call(this);
    this.blocking = true;
}

FindWoodBlock.prototype = Object.create(Process.prototype);
FindWoodBlock.prototype.constructor = FindWoodBlock;

FindWoodBlock.prototype.success = function() {
    if(agent.brain.wood) {
        return true;
    }
    return false;
}

FindWoodBlock.prototype.fail = function() {
    if(this.size === 0) {
        return true;
    }
    return false;
}

// FindWood.prototype.update = function (tick, agent) {
//     console.log(this.size)
//     if (agent.brain.wood) {
//         // this.parent.pushBack(new WalkToWood())
//         this.complete();
//     } else if (this.size === 0) {
//         this.pushBack(new ActionLibrary.Look());
//         this.pushBack(new ActionLibrary.LookRandom());
//     } else {
//         Behaviour.prototype.update.call(this, tick, agent);
//     }
// }

function WalkToWoodBlock() { //This would become [BrainLook, MoveForward]
    Process.call(this);
}

WalkToWoodBlock.prototype = Object.create(Process.prototype);
WalkToWoodBlock.prototype.constructor = WalkToWoodBlock;

WalkToWoodBlock.prototype.success = function (tick, agent) {
    if (agent.brain.nextToWood()) {
        return true;
    }
    return false;
}

WalkToWoodBlock.prototype.fail = function (tick, agent) {
    if (!agent.brain.wood) {
        return true;
    }
    return false;
}

// WalkToWood.prototype.update = function (tick, agent) {
//     if (agent.brain.nextToWood()) {
//         // Chop Wood
//         agent.stopMove();
//         // this.parent.pushBack(new ChopWood());
//         this.complete();
//     } else if (!agent.brain.wood) {
//         // Find Wood 
//         var wood = new FindWood();
//         wood.block();
//         this.parent.pushFront(wood); // we have to find wood before we can chop it
//     } else {
//         Behaviour.prototype.update.call(this, tick, agent);
//     }
// }

function ChopWoodBlock() { //This would become [BrainLook, SwingArm]
    Process.call(this);
}

ChopWoodBlock.prototype = Object.create(Process.prototype);
ChopWoodBlock.prototype.constructor = ChopWoodBlock;

ChopWoodBlock.prototype.success = function (tick, agent) {
    // Check if wood block gone.
    if (agent.brain.woodGone()) {
        return true;
    }
    return false;
}

ChopWoodBlock.prototype.fail = function (tick, agent) {
    if (!agent.brain.nextToWood() && !agent.brain.wood) {
        return true;
    }
    return false;
}

function GetWoodPiece() {

}

function FindWoodPiece() {

}

function WalkToWoodPiece() {

}



// ChopWood.prototype.update = function (tick, agent) {
//     if (!agent.brain.wood) {
//         // this.parent.currentAmount++;
//         this.complete();
//     } else if (agent.brain.nextToWood() && agent.brain.wood) {
//         Behaviour.prototype.update.call(this, tick, agent);
//     }
// }

module.exports = {
    GetWoodBlock,
    FindWoodBlock,
    ChopWoodBlock,
    WalkToWoodBlock
}