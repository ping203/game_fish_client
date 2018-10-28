/**
 * Created by HOANG on 9/22/2018.
 */

var FishPacketListener = cc.Class.extend({
    ctor: function () {

    },
    onReceived: function (cmd, p) {
        cc.log("Fish ->>>Listener::onReceived :" + cmd);

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
                cc.log("update round");
                cc.log(JSON.stringify(pk));
                fishLifeCycle.onUpdateRound(pk);
                break;
            }
            case CMD.CMD_START_SHOOT:
            {
                var pk = new CmdReceivedStartShoot(p);
                pk.clean();
                fishLifeCycle.onStartShoot(pk);
                cc.log(JSON.stringify(pk));

                break;
            }
            case CMD.CMD_SHOOT_RESULT:
            {
                var pk = new CmdReceivedShootResult(p);
                pk.clean();
                fishLifeCycle.onShootResult(pk);
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
            case CMD.CMD_ADD_FISH:
            {
                var pk = new CmdReceivedAddFish(p);
                pk.clean();
                cc.log("add fish :" +JSON.stringify(pk.listFish.length));
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
        }
    }
});



var fishBZ = {}

fishBZ.sendStartShoot = function(bet,x,y)
{
    var pk = new CmdSendStartShoot();
    pk.putData(bet,x,y);
    GameClient.getInstance().sendPacket(pk);
    pk.clean();
}

fishBZ.sendShootFish =  function(bet,fish_id)
{
    var pk = new CmdSendShootSuccess();
    pk.putData(bet,fish_id);
    GameClient.getInstance().sendPacket(pk);
    pk.clean();
}