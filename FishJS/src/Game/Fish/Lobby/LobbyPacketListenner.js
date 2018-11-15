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
            pk.putData(gameData.nickName,gameData.accessToken);
            GameClient.getInstance().sendPacket(pk);
        }


    },
    onReceived: function(cmd,pkg){

        cc.log("onReceived: " + cmd);

        switch (cmd){
            case CMD.CMD_LOGIN:
            {
                var pk = new CmdReceivedLogin(pkg); // update user info

                gameData.userData.userName = pk.userName;
                gameData.userData.displayName = pk.displayName;
                gameData.userData.uID = pk.uID;
                gameData.userData.avatar = pk.avatar;
                gameData.userData.gold = pk.balance;
                gameData.userData.vinMoney = pk.vinMoney;

                cc.log("Login Sucessful")
                fishSound.playMusicLobby();
                var lobby = sceneMgr.getMainLayer();
                lobby.onUpdateData();


                sceneMgr.clearLoading();
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
        cc.log("on Disconnected");
        sceneMgr.openWithScene(new LoginScene());

    }
})


var lobbyListenner = new LobbyPacketListenner();