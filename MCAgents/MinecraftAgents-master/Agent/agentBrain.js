
// var States = {
//     CUTTINGWOOD = 0,
//     LOOKINGFORWOOD = 1,
// }

// Maybe use node event emitter?
// agentBrain.on('foundWood'), agent.on('selectedAction')
var ActionList = require('../ActionList/actionList.js')
var actionUtils = require('../ActionList/actionUtils.js')
var ActionLibrary = require('../ActionList/actionLibrary.js');
var BehaviourLibrary = require('../Behaviour/behaviourLibrary.js');
var Vec3 = require('vec3').Vec3;
// var Wait = require('../ActionList/actionLibrary.js').Wait;
// var StartMoveForward = require('../ActionList/actionLibrary.js').StartMoveForward;
// var StopMoveForward = require('../ActionList/actionLibrary.js').StopMoveForward;
// var StartMoveBackward = require('../ActionList/actionLibrary.js').StartMoveBackward;
// var StopMoveBackward = require('../ActionList/actionLibrary.js').StopMoveBackward;
function AgentBrain(agent) {
    // this.visualMemory = [];
    this.agent = agent;
    this.actionList = new ActionList();
    this.waitTicks = 0;
    this.woodID = 17;
    this.wood = false;
    this.viewDistance = 10;
    this.toFind = ["Wood", "Leaves"];
    this.directionScores = {};
    this.findScores = {};
    this.walkScores = {};
    this.chopScores = {};
    this.totalTime = 0;
    this.exploreChance = 1;
    //this.toFind = ["dirt"];
    // this.actionSequence = ROUTINE.States.LOOKINGFORWOOD;
    // this.actionCursor = 0;
}


/**
 * Returns
 */
AgentBrain.prototype.determineFind = function(direction) {
	var possibleActions = [
		new ActionLibrary.Look(),
		new ActionLibrary.LookRandom(direction),
		new ActionLibrary.StartMoveForward()
	];
}

AgentBrain.prototype.determineBest = function(map) {
	var DEFAULT = 0;
	var best = DEFAULT;
	var bestScore = -10000;
	var zeroCount = 0;
	var count = 0;
	for (let entry in map) {
		count++;
		//console.log("score for "+entry+": "+map[entry]);
		if (map[entry] === 0)
			zeroCount++;
		if (map[entry] > bestScore) {
			bestScore = map[entry];
			best = entry;
		}
	}
	var explore = false;
	if (bestScore === 0) { //if we're just starting out, explore
		explore = true;
	}
	if (zeroCount >= count / 2) { //if we haven't explored half the options yet, explore
		explore = true;
	}
	//randomly increasing chance based on how many unexplored options there are
	if (Math.floor(Math.random() * Math.floor(count - zeroCount)) == 0) { 
		explore = true;
	}
	if (bestScore < 0) { //if all the options are terrible, explore
		explore = true;
	}
	if (explore) {
		for (let entry in map) {
			if (map[entry] === 0 && Math.random() < ((zeroCount / count) / count)) {
				console.log("exploring entry "+entry+" as it has score 0");
				return entry;
			}
		}
		console.log("exploiting "+best+" instead of exploring with score " + bestScore);
		return best; //if they are all sub zero apparently...
	} else { //exploit
		console.log("exploiting "+best+" as with score " + bestScore);
		return best;
	}
}

var MAX_ACTIONS = 10; //max amount of scores to be stored in a list
var NUM_OF_ACTIONS = 5; //the # of base actions defined

AgentBrain.prototype.determineActions = function(scoreList) {
	var count = 0;
	var negCount = 0;
	for (let entry in scoreList) {
		if (!isNaN(scoreList[entry])) {
			count++;
			if (scoreList[entry] < 0)
				negCount++;
		}
	}
	console.log("The size of the scorelist is: "+count)
	//var size = Object.keys(scoreList).length;
	var toReturn = [];
	var start = true;
	if (this.exploreChance === undefined)
		this.exploreChance = 1;
	this.exploreChance = (MAX_ACTIONS - count) / MAX_ACTIONS;
	if (Math.random() < this.exploreChance || (negCount + 2 >= count && count >= MAX_ACTIONS / 2)) { //make a new action instead
		//this.exploreChance *= 0.98;
		console.log("[DETERMINE ACTIONS] Explore chance is now " + this.exploreChance);
		if (scoreList === undefined) {
			console.log("undefined??? initializing score list");
			scoreList = {};
		}
		var highestScore = 0;
		var highestList = undefined;
		for (let action in scoreList) {
			if (scoreList[action] > highestScore) {
				highestScore = scoreList[action];
				highestList = action;
			}
		}
		var noMutate = false;
		var mutateAttempts = 0;
		while (toReturn.length === 0 || (scoreList[toReturn] != undefined)) {
			var actionCount = 0;
			var chanceToStay = 1;
			toReturn = [];
			if ((negCount + 2 >= count || Math.random() >= 0.5) && highestList != null && !noMutate) {
				mutateAttempts++;
				var list = [];
			    for (i = 0; i < highestList.length; i++) {
			    	if (!isNaN(highestList[i])) {
						list.push(highestList[i]);
			    	}
			    }
			    if (list.length > 1) {
					console.log("[MUTATE] Attepting to mutate the best list ["+ list +"] which has score "+highestScore);
				    //pick a random element to mutate or remove
				    var toChange = Math.floor(Math.random() * (list.length - 1));
				    if (Math.random() < 0.66 && list.length > 1) { //remove
				    	list.splice(toChange, 1);
						console.log("[MUTATE] Delete element: #"+toChange+" - new: "+list);
				    } else if (Math.random() < 0.5) { //swap
				    	list[toChange] = Math.floor(Math.random() * Math.floor(NUM_OF_ACTIONS));
						console.log("[MUTATE] Swapped element #"+toChange+". New list: "+list);
				    } else {
				    	var newElement = Math.floor(Math.random() * Math.floor(NUM_OF_ACTIONS));
				    	list.push(newElement);
						console.log("[MUTATE] Adding new element: "+newElement+". New list: "+list);
				    }
				    toReturn = list;
				    scoreList[list] = 0;
			    } else {
			    	noMutate = true;
			    }
			    if (mutateAttempts >= 5)
			    	noMutate = true;
			} else while (actionCount < 5) {
				toReturn.push(Math.floor(Math.random() * Math.floor(NUM_OF_ACTIONS)));
				actionCount++;
				chanceToStay *= 0.5;
				if (Math.random() > chanceToStay) {
					break;
				}
			}
			console.log("attempting to create new actionlist: "+toReturn+" - exists = "+(scoreList[toReturn] != undefined)+", nan = "+isNaN(scoreList[toReturn])+", length = "+toReturn.length);
			if (toReturn.length > 0 && (scoreList[toReturn] === undefined || isNaN(scoreList[toReturn]))) {
				console.log("we are using "+toReturn);
				scoreList[toReturn] = 0;
				break; //
			}
		}
		return toReturn;
	}
	console.log("[DETERMINE ACTIONS] Exploiting. Explore chance was: " + this.exploreChance);
	//exploit instead
	toReturn = AgentBrain.prototype.determineBest(scoreList);
	return toReturn;
}


/**
 * Returns a direction delta, between -pi/2 to pi/2, based on scores saved in the map.
 * If no scores are saved, uses 0 by default. Successes and failures increase/decrease score.
 */
AgentBrain.prototype.determineDirection = function() {
	var DEFAULT = 0;
	var bestDirection = DEFAULT;
	var bestScore = -10000;
	var zeroCount = 0;
	var count = 0;
	for (let direction in this.directionScores) {
		count++;
		console.log("score for "+direction+": "+this.directionScores[direction]);
		if (this.directionScores[direction] === 0)
			zeroCount++;
		if (this.directionScores[direction] > bestScore) {
			bestScore = this.directionScores[direction];
			bestDirection = direction;
		}
	}
	/*if (bestScore > -500000000)
		return (- Math.PI / 2); //temp*/
	var explore = false;
	if (bestScore === 0) { //if we're just starting out, explore
		explore = true;
	}
	if (zeroCount >= count / 2) { //if we haven't explored half the options yet, explore
		explore = true;
	}
	//randomly increasing chance based on how many unexplored options there are
	if (Math.floor(Math.random() * Math.floor(count - zeroCount)) == 0) { 
		explore = true;
	}
	if (bestScore < 0) { //if all the options are terrible, explore
		explore = true;
	}
	if (explore) {
		for (let direction in this.directionScores) {
			if (this.directionScores[direction] === 0) {
				console.log("exploring direction "+direction+" as it has score 0");
				return direction;
			}
		}
	    for (i = 0; i <= 10; i++) {
	    	this.directionScores[(i * Math.PI * 2) / 10] = 0;
	    }
		console.log("exploiting "+bestDirection+" as last resort with score " + bestScore + ". resetting directions");
		return bestDirection; //if they are all sub zero apparently...
	} else { //exploit
		console.log("exploiting "+bestDirection+" as with score " + bestScore);
		return bestDirection;
	}
}

function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

/**
 * Evaluates directional data from the actionlist.
 */
AgentBrain.prototype.evaluate = function(actionList, time) {
	if (this.directionScores === undefined) {
		console.log("undefined? initializing directionscores");
		this.directionScores = {};
	}
	if (this.directionScores[actionList.direction] === undefined) {
	    for (i = 0; i <= 10; i++) {
	    	this.directionScores[(i * Math.PI * 2) / 10] = 0;
	    }
	}
    var allNeg = true;
	for (let direction in this.directionScores) {
		if (this.directionScores[direction] >= 0)
			allNeg = false;
	}
	if (allNeg) {
		console.log("[DIRECTION] directions have been reset.");
	    for (i = 0; i <= 10; i++) {
	    	this.directionScores[(i * Math.PI * 2) / 10] = 0;
	    }
	}
	console.log("actionlist direction was just "+actionList.direction+", abort = "+actionList.abort);
	if (actionList.abort) {
		if (this.directionScores[actionList.direction] > 2) {
			this.directionScores[actionList.direction] /= 2;			
		} else
			this.directionScores[actionList.direction]--;
	} else {
		this.directionScores[actionList.direction] = 15 / time;
	}
	console.log("new score: "+this.directionScores[actionList.direction]);
}

/**
 * Evaluates a single set of actions (e.g. findactions) and returns an updated score list.
 * If time is -1, that means it was an abort
 */
AgentBrain.prototype.updateScores = function(scoreList, actions, time) {
	if (scoreList === undefined) {
		console.log("undefined? initializing score list");
		scoreList = {};
	}
	if (scoreList[actions] === undefined) {
		scoreList[actions] = 0;
		console.log("[UPDATE SCORES] init: find actionlist "+actions+" has score "+scoreList[actions]);
	}
	var lowestScore = 0;
	var lowestList = undefined;
	var highestScore = 0;
	var highestList = undefined;
	var negCount = 0;
	var count = 0;
	for (let action in scoreList) {
		console.log(" - action "+action+" has score "+scoreList[action]);
		if (!isNaN(scoreList[action])) {
			count++;
			if (scoreList[action] < lowestScore) {
				lowestScore = scoreList[action];
				lowestList = action;
			}
			if (scoreList[action] > highestScore) {
				highestScore = scoreList[action];
				highestList = action;
			}
			if (scoreList[action] < 0) {
				negCount++;
			}
		}
	}
	console.log("current action list: "+actions);
	console.log("negcount: "+negCount+", count: "+count+", maxactions: "+MAX_ACTIONS+", lowestlist defined: "+(lowestList != undefined));
	if (time === -1) { //abort
		if (((negCount + 2 >= count && count >= MAX_ACTIONS / 2) || count >= MAX_ACTIONS - 1 || Math.random() < 0.5) && lowestList != undefined) { //DUMP ACTION
			console.log("[DELETE] "+lowestList+" was deleted with score "+lowestScore);
			delete scoreList[lowestList];
		}
		if (scoreList[actions] > 2) {
			scoreList[actions] /= 2;
		} else {
			/*if (scoreList[actions] <= 1 && Math.random() < 0.5) { //before we make it negative... can we fix it?
				var list = [];
			    for (i = 0; i < actions.length; i++) {
			    	if (!isNaN(actions[i])) {
						list.push(actions[i]);
			    	}
			    }
			    if (list.length > 1) {
					console.log("[MUTATE] Attepting to fix "+list);
				    //pick a random element to mutate or remove
				    var toChange = list[Math.floor(Math.random() * list.length)];
				    if (Math.random() < 0.5) { //remove
				    	list.splice(toChange, 1);
						console.log("[MUTATE] "+actions+" was mutated (deletion) to "+list);
				    } else {
				    	list[toChange] = Math.floor(Math.random() * Math.floor(NUM_OF_ACTIONS));
						console.log("[MUTATE] "+actions+" was mutated (swap) to "+list);
				    }
				    scoreList[list] = 0;
					delete scoreList[actions];
			    }
			}*/
			scoreList[actions]--;
		}
	} else {
		if (scoreList[actions] <= 0)
			scoreList[actions] += 3 + (15 / time);
		else
			scoreList[actions] *= 4;
		//scoreList[actions] = 15 / time;
	}
	console.log("[UPDATE SCORES] Returning a score list of length " + count);
	return scoreList;
}

AgentBrain.prototype.makeSequence = function() {
	/*var count = 0;
	for (let entry in this.findScores) {
		count++;
		console.log("@@@@findscore: "+entry+" score "+this.findScores[entry]);
	}
    console.log("@@@@Findscores: "+count);*/
	var direction = AgentBrain.prototype.determineBest(this.directionScores);
	console.log("===FIND ACTIONS===")
	var findActions = AgentBrain.prototype.determineActions(this.findScores);
	console.log("===WALK ACTIONS===")
	var walkActions = AgentBrain.prototype.determineActions(this.walkScores);
	console.log("===CHOP ACTIONS===")
	var chopActions = AgentBrain.prototype.determineActions(this.chopScores);
    var testSequence = new BehaviourLibrary.GetWood(direction); // Objective / Testing Objective
    var find = new BehaviourLibrary.FindWood();
    var fail = false;
    //find.pushBack(new ActionLibrary.LookRandom(direction));
    //find.pushBack(new ActionLibrary.Look())
    //find.pushBack(new ActionLibrary.StartMoveForward());
    find.block();
    var that = this;
    find.on('failed', function() {
        console.log('Failed to find wood!')
        testSequence.abort = true;
        that.findScores = AgentBrain.prototype.updateScores(that.findScores, findActions, -1);
    });
    find.on('completed', function() {
        console.log('Found wood!');
        that.findScores = AgentBrain.prototype.updateScores(that.findScores, findActions, testSequence.totalTime);
        console.log("[SUCCESS - FIND WOOD] Actions were: " + findActions +". Score is now: "+that.findScores[findActions]);
    })
    var walk = new BehaviourLibrary.WalkToWood();
    /*walk.pushBack(new ActionLibrary.StartMoveForward());
    walk.pushBack(new ActionLibrary.Look())*/
    walk.block();
    walk.on('failed', function() {
        console.log('Failed to walk to wood!')
        testSequence.abort = true;
        that.walkScores = AgentBrain.prototype.updateScores(that.walkScores, walkActions, -1);
    });
    walk.block();
        walk.on('completed', function() {
        console.log('Next to wood!')
        that.walkScores = AgentBrain.prototype.updateScores(that.walkScores, walkActions, testSequence.totalTime);
        console.log("[SUCCESS - WALK TO WOOD] Actions were: " + walkActions +". Score is now: "+that.walkScores[walkActions]);
    })
    var chop = new BehaviourLibrary.ChopWood();
    //chop.pushBack(new ActionLibrary.BreakBlock());
    chop.block();
    chop.on('failed', function() {
        console.log('Failed to chop wood!')
        testSequence.abort = true;
        that.chopScores = AgentBrain.prototype.updateScores(that.chopScores, chopActions, -1);
    });
    chop.on('completed', function() {
        console.log('Chopped wood successfully');
        that.chopScores = AgentBrain.prototype.updateScores(that.chopScores, chopActions, testSequence.totalTime);
        console.log("[SUCCESS - CHOP WOOD] Actions were: " + chopActions +". Score is now: "+that.chopScores[chopActions]);
    })
    for (i = 0; i < findActions.length; i++) {
    	if (!isNaN(findActions[i])) {
			console.log("[FIND WOOD] adding action id "+findActions[i]);
			testSequence.findActions.push(findActions[i]);
    	}
    }
    for (i = 0; i < walkActions.length; i++) {
    	if (!isNaN(walkActions[i])) {
			console.log("[WALK TO WOOD] adding action id "+walkActions[i]);
			testSequence.walkActions.push(walkActions[i]);
    	}
    }
    for (i = 0; i < chopActions.length; i++) {
    	if (!isNaN(chopActions[i])) {
			console.log("[CHOP WOOD] adding action id "+chopActions[i]);
			testSequence.chopActions.push(chopActions[i]);
    	}
    }
    //testSequence.findActions.push(1);
    testSequence.pushBack(find); // Step 1
    testSequence.pushBack(walk); // Step 2
    testSequence.pushBack(chop); // Step 3
    testSequence.direction = direction;
    return testSequence;
}
AgentBrain.prototype.start = function () {
    // var testWait = actionUtils.serial([new ActionLibrary.Wait(3000)]);

    // var findWood = actionUtils.parallel([new ActionLibrary.LookRandom(), new ActionLibrary.StartMoveForward()]);
    // var walkToWood = actionUtils.serial([new ActionLibrary.StartMoveForward()]);
    // var chopWood = actionUtils.serial([new ActionLibrary.BreakBlock()]);
    // var getWood = actionUtils.serial([findWood, walkToWood, chopWood]);

    // var testSequence = actionUtils.serial([new ActionLibrary.StartMoveForward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StopMoveForward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StartMoveBackward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StopMoveBackward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StartMoveForward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StopMoveForward()]);
    this.actionList = AgentBrain.prototype.makeSequence();
    this.totalTime = 0;
}

// function rayPlayerHeight(from_player) {
//     var cursor = from_player.entity.position.offset(0, from_player.entity.height, 0);
//     var yaw = from_player.entity.yaw, pitch = from_player.entity.pitch;
//     var vector_length = 0.3;
//     var x = -Math.sin(yaw) * Math.cos(pitch);
//     var y = Math.sin(pitch);
//     var z = -Math.cos(yaw) * Math.cos(pitch);
//     var step_delta = mineflayer.vec3(x * vector_length, y * vector_length, z * vector_length);

//     for (var i = 0; i < 192; i++) {
//         cursor = cursor.plus(step_delta);
//         // console.log(cursor)
//         var block = from_player.blockAt(cursor);
//         if (block.diggable) {
//             return block;
//             // return cursor.floored();
//         }
//     }
//     return undefined;
// };

AgentBrain.prototype.look = function () {
    var entity = this.agent.bot.entity;
    var cursor = entity.position.offset(0, entity.height * 0.75, 0); // Eye Level?
    var vectorLength = 0.3;
    var yaw = entity.yaw, pitch = entity.pitch;
    var x = -Math.sin(yaw) * Math.cos(pitch);
    var y = Math.sin(pitch);
    var z = -Math.cos(yaw) * Math.cos(pitch);
    var step_delta = new Vec3(x * vectorLength, y * vectorLength, z * vectorLength);
    this.wood = null;
    for (var i = 0; i < this.viewDistance; ++i) {
        cursor = cursor.plus(step_delta);
        var block = this.agent.bot.blockAt(cursor);
        if (block !== null && block.boundingBox !== "empty") { // Check if the block is not empty
            //console.log(block)
            for (j = 0; j < this.toFind.length; j++) {
            	//if (block.displayName !== null)
            	//console.log("looking at "+block.displayName+"... is it "+this.toFind[j]+"?");
            	if (block.displayName === this.toFind[j] || block.displayName.includes(this.toFind[j])) {
            		this.wood = block;
                	console.log("found a valid block: " + block.displayName);
            		break;
            	}
            }
            if (this.wood !== null)
            	break;
        }
    }
}

AgentBrain.prototype.hasWood = function () {
    var inv = this.agent.bot.inventory.slots.filter(Boolean);

    for (var i = inv.length - 1; i >= 0; --i) {
        if (inv[i].type === this.woodID) {
            return true;
        }
    }
    return false;
}

AgentBrain.prototype.nextToWood = function () {
    var entity = this.agent.bot.entity;
    var cursor = entity.position.offset(0, entity.height * 0.75, 0); // Eye Level?
    var vectorLength = 0.3;
    var yaw = entity.yaw, pitch = entity.pitch;
    var x = -Math.sin(yaw) * Math.cos(pitch);
    var y = Math.sin(pitch);
    var z = -Math.cos(yaw) * Math.cos(pitch);
    var step_delta = new Vec3(x * vectorLength, y * vectorLength, z * vectorLength);
    this.wood = null;
    for (var i = 0; i < this.viewDistance; ++i) {
        cursor = cursor.plus(step_delta);
        var block = this.agent.bot.blockAt(cursor);
        if (block !== null && block.boundingBox !== "empty") { // Check if the block is not empty
            for (j = 0; j < this.toFind.length; j++) {
            	//if (block.displayName !== null)
            	//console.log("looking at "+block.displayName+"... is it "+this.toFind[j]+"?");
            	if (block.displayName === this.toFind[j] || block.displayName.includes(this.toFind[j])) {
            		this.wood = block;
                	console.log("found a valid block: " + block.displayName);
            		break;
            	}
            }
            if (this.wood !== null)
            	break;
        }
    }
    console.log("updated next to wood: "+(this.wood !== null && this.agent.bot.entity.position.distanceTo(this.wood.position) < 2));
    if(this.wood !== null) {
            if (this.agent.bot.entity.position.distanceTo(this.wood.position) < 2)
    {
        return true;
    }
    }

    return false;
}

// AgentBrain.prototype.findItem = function(inventory, itemId) {
//   // Remove empty slots to speed up process
//   var inv = inventory.slots.filter(Boolean);

//   for(var i = inv.length - 1; i >= 0; i--) {
//     if(inv[i].type === itemId) {
//       return inv[i];
//     }
//   }
//   return false;
// }

AgentBrain.prototype.update = function (delta) {
	if (this.waitTicks > 0) {
		this.waitTicks--;
		if (this.waitTicks == 0)
		    this.totalTime = 0; //reset
	} else {
		if (this.actionList.size === 0) {
			if (this.actionList.abort)
				this.waitTicks = 5;
			else
				this.waitTicks = 50;
			//console.log("total time FINISH: "+this.totalTime);
			console.log("finished in "+this.totalTime+" ticks! starting anew in " + this.waitTicks + " ticks...");
			AgentBrain.prototype.evaluate(this.actionList, this.totalTime);
		    this.actionList = AgentBrain.prototype.makeSequence();
		} else {
			this.totalTime++;
			//console.log("total time: "+this.totalTime);
			this.actionList.update(delta, this.agent);
		}
	}
}

AgentBrain.prototype.pause = function () {
    this.actionList.pause();
}

module.exports = AgentBrain;