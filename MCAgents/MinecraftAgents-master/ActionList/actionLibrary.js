var Action = require('./action.js')

//Implement Look random
//Implement Scan Direction Up down left Right

// Actions are the simplest tasks that the agent can perform. These actions are constructed together to create complex behaviours.

function TestAction() {
    Action.call(this)
    this.random = 0;
}

TestAction.prototype = Object.create(Action.prototype);
TestAction.prototype.constructor = TestAction;

TestAction.prototype.update = function (delta) {
    console.log("Test")
    random += Math.random();
    this.complete();
}

function Wait(duration) {
    Action.call(this)
    // this.duration = duration || 100; // in milliseconds
    this.duration = duration < 0 ? 0 : duration;
    this.startTime = 0;
    this.once('started', function () { this.startTime = Date.now(); })
}

Wait.prototype = Object.create(Action.prototype);
Wait.prototype.constructor = Wait;

// Wait.prototype.OnStarted = function() {
//     this.startTime = Date.now();
// }

Wait.prototype.update = function (delta) {
    if (Date.now() - this.startTime > this.duration) {
        console.log("Wait Done");
        this.complete();
    }
}


function ToggleSprint() {
    Action.call(this);
}

ToggleSprint.prototype = Object.create(Action.prototype);
ToggleSprint.prototype.constructor = ToggleSprint;

ToggleSprint.prototype.update = function (delta, agent) {
    console.log("toggle sprint");
    if (agent.sprint) {
    	agent.stopSprint();
    } else {
    	agent.startSprint();
    }
    this.complete();
}


function Jump() {
    Action.call(this);
}

Jump.prototype = Object.create(Action.prototype);
Jump.prototype.constructor = Jump;

Jump.prototype.update = function (delta, agent) {
    console.log("jump");
	agent.jump();
    this.complete();
}



function StartMoveForward() {
    Action.call(this);
}

StartMoveForward.prototype = Object.create(Action.prototype);
StartMoveForward.prototype.constructor = StartMoveForward;

StartMoveForward.prototype.update = function (delta, agent) {
    agent.startMove('forward');
    console.log("Start Move");
    this.complete();
}

function StopMoveForward() {
    Action.call(this)
}

StopMoveForward.prototype = Object.create(Action.prototype);
StopMoveForward.prototype.constructor = StopMoveForward;

StopMoveForward.prototype.update = function (delta, agent) {
    console.log("Stop Move");
    agent.stopMove('forward');
    this.complete();
}


function StartMoveBackward() {
    Action.call(this)
}

StartMoveBackward.prototype = Object.create(Action.prototype);
StartMoveBackward.prototype.constructor = StartMoveBackward;

StartMoveBackward.prototype.update = function (delta, agent) {
    console.log("start back");
    agent.startMove('back');
    this.complete();
}

function StopMoveBackward() {
    Action.call(this)
}

StopMoveBackward.prototype = Object.create(Action.prototype);
StopMoveBackward.prototype.constructor = StopMoveBackward;

StopMoveBackward.prototype.update = function (delta, agent) {
    console.log("stop back");
    agent.stopMove('back');
    this.complete();
}

function BreakBlock() {
    Action.call(this)
}

BreakBlock.prototype = Object.create(Action.prototype);
BreakBlock.prototype.constructor = BreakBlock;

BreakBlock.prototype.update = function (delta, agent) {
    // agent.bot.clearControlStates();
	try {
		agent.dig();
	} catch (e) {
		console.log("block is null!");
	}
    this.complete();
}

function RotateHeadRandom() {
    Action.call(this)
}

RotateHeadRandom.prototype = Object.create(Action.prototype);
RotateHeadRandom.prototype.constructor = RotateHeadRandom;

RotateHeadRandom.prototype.update = function (delta, agent) {
    var entity = agent.bot.entity;
    var yaw = entity.yaw;
    var pitch = entity.pitch;
    var increment = Math.floor(Math.random() * 10) + 5;
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            yaw += increment;
        } else {
            yaw -= increment;
        }
    } else {
        if (Math.random() > 0.5) {
            pitch += increment;
        } else {
            pitch -= increment;
        }
    }
    agent.bot.look(yaw, pitch)
    console.log("moveheadrandom update "+increment+", yaw="+yaw+", pitch="+pitch);
    this.complete();
}

function Look() {
    Action.call(this)
}

Look.prototype = Object.create(Action.prototype);
Look.prototype.constructor = Look;

Look.prototype.update = function (delta, agent) {
    agent.brain.look();
    //console.log("brain look")
    this.complete();
}
function LookRandom(movementDelta) {
    Action.call(this)
    this.random = 0;
    this.movementDelta = movementDelta;// || 0; //should be a value -pi/2 to pi/2
    //console.log("initialized lookrandom with movementdelta: "+this.movementDelta);
}

LookRandom.prototype = Object.create(Action.prototype);
LookRandom.prototype.constructor = LookRandom;

LookRandom.prototype.update = function (delta, agent) {
	var lower = Number(this.movementDelta);
	var higher = 1 * Math.PI / 2 + Number(this.movementDelta);
	let yaw = this.movementDelta; //Math.random() * Math.PI * 2; // getRandomFloat(lower, higher);//Number(this.movementDelta);
	let pitch = getRandomFloat(-Math.PI / 4, Math.PI / 4);
	//console.log("yaw = "+yaw+", pitch = "+pitch);
    //let yaw = getRandomFloat(-Math.PI, Math.PI);
    //console.log("Getting random float between "+(lower)+" and "+(higher)+", which is "+yaw);
    
    //let pitch = getRandomFloat(lower, higher);
    agent.look(yaw, pitch);
    //console.log("move head")
    this.complete();
}
//
function ScanDirection() {
    Action.call(this)
    this.random = 0;
}

ScanDirection.prototype = Object.create(Action.prototype);
ScanDirection.prototype.constructor = ScanDirection;

ScanDirection.prototype.update = function (delta, agent) {
    
    this.complete();
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// function GetWood() {
//     Action.call(this);
// }

// GetWood.prototype = Object.create(Action.prototype);
// GetWood.prototype.constructor = GetWood;

// GetWood.prototype.update = function (delta, agent) {
//     // if
//     // if (agent.brain.wood) {
//     //     this.complete();
//     // }
//     // agent.lookRandom();
//     // agent.see();
// }

// function FindWood() {
//     Action.call(this);
// }

// FindWood.prototype = Object.create(Action.prototype);
// FindWood.prototype.constructor = FindWood;

// FindWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         this.parent.pushBack(new MoveToWood());
//         this.complete();
//     }
//     agent.lookRandom();
//     agent.brain.look();
// }

// function MoveToWood() {
//     Action.call(this);
// }

// MoveToWood.prototype = Object.create(Action.prototype);
// MoveToWood.prototype.constructor = MoveToWood;

// MoveToWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         agent.startMove('forward');
//         agent.brain.look();
//     } else {
//         agent.stopMove('forward');
//         this.parent.pushBack(new ChopWood());
//         this.complete();
//     }
// }

// function ChopWood() {
//     Action.call(this);
// }

// ChopWood.prototype = Object.create(Action.prototype);
// ChopWood.prototype.constructor = ChopWood;

// ChopWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         agent.use();
//         agent.brain.look();
//     } else {
//         this.parent.pushBack(new FindWood())
//         this.complete();
//     }
// }

module.exports = {
    // GetWood,
    RotateHeadRandom,
    Look,
    Wait,
    StartMoveForward,
    StopMoveForward,
    StartMoveBackward,
    StopMoveBackward,
    LookRandom,
    BreakBlock,
    ToggleSprint,
    Jump
}
// module.exports.Wait = Wait;
// module.exports.StartMoveForward = StartMoveForward;
// module.exports.StopMoveForward = StopMoveForward;
// module.exports.StartMoveBackward = StartMoveBackward;
// module.exports.StopMoveBackward = StopMoveBackward;