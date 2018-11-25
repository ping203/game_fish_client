/**
 * Created by HOANG on 9/22/2018.
 */

var FishPacketListener = cc.Class.extend({
    ctor: function () {

    },
    onReceived: function (cmd, p) {
        //cc.log("Fish ->>>Listener::onReceived :" + cmd);

        switch (cmd) {
            case CMD.CMD_QUICK_JOIN:
            {
                var pk = new CmdReceivedJoinRoomSuccess(p);
                pk.clean();

                cc.log(JSON.stringify(pk));

                fishLifeCycle = new FishLifeCycle();
                fishLifeCycle.onJoinRoomSucess(pk);

                break;
            }
            case CMD.CMD_UPDATE_ROUND:
            {
                var pk = new CmdReceivedUpdateRound(p);
                pk.clean();
                cc.log("update round" + fishLifeCycle);
                cc.log(JSON.stringify(pk));
                //if(fishLifeCycle)
                    fishLifeCycle.onUpdateRound(pk);
                break;
            }
            case CMD.CMD_START_SHOOT:
            {
                var pk = new CmdReceivedStartShoot(p);
                pk.clean();
                if(fishLifeCycle)
                    fishLifeCycle.onStartShoot(pk);

                break;
            }
            case CMD.CMD_SHOOT_RESULT:
            {
                var pk = new CmdReceivedShootResult(p);
                pk.clean();
                if(fishLifeCycle)
                    fishLifeCycle.onShootResult(pk);
                if(pk.isSuccess)
                    cc.log(JSON.stringify(pk));
                break;
            }
            case CMD.CMD_USER_JOIN_ROOM:
            {
                var ujoin = new CmdReceivedUserJoinRoom(p);
                fishLifeCycle.onUserJoin(ujoin);
                ujoin.clean();

                break;
            }
            case CMD.CMD_USER_EXIT:
            {
                var pk = new CmdReceivedUserExitRoom(p);
                fishLifeCycle.onUserExit(pk);

                break;
            }
            case CMD.CMD_ADD_FISH:
            {
                var pk = new CmdReceivedAddFish(p);
                pk.clean();
                //cc.log("add fish :" +JSON.stringify(pk.listFish.length));
                fishLifeCycle.onAddFish(pk);


                break;
            }
            case CMD.CMD_STATE_CHANGE:
            {
                var pk = new CmdReceivedStateChange(p);
                pk.clean();
                fishLifeCycle.onStateChange(pk);
                break;
            }
            case CMD.CMD_MATRIX_DATA:
            {
                var pk = new CmdReceivedMatrixData(p);
                pk.clean();
                fishLifeCycle.onMatrixData(pk);
                break;
            }
            case CMD.CMD_LOCK_FISH:
            {
                var pk = new CmdReceivedLockFish(p);
                pk.clean();
                fishLifeCycle.onLockFish(pk);
                break;
            }
        }
    }
});



var fishBZ = {}

fishBZ.sendStartShoot = function(bet,x,y)
{
    var pk = new CmdSendStartShoot();
    pk.putData(bet,x,y);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendShootFish =  function(bet,fish_id)
{
    var pk = new CmdSendShootSuccess();
    pk.putData(bet,fish_id);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
    //cc.log("-------------------------------")
    //cc.log(fishLifeCycle.players[fishLifeCycle.myChair].playerData.rawData["username"] + "send shoot fish :" + fish_id );
    //cc.log("++++++++++++++++++++++++++++++++++++")

}

fishBZ.sendLockFish = function(isLock,fish_id){
    var pk = new CmdSendLockFish();
    pk.putData(isLock,fish_id);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendQuit = function()
{
    var pk = new CmdSendQuit();
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}