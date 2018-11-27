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
            var pk = new BCCmdSendLogin();
            pk.putData(gameData.nickName,gameData.accessToken);
            BCGameClient.getInstance().sendPacket(pk);
        }
        else
        {
            bcSceneMgr.clearLoading();
            // BCDialog.showDialog("Kết nối đến máy chủ thất bại, vui lòng thử lại!",this,function (id) {
            //     if(id == BCDialog.BTN_OK)
            //         BCGameClient.getInstance().connect(SERVER_IP,SERVER_PORT);
            //     else
            //     {
            //         if(lobbyThanBien)
            //         {
            //             fishSound.stopMusic();
            //             lobbyThanBien.onExitGame();
            //         }
            //         else
            //         {
            //             BCGameClient.getInstance().connect(SERVER_IP,SERVER_PORT);
            //         }
            //
            //     }
            // })
        }


    },
    onReceived: function(cmd,pkg){

        cc.log("onReceived: " + cmd);

        switch (cmd){
            case CMD.CMD_LOGIN:
            {
                var pk = new BCCmdReceivedLogin(pkg); // update user info

                gameData.userData.userName = pk.userName;
                gameData.userData.displayName = pk.displayName;
                gameData.userData.uID = pk.uID;
                gameData.userData.avatar = pk.avatar;
                gameData.userData.gold = pk.balance;
                gameData.userData.vinMoney = pk.vinMoney;

                cc.log("Login Sucessful")
                fishSound.playMusicLobby();
                var lobby = bcSceneMgr.getMainLayer();
                lobby.onUpdateData();

                bcSceneMgr.clearLoading();
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

        // bcSceneMgr.openWithScene(new LoginScene());

        BCDialog.showDialog("Bạn đã bị ngắt kết nối từ máy chủ!",this,function () {
            var lobbyScene = new LobbyScene();
            lobbyScene.withLogin();
            bcSceneMgr.openWithScene(lobbyScene);
            //
            BCGameClient.getInstance().setListener(lobbyListenner);
            BCGameClient.getInstance().connect(SERVER_IP,SERVER_PORT);
        })

    }
})


var lobbyListenner = new LobbyPacketListenner();