// var intro:Action = 
//   serial
//   (
//     new Wait(WAIT_TIME), 
//     new TweenTo(logo, TWEEN_TIME, { alpha: 1.0 }), 
//     new Wait(WAIT_TIME), 
     
//     parallel
//     (
//       new TweenTo(button1, TWEEN_TIME, { y: 100 }), 
//       new TweenTo(button2, TWEEN_TIME, { y: 200 }), 
//       new TweenTo(button3, TWEEN_TIME, { y: 300 })
//     )
//   );
var ActionList = require('./actionList.js');

function parallel(actions)
{
    var actionList = new ActionList();
    actions.forEach(function(action) {
        // if (!action instanceof Action)
        //     return;
        action.unblock();
        actionList.pushBack(action);
    }, this);

    return actionList;
}

function serial(actions)
{
    var actionList = new ActionList();
    actions.forEach(function(action) {
        // if (!action instanceof Action)
        //     return;
        action.block();
        actionList.pushBack(action);
    }, this);
    return actionList;
}

module.exports = {
    parallel,
    serial
}