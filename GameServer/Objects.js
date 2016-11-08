var shortid = require('shortid');

//-------------------------------------------------------------------------------------//  
//                                All Objects                                          //        
//-------------------------------------------------------------------------------------//

function player (result, data){
    
    var curPlayer = {
        playerid: shortid.generate(),

        name: result[0].name,
        channel: data.channel,

        money: result[0].money,
        level: result[0].level,

        location: result[0].location,
        pos: result[0].pos,

        accid: result[0].accid,
        charid: result[0].charid,

        objid: result[0].objid,

        moveSpeed: result[0].moveSpeed,
        rotSpeed: result[0].rotSpeed,

        lastposition: {
            x: 0,
            y: 0,
            z: 0
        },

        lastmovetime: 0
    };
    
    return curPlayer;
}

function move (data, player){
    
    var moveData = {
        posx: data.pos.x,
        posy: data.pos.y,
        
        posz: data.pos.z,
        
        moveSpeed: player.moveSpeed,
        rotSpeed: player.rotSpeed,
        
        state: data.state,
        time:Date.now(),
        
        playerid: player.playerid
    };
    
    return moveData;
}

module.exports.player = player;
module.exports.move = move;