/**
 * Created by HOANG on 9/22/2018.
 */

var FishPacketListener = cc.Class.extend({
    ctor: function () {

    },
    onDisconnect: function () {
        if(fishLifeCycle)
        {
            fishLifeCycle.gameScene.auto_shoot = false;
        }
    },
    onReceived: function (cmd, p) {
        //cc.log("Fish ->>>Listener::onReceived :" + cmd);

        switch (cmd) {
            case CMD.CMD_QUICK_JOIN:
            {
                var pk = new BCCmdReceivedJoinRoomSuccess(p);
                pk.clean();

                cc.log(JSON.stringify(pk));

                fishLifeCycle = new FishLifeCycle();
                fishLifeCycle.onJoinRoomSucess(pk);

                break;
            }
            case CMD.CMD_UPDATE_ROUND:
            {
                var pk = new BCCmdReceivedUpdateRound(p);
                pk.clean();
                cc.log("update round" + fishLifeCycle);
                cc.log(JSON.stringify(pk));
                if(fishLifeCycle)
                    fishLifeCycle.onUpdateRound(pk);
                break;
            }
            case CMD.CMD_START_SHOOT:
            {
                var pk = new BCCmdReceivedStartShoot(p);
                pk.clean();
                if(fishLifeCycle)
                    fishLifeCycle.onStartShoot(pk);
                cc.log("start shoot: " + JSON.stringify(pk));
                break;
            }
            case CMD.CMD_SHOOT_RESULT:
            {
                var pk = new BCCmdReceivedShootResult(p);
                pk.clean();
                if(fishLifeCycle)
                    fishLifeCycle.onShootResult(pk);
                cc.log("shoot result: " +JSON.stringify(pk));
                break;
            }
            case CMD.CMD_USER_JOIN_ROOM:
            {
                var ujoin = new BCCmdReceivedUserJoinRoom(p);
                fishLifeCycle.onUserJoin(ujoin);
                ujoin.clean();

                break;
            }
            case CMD.CMD_USER_EXIT:
            {
                var pk = new BCCmdReceivedUserExitRoom(p);
                fishLifeCycle.onUserExit(pk);

                break;
            }
            case CMD.CMD_ADD_FISH:
            {
                var pk = new BCCmdReceivedAddFish(p);
                pk.clean();
                //cc.log("add fish :" +JSON.stringify(pk.listFish.length));
                fishLifeCycle.onAddFish(pk);


                break;
            }
            case CMD.CMD_STATE_CHANGE:
            {
                var pk = new BCCmdReceivedStateChange(p);
                pk.clean();
                fishLifeCycle.onStateChange(pk);
                break;
            }
            case CMD.CMD_MATRIX_DATA:
            {
                var pk = new BCCmdReceivedMatrixData(p);
                pk.clean();
                fishLifeCycle.onMatrixData(pk);
                break;
            }
            case CMD.CMD_LOCK_FISH:
            {
                var pk = new BCCmdReceivedLockFish(p);
                pk.clean();
                fishLifeCycle.onLockFish(pk);
                break;
            }
            case CMD.CMD_UPDATE_BG:
            {
                var pk = new BCCmdReceivedUpdateBG(p);
                pk.clean();
                fishLifeCycle.onUpdateBG(pk);
                break;
            }

        }
    }
});



var fishBZ = {}

fishBZ.sendStartShoot = function(bet,x,y)
{
        var pk = new BCCmdSendStartShoot();
        pk.putData(bet,x,y);
        BCGameClient.getInstance().sendPacket(pk);
        pk.clean();
        cc.log("send start shoot")

}

fishBZ.sendShootFish =  function(bet,fish_id)
{
    var pk = new BCCmdSendShootSuccess();
    pk.putData(bet,fish_id);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
    //cc.log("-------------------------------")
    //cc.log(fishLifeCycle.players[fishLifeCycle.myChair].playerData.rawData["username"] + "send shoot fish :" + fish_id );
    //cc.log("++++++++++++++++++++++++++++++++++++")

}

fishBZ.sendLockFish = function(isLock,fish_id){
    var pk = new BCCmdSendLockFish();
    pk.putData(isLock,fish_id);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendQuit = function()
{
    var pk = new BCCmdSendQuit();
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendExchange = function (money, isToVin, captcha) {
    var pk = new BCCmdSendExchange();
    pk.putData(money,isToVin,captcha);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendRequestCaptcha = function () {
    var pk = new BCCmdSendRequestCaptcha();
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendRequestHistory = function (type,offset,size) {
    var pk = new BCCmdSendRequestHistoty();
    pk.putData(type,offset,size);
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}
fishBZ.sendRequestTop = function () {
    var pk = new BCCmdSendRequestTop();
    BCGameClient.getInstance().sendPacket(pk);
    pk.clean();
}


