var AgentBrain = require('./agentBrain.js')

function Agent(bot){
    this.bot = bot;
    this.brain = new AgentBrain(this);
    this.start();
    this.sprint = false;
}

Agent.prototype.update = function(){
    this.brain.update();
};

Agent.prototype.start = function()
{
    this.brain.start();
};

Agent.prototype.stop = function()
{
    this.brain.stop();
};

Agent.prototype.pause = function()
{
    this.brain.pause();
};

Agent.prototype.resume = function()
{
    this.brain.resume();
};

var Direction = {
    FORWARD: 'forward',
    BACKWARD: 'back',
    LEFT: 'left',
    RIGHT: 'right',
};

// There is a fancier way to do directions but lets not get too complicated yet

Agent.prototype.startSprint = function() {
	this.sprint = true;
    this.bot.setControlState('sprint', true);
};

Agent.prototype.stopStrint = function() {
	this.sprint = false;
    this.bot.setControlState('sprint', false);
};

Agent.prototype.jump = function() {
	this.bot.setControlState('jump', true);
	this.bot.setControlState('jump', false);
}

Agent.prototype.stopMove = function() {
    this.bot.clearControlStates();
    this.bot.clearControlStates();
};

Agent.prototype.dig = function(block) {
    if(this.brain.wood !== null) {
	    if (this.bot.targetDigBlock === null)
	        this.bot.dig(this.brain.wood);
    } else {
    	console.log("block is null, can't dig!");
    }
}

Agent.prototype.look = function(yaw, pitch) {
    this.bot.look(yaw, pitch);
};

Agent.prototype.lookAtPosition = function(position) {
	this.bot.lookAt(position);
};

Agent.prototype.startDiagonalMove = function(verticalDirection, horizontalDirection){
    this.toggleDirection(verticalDirection).start();
    this.toggleDirection(horizontalDirection).start();
};

Agent.prototype.stopDiagonalMove = function(verticalDirection, horizontalDirection)
{
    this.toggleDirection(verticalDirection).stop();
    this.toggleDirection(horizontalDirection).stop();
}

Agent.prototype.startMove = function(direction) {
    this.bot.setControlState(direction, true);
};

Agent.prototype.stopMove = function(direction) {
    this.bot.setControlState("forward", false);
    this.bot.setControlState("back", false);
}

Agent.prototype.ready = function()
{

    // console.log(this.bot.entity)
    //     console.log("here")
    if(this.bot.entity)
    {
        if(this.bot.entity.onGround)
        {
            return true;
        }
    }
    return false;
}

module.exports = Agent;
