/*
 * Jumping is fun. Riding pigs is even funnier!
 *
 * Learn how to make your bot interactive with this example.
 *
 * This bot can move, jump, ride vehicles, attack nearby entities and much more.
 */
var mineflayer = require('mineflayer');

if(process.argv.length < 4 || process.argv.length > 6) {
  console.log("Usage : node index.js <host> <port> [<name>] [<password>]");
  process.exit(1);
}

var bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : "bot",
  password: process.argv[5],
  verbose: true,
});

var target = null;

bot.on('chat', function(username, message) {
  if(username === bot.username) return;
//   target = bot.players[username].entity;
  var entity;
  switch(message) {

      //The directions are binary because keyboards are binary. We can change the underlying code to use a vector if need be.
    case 'forward':
      bot.setControlState('forward', true);
      break;
    case 'forwardtest':
      bot.setControlState('forward', true);
      bot.setControlState('forward', false)
      break;
    case 'forwardLeft':
      bot.setControlState('forward', true);
           bot.setControlState('left', true);
      break;
        case 'forwardRight':
      bot.setControlState('forward', true);
           bot.setControlState('right', true);
      break;
    case 'back':
      bot.setControlState('back', true);
    case 'backLeft':
      bot.setControlState('back', true);
      bot.setControlState('left', true);
      break;
    case 'backRight':
        bot.setControlState('back', true);
        bot.setControlState('right', true);
      break;
    case 'left':
      bot.setControlState('left', true);
      break;
    case 'right':
      bot.setControlState('right', true);
      break;
    case 'sprint':
      bot.setControlState('sprint', true);
      break;
    case 'stop':
      bot.clearControlStates();
      bot.clearControlStates();
      break;
    case 'jump':
      bot.setControlState('jump', true);
      bot.setControlState('jump', false);
      break;
    case 'jump a lot':
      bot.setControlState('jump', true);
      break;
    case 'stop jumping':
      bot.setControlState('jump', false);
      break;
    case 'attack':
      bot.attack(null, true);
      // entity = nearestEntity();
      // if(entity) {
      //   bot.attack(entity, true);
      // } else {
      //   bot.chat('no nearby entities');
      // }
      break;
    case 'pos':
      bot.chat(bot.entity.position);
      break;
    case 'ray':
    var block = rayPlayerHeight(bot);
    bot.chat("I am looking at: " + block.displayName + " at " + block.position)
        // bot.chat();
      break;
      // yaw and pitch can be used with bot.look
    case 'lookForward':
        bot.lookAt(bot.entity.position.offset(1, bot.entity.height, 0))
      break;
    case 'yp':
      bot.chat("Yaw " + bot.entity.yaw + ", pitch: " + bot.entity.pitch);
      break;
  }
})

// bot.once('spawn', function() {
// }
  // keep your eyes on the target, so creepy!
//   setInterval(watchTarget, 50);

//   function watchTarget() {
//     if(!target) return;
//     bot.lookAt(target.position.offset(0, target.height, 0));
//   }
// });

// Steps can be adjusted or whatever
function rayPlayerHeight(from_player) {
    var pos = from_player.entity.position;
    var cursor = from_player.entity.position.offset(0, from_player.entity.height, 0);
    var yaw = from_player.entity.yaw, pitch = from_player.entity.pitch;
    var vector_length = 0.3;
    var x = -Math.sin(yaw) * Math.cos(pitch);
    var y = Math.sin(pitch);
    var z = -Math.cos(yaw) * Math.cos(pitch);
    var step_delta = mineflayer.vec3(x * vector_length, y * vector_length, z * vector_length);
    for (var i = 0; i < 192; i++) {
        cursor = cursor.plus(step_delta);
        console.log(cursor)
        var block = from_player.blockAt(cursor);
        if (block.diggable) {
            return block;
            // return cursor.floored();
        }
    }
    return undefined;
};

function nearestEntity(type) {
  var id, entity, dist;
  var best = null;
  var bestDistance = null;
  for(id in bot.entities) {
    entity = bot.entities[id];
    if(type && entity.type !== type) continue;
    if(entity === bot.entity) continue;
    dist = bot.entity.position.distanceTo(entity.position);
    if(!best || dist < bestDistance) {
      best = entity;
      bestDistance = dist;
    }
  }
  return best;
}