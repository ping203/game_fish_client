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

            case CMD.CMD_CONFIG:
            {
                var pk = new BCCmdReceivedConfig(pkg);
                gameData.config = JSON.parse(pk.jsonConfig);


                break;
            }

            case CMD.CMD_EXCHANGE:
            {
                var pk = new BCCmdReceivedExchange(pkg);
                bcSceneMgr.clearLoading();
                var error = pk.getError();

                var main = bcSceneMgr.getMainLayer();
                var shop = main.getChildByTag(1000);

                var msg = "";
                switch (error)
                {
                    case 0 :
                    {
                        var money = BCStringUtility.standartNumber(pk.money_exchange);
                        msg = pk.isToVin?"Bạn đã đổi thành công "+money +" VÀNG thành " +money+" MAN":"Bạn đã đổi thành công "+money+" MAN thành "+money+" VÀNG";
                        gameData.userData.vinMoney = pk.vinMoney;
                        gameData.userData.gold = pk.gold;

                        updateManPortal(gameData.userData.vinMoney);

                        if(shop && (shop instanceof ShopLayer))
                        {
                            shop.tfCapcha.setString("");
                        }

                        main.onUpdateData();
                        break;
                    }
                    default:
                    {
                        msg = pk.message;
                        break;
                    }

                }

                BCDialog.showDialog(msg,this,function (id) {
                    fishBZ.sendRequestCaptcha();
                })
                break;
            }
            case CMD.CMD_LIXI:
            {
                cc.log("lixi");
                var pk = new BCCmdReceivedLixi(pkg);

                gameData.userData.gold = pk.gold;

                var main = bcSceneMgr.getMainLayer();
                var shop = main.getChildByTag(1000);
                main.onUpdateData();

                var dialog = BCDialog.showDialogWithoutRemoveOther("Chúc mừng bạn nhận được \n"+BCStringUtility.standartNumber(pk.goldLixi)+" VÀNG lì xì từ THẦN BIỂN \n CHÚC MỪNG NĂM MỚI",this,function (id) {
                    // fishBZ.sendRequestCaptcha();
                })


                var animLixi =  sp.SkeletonAnimation.createWithJsonFile("res/FX/lixi/skeleton.json","res/FX/lixi/skeleton.atlas");
                animLixi.setAnimation(0,"animation",true);
                animLixi.setPosition(420,275);

                dialog._bg.addChild(animLixi,0);
                dialog._btnOK.setLocalZOrder(10);
                dialog._btnCancel.setLocalZOrder(10);
                dialog._lbMessage.setLocalZOrder(10);
                dialog._btnOK.setPositionY(dialog._btnOK.getPositionY()-20);
                dialog._lbMessage.setPositionY(340);


                break;
            }
            case CMD.CMD_CAPTCHA:
            {
                var pk = new BCCmdReceivedCaptcha(pkg);

                var main = bcSceneMgr.getMainLayer();
                var shop = main.getChildByTag(1000);
                if(shop && (shop instanceof ShopLayer))
                {
                    shop.loadCaptcha(pk.captchaStr);
                }
                break;
            }
            case CMD.CMD_HISTOTY:
            {
                var pk = new BCCmdReceivedHistory(pkg);
                var main = bcSceneMgr.getMainLayer();
                var layerHistory = main.getChildByTag(1000);

                if(layerHistory && (layerHistory instanceof HistoryLayer))
                {
                    layerHistory.updateHistory(pk.type,pk.lastPage,pk.dataHisoty);
                }
                break;
            }
            case CMD.CMD_TOP:
            {
                var pk = new BCCmdReceivedGetTop(pkg);
                var main = bcSceneMgr.getMainLayer();
                var layer = main.getChildByTag(1000);

                if(layer && (layer instanceof BCTopLayer))
                {
                    layer.updateData(pk.data);
                }
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
        this.gameListenner.onDisconnect();
        cc.log("on Disconnected");

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