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

            case CMD.CMD_EXCHANGE:
            {
                var pk = new BCCmdReceivedExchange(pkg);
                bcSceneMgr.clearLoading();
                var error = pk.getError();

                var main = bcSceneMgr.getMainLayer();
                var shop = main.getChildByTag(1000);
                if(shop && (shop instanceof ShopLayer))
                {

                }


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

                        main.onUpdateData();
                        break;
                    }
                    case 1:
                    {
                        msg = "Lỗi không xác định!";
                        break;
                    }
                    case 2:
                    {
                        msg = "Hệ thống xảy ra lỗi khi xử lí, vui lòng thử lại sau!";
                        break;
                    }
                    case 3:
                    {
                        msg = "Lỗi xác thực tài khoản, vui lòng đăng nhập và thử lại!";
                        break;
                    }
                    case 4:
                    {
                        msg = "Số tiền bạn cần đổi vượt quá hạn \nmức trong tài khoản!";
                        break;
                    }
                    case 5:
                    {
                        msg = "Bạn đã sử dụng hết hạn mức trong ngày!";
                        break;
                    }
                    case 6:
                    {
                        msg = "Giao dịch bị từ chối!";
                        break;
                    }
                    case 7:
                    {
                        msg = "Số tiền giao dịch phải lớn hơn 10.000 và nhỏ hơn 10.000.000";
                        break;
                    }
                    case 8:
                    {
                        msg = "Mã captcha không hợp lệ!";
                        break;
                    }

                }

                BCDialog.showDialog(msg,this,function (id) {
                    fishBZ.sendRequestCaptcha();
                })
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