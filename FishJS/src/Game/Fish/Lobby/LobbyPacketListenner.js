/**
 * Created by admin on 10/25/18.
 */

var LobbyPacketListenner = cc.Class.extend({
    ctor: function(){
        this.gameListenner = new FishPacketListener();
    },
    onConnect: function(result){
        //this.gameListenner.onConnect(result);

        cc.log("connect :" + result);
        if(result)
        {
            var pk = new CmdSendLogin();
            pk.putData("vishiha","hoang154");
            GameClient.getInstance().sendPacket(pk);
        }


    },
    onReceived: function(cmd,pkg){

        cc.log("onReceved: " + cmd);

        switch (cmd){
            case CMD.CMD_LOGIN:
            {
                var pk = new CmdReceivedLogin(pkg);

                var pkQuickJoin = new CmdSendQuickJoin();
                GameClient.getInstance().sendPacket(pkQuickJoin);
                break;
            }

            default :
            {
                this.gameListenner.onReceived(cmd,pkg);
                break;
            }

        }


    },
    onDisconnect: function(){
        //this.gameListenner.onDisconnect();

    }
})


var lobbyListenner = new LobbyPacketListenner();