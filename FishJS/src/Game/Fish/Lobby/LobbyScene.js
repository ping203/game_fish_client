/**
 * Created by HOANG on 10/27/2018.
 */

var LobbyScene = BCBaseLayer.extend({
    ctor: function(){
        this._super();
        this.initWithBinaryFile("res/GUI/LobbyScene.json");
    },
    initGUI: function(){
        var panel_center = this.getControl("Panel_center");


        this.btnChoiThu = this.customizeButton("btnChoiThu",LobbyScene.BTN_PLAY_DEMO,panel_center);
        this.btnChoiNgay = this.customizeButton("btnChoiNgay",LobbyScene.BTN_PLAY_NOW,panel_center);
        this.btnShop = this.customizeButton("btnShop",LobbyScene.BTN_SHOP,panel_center);

        var node_choingay = this.getControl("node_choingay",this.btnChoiNgay);
        var node_choithu = this.getControl("node_choithu",this.btnChoiThu);
        var node_shop = this.getControl("node_shop",this.btnShop);

        var top_center = this.getControl("Panel_top_center");
        var logo = sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/logo/skeleton.json","res/GUI/Lobby/Anim/logo/skeleton.atlas");
        logo.setAnimation(0,"animation",true);
        logo.setScale(.65);
        top_center.addChild(logo);


        var animChoiNgay =  sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/Chien_ngay/skeleton.json","res/GUI/Lobby/Anim/Chien_ngay/skeleton.atlas");
        animChoiNgay.setAnimation(0,"animation",true);
        animChoiNgay.setScale(.65);

        node_choingay.addChild(animChoiNgay);

        var animChoiThu=  sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/Choi_thu/skeleton.json","res/GUI/Lobby/Anim/Choi_thu/skeleton.atlas");
        animChoiThu.setAnimation(0,"animation",true);
        animChoiThu.setScale(.65);

        node_choithu.addChild(animChoiThu);

        var animShop=  sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/Shop/skeleton.json","res/GUI/Lobby/Anim/Shop/skeleton.atlas");
        animShop.setAnimation(0,"animation",true);
        animShop.setScale(.65);

        node_shop.addChild(animShop);

        var animLeft =  sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/Shop/skeleton.json","res/GUI/Lobby/Anim/Shop/skeleton.atlas");
        animLeft.setAnimation(0,"animation",true);
        animLeft.setScale(.65);

        var animCua =  sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/cua/skeleton.json","res/GUI/Lobby/Anim/cua/skeleton.atlas");
        animCua.setAnimation(0,"animation",true);
        animCua.setScale(.3);

        var panel_cua = this.getControl("panel_cua");
        panel_cua.addChild(animCua);

        animCua.flipped = true;

        var func = function(){
            this.flipped = !this.flipped;
            //this.setFlipX(this.flipped);
        }.bind(animCua)

        animCua.runAction(cc.sequence(cc.moveBy(30,cc.p(850,0)),cc.callFunc(func),cc.moveBy(30,cc.p(-850,0))).repeatForever());


        //for UI
        this.panelBottom = this.getControl("Panel_bottom");
        this.panelMan = this.getControl("Panel_Man",this.panelBottom);
        this.panelGold = this.getControl("Panel_Gold",this.panelBottom);

        this.avatar = this.getControl("avatar",this.panelBottom);
        this.lbUserName = this.getControl("lbUserName",this.panelBottom);
        this.lbUserID = this.getControl("lbUserID",this.panelBottom);

        this.lbMan = this.getControl("lbMan",this.panelMan);
        this.customizeButton("btnPlusMan",LobbyScene.BTN_PLUS_MAN,this.panelMan);

        this.lbGold = this.getControl("lbGold",this.panelGold);
        this.customizeButton("btnPlusGold",LobbyScene.BTN_PLUS_GOLD,this.panelGold);

        this.bg = this.getControl("bg");

        this.panelBack = this.getControl("Panel_top_left");
        this.customizeButton("btnQuit",LobbyScene.BTN_BACK,this.panelBack);


    },
    withLogin: function(){
        this.need_login = true;
        this.avatar.setVisible(false);
    },
    onEnter: function(){
        this._super();
        if(this.need_login)
            bcSceneMgr.addLoading("Loading...",true);


    },
    onUpdateData: function(){
        this.lbUserName.setString(gameData.userData.userName);
        this.lbUserID.setString("#ID "+gameData.userData.uID)
        this.lbGold.setString(BCStringUtility.standartNumber(gameData.userData.gold) +"$");

        this.lbMan.setString(BCStringUtility.standartNumber(gameData.userData.vinMoney) +"$");

        this.bg.setVisible(true);
        this.bg.setOpacity(0);
        this.bg.runAction(cc.fadeIn(.35));

        this.avatar.setVisible(true);

    },
    onButtonReleased: function(btn,id){
        switch (id){
            case LobbyScene.BTN_PLAY_DEMO:{
                bcSceneMgr.openWithScene(new DemoScene());

                break;
            }
            case LobbyScene.BTN_PLAY_NOW:{
                var pkQuickJoin = new BCCmdSendQuickJoin();
                BCGameClient.getInstance().sendPacket(pkQuickJoin);
                bcSceneMgr.addLoading("Đang vào phòng chơi, vui lòng chờ...",true);
                break;
            }
            case LobbyScene.BTN_SHOP:{
                var shop = new ShopLayer();
                this.addChild(shop,10);
                break;
            }
            case LobbyScene.BTN_BACK:
            {

                BCDialog.showDialog("Bạn chắc chắn muốn thoát game?",this,function (id) {
                    if(id == BCDialog.BTN_OK)
                    {
                        if(lobbyThanBien)
                        {
                            BCGameClient.getInstance().disconnect();
                            fishSound.stopMusic();
                            lobbyThanBien.onExitGame();

                        }
                        else
                        {
                            cc.director.end();
                        }
                    }
                })


                break;
            }
        }
    }
})

LobbyScene.BTN_PLUS_MAN = 1;
LobbyScene.BTN_PLUS_GOLD = 2;
LobbyScene.BTN_BACK = 3;
LobbyScene.BTN_PLAY_NOW = 4;
LobbyScene.BTN_PLAY_DEMO = 5;
LobbyScene.BTN_SHOP = 6;



var BCDialog = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/DialogGUI.json");
        this.target = this.callback = null;
    },
    initGUI: function () {
        this._bg = this.getControl("bg");
        this._btnOK = this.customizeButton("btnOK", BCDialog.BTN_OK,this._bg);
        this._btnCancel = this.customizeButton("btnCancel", BCDialog.BTN_CANCEL,this._bg);

        this._lbMessage = this.getControl("lbText",this._bg);


    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this._bg);
    },

    set: function (msg, target, selector) {
        this._lbMessage.setString(msg);
        this.target = target;
        this.callback = selector;
    },
    onButtonReleased: function (btn,id) {
        this.btnID = id;
        this.onClose();
    },
    onClose: function () {
        this._super();
        if(this.callback)
        {
            this.callback.call(this.target,this.btnID);
        }
    }
})



BCDialog.showDialog = function (msg, target, selector) {
    var mainLayer = bcSceneMgr.getMainLayer();
    if(mainLayer.getChildByTag(BCDialog.TAG))
    {
        mainLayer.removeChildByTag(BCDialog.TAG);
    }
    var dialog = new BCDialog();
    dialog.set(msg,target,selector);
    mainLayer.addChild(dialog,BCDialog.ZORDER,BCDialog.TAG);
    return dialog;
}

BCDialog.BTN_OK = 0;
BCDialog.BTN_CANCEL = 1;

BCDialog.ZORDER = 100;
BCDialog.TAG = 1324;