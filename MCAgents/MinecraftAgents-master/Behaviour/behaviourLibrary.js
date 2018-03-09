var Behaviour = require('./behaviour.js');
var ActionLibrary = require('../ActionList/actionLibrary.js')

// Assuming we want one piece of wood


// Get some amount of Wood
function GetWood(direction) { //This would become [FindWood, WalkToWood, ChopWood]
    Behaviour.call(this);
    this.currentAmount = 0;
    this.amount = 1;
    this.totalTime = 0;
    this.maxTime = 50;
    this.direction = direction;
    this.findActions = [];
    this.walkActions = [];
    this.chopActions = [];
	this.possibleActions = [
		new ActionLibrary.Look(),
		new ActionLibrary.LookRandom(this.direction),
		new ActionLibrary.StartMoveForward(),
		new ActionLibrary.Jump(),
		new ActionLibrary.BreakBlock(),
		new ActionLibrary.StartMoveBackward()
	];
}

GetWood.prototype = Object.create(Behaviour.prototype);
GetWood.prototype.constructor = GetWood;

GetWood.prototype.update = function (tick, agent) {
	this.totalTime++;
	//console.log("time taken: "+this.totalTime+"/"+this.maxTime);
	if (this.totalTime >= this.maxTime) {
		this.totalTime = 0;
        agent.brain.wood = null;
		this.fail();
	} else if (this.currentAmount >= this.amount) {
        this.complete();
		this.totalTime = 0;
    } else if (this.size === 0) {
        // this.parent.pushBack(new FindWood());
    } else {
        Behaviour.prototype.update.call(this, tick, agent); // I have no idea how this would work?
    }
}

// When would we have an action modify 
function FindWood() { //This would become [Look, BrainLook, MoveForward]
    Behaviour.call(this);
}

//When would we have an action modify 
function FindWood(direction) { //This would become [Look, BrainLook, MoveForward]
	this.direction = direction;
	//console.log("Attempting to find wood in direction: "+direction)
	Behaviour.call(this);
}

FindWood.prototype = Object.create(Behaviour.prototype);
FindWood.prototype.constructor = FindWood;

FindWood.prototype.update = function (tick, agent) {
    //console.log(this.size)
	this.parent.totalTime++;
	//console.log("time taken: "+this.parent.totalTime+"/"+this.parent.maxTime);
	if (this.parent.totalTime >= this.parent.maxTime) {
		this.parent.totalTime = 0;
        agent.brain.wood = null;
        agent.stopMove();
		this.fail();
	} else 
    if (agent.brain.wood) {
        // this.parent.pushBack(new WalkToWood())
        this.complete();
		this.parent.totalTime = 0;
    } else if (this.size === 0) {
    	for (i = 0; i < this.parent.findActions.length; i++) {
    		//console.log("find wood: adding action #"+this.parent.findActions[i]);
    		try {
    			this.pushBack(this.parent.possibleActions[this.parent.findActions[i]]);
    		} catch (error) {
    			console.log("error?? in attempting to push "+this.parent.findActions[i]);
    		}
    	}
        //this.pushBack(new ActionLibrary.Look());
        //this.pushBack(new ActionLibrary.LookRandom(this.parent.direction));
    } else {
        Behaviour.prototype.update.call(this, tick, agent);
    }
}

function WalkToWood() { //This would become [BrainLook, MoveForward]
    Behaviour.call(this);
}

WalkToWood.prototype = Object.create(Behaviour.prototype);
WalkToWood.prototype.constructor = WalkToWood;

WalkToWood.prototype.update = function (tick, agent) {
	//console.log("walking to wood...");
	this.parent.totalTime++;
	//console.log("time taken: "+this.parent.totalTime+"/"+this.parent.maxTime);
	if (this.parent.totalTime >= this.parent.maxTime) {
        agent.stopMove();
        agent.brain.wood = null;
		this.parent.totalTime = 0;
		this.fail();
	} else 
    if (agent.brain.nextToWood()) {
        // Chop Wood
        agent.stopMove();
        // this.parent.pushBack(new ChopWood());
        this.complete();
		this.parent.totalTime = 0;
    } else if (!agent.brain.wood) {
        // Find Wood 
    	for (i = 0; i < this.parent.walkActions.length; i++) {
    		//console.log("find wood: adding action #"+this.parent.findActions[i]);
    		try {
    			this.pushBack(this.parent.possibleActions[this.parent.walkActions[i]]);
    		} catch (error) {
    			console.log("error?? in attempting to push "+this.parent.walkActions[i]);
    		}
    	}
        /*var wood = new FindWood();
        wood.block();
        this.parent.pushFront(wood); // we have to find wood before we can chop it*/
    } else {
        Behaviour.prototype.update.call(this, tick, agent);
    }
}

function ChopWood() { //This would become [BrainLook, SwingArm]
    Behaviour.call(this);
}

ChopWood.prototype = Object.create(Behaviour.prototype);
ChopWood.prototype.constructor = ChopWood;

ChopWood.prototype.update = function (tick, agent) {
	this.parent.totalTime++;
	//console.log("time taken: "+this.parent.totalTime+"/"+this.parent.maxTime);
	if (this.size === 0) {
    	for (i = 0; i < this.parent.chopActions.length; i++) {
    		console.log("chop wood: adding action #"+this.parent.chopActions[i]);
    		try {
    			this.pushBack(this.parent.possibleActions[this.parent.chopActions[i]]);
    		} catch (error) {
    			console.log("error?? in attempting to push "+this.parent.chopActions[i]);
    		}
    	}
	}
	if (this.parent.totalTime >= this.parent.maxTime) {
		this.parent.totalTime = 0;
        agent.stopMove();
        agent.brain.wood = null;
		this.fail();
	} else if (!agent.brain.wood) {
        // this.parent.currentAmount++;
    	console.log("Wood is no more - success");
		this.complete();
		this.parent.totalTime = 0;
    	//this.fail();
        //var wood = new WalkToWood();
        //wood.block();
        //this.parent.pushFront(wood); // we have to find wood before we can chop it
    } else /*if (agent.brain.nextToWood() && agent.brain.wood)*/ { //these are preconditions to get here regardless
        Behaviour.prototype.update.call(this, tick, agent);
		//this.complete();
    	/*var breakBlock = new ActionLibrary.BreakBlock();
        this.parent.pushFront(breakBlock);
        breakBlock.block();*/
        //setTimeout(ChopWood.prototype.update, 300);
    }/* else {
    	agent.brain.wood = null;
    	this.parent.currentAmount++;
    	if (this.parent.currentAmount >= this.parent.amount) {
    		this.complete();
    		this.parent.totalTime = 0;
    	} else
        	console.log("Successfully collected "+this.parent.currentAmount+" out of "+this.parent.amount+" wood");
    }*/
}

module.exports = {
    GetWood,
    FindWood,
    ChopWood,
    WalkToWood
}

