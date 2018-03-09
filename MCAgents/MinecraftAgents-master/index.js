var AgentManager = require('./agentManager.js');
var actionUtils = require('./ActionList/actionUtils');

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node echo.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

var agentManager = new AgentManager(process.argv[2], parseInt(process.argv[3]), process.argv[4], process.argv[5]);

agentManager.start();