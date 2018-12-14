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


        //

        this.panelTopRight = this.getControl("Panel_top_right");
        this.customizeButton("btnSetting",LobbyScene.BTN_SETTING,this.panelTopRight);
        this.customizeButton("btnTop",LobbyScene.BTN_TOP,this.panelTopRight);
        this.customizeButton("btnHistory",LobbyScene.BTN_HISTORY,this.panelTopRight);
        this.customizeButton("btnTutorial",LobbyScene.BTN_TUTORIAL,this.panelTopRight);



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
            case LobbyScene.BTN_PLUS_GOLD:
            case LobbyScene.BTN_SHOP:{
                var shop = new ShopLayer();
                this.addChild(shop,10,1000);
                break;
            }
            case LobbyScene.BTN_PLUS_MAN:
            {
                var shop = new ShopLayer(true);
                this.addChild(shop,10,1000);
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
            case LobbyScene.BTN_HISTORY:
            {
                var layer = new HistoryLayer();
                this.addChild(layer,10,1000);
                break;
            }
            case LobbyScene.BTN_TOP:
            {
                var layer = new BCTopLayer();
                this.addChild(layer,10,1000);
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

LobbyScene.BTN_TUTORIAL = 7;
LobbyScene.BTN_HISTORY = 8;
LobbyScene.BTN_TOP = 9;
LobbyScene.BTN_SETTING = 10;



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


var BCTopLayer = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/TopLayer.json");
    },
    initGUI: function () {
        this.panel_bg = this.getControl("Panel");
        this.bg = this.getControl("bg",this.panel_bg);
        this.panel_table = this.getControl("panel_table",this.bg);

        var aa = this.panel_table.getContentSize();

        var top = new BCTopLayerTable(this.panel_table);
    },
    onEnter: function () {
        this._super();
        fishBZ.sendRequestTop();
    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this.panel_bg);
    },
    updateData: function (data) {

    }
})

/// to TOP

var BCTopCell = cc.TableViewCell.extend({
    ctor: function () {
        this._super();
        var jsonLayout = ccs.load("res/GUI/CellHistoryGoldVin.json");
        this._layout = jsonLayout.node;
        this._layout.setContentSize(cc.director.getWinSize());
        if(cc.sys.isNative)
            ccui.Helper.doLayout(this._layout);
        this.addChild(this._layout);

        this.lbTime = this._layout.getChildByName("lbTime");
        this.lbExchangeAmount = this._layout.getChildByName("lbExchangeAmount");
        this.lbReceivedAmount = this._layout.getChildByName("lbReceivedAmount");
        this.lbStatus = this._layout.getChildByName("lbStatus");
        this.lbID = this._layout.getChildByName("lbID");


    },
    updateCell: function(time,exchangeAmount,receivedAmount,status,id){
        this.lbTime.setString(time);
        this.lbExchangeAmount.setString(BCStringUtility.standartNumber(Math.abs(exchangeAmount))+"$");
        this.lbReceivedAmount.setString(BCStringUtility.standartNumber(receivedAmount)+"$");
        this.lbStatus.setString(status?"Thành công":"Thất bại");
        this.lbStatus.setColor(status?cc.color(0,255,0):cc.color(255,0,0));
        this.lbID.setString("#"+id);
    }

})


var BCTopLayerTable = cc.Layer.extend({
    ctor: function (parent) {
        this._super();

        this.data = [];
        this.tableView = new cc.TableView(this,parent.getContentSize());
        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_BOTTOMUP);
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);

        this.Size = parent.getContentSize();


        this.addChild(this.tableView);
        parent.addChild(this);

        this.tableView.reloadData();

        this.isLoading = false;
        this.count = 0;
    },
    scrollViewDidScroll:function (view) {


    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex:function (table) {
        return cc.size(900, 55);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new HistoryGoldVinCell();
        }
        // cell.updateCell(this.data[idx].time,this.data[idx].exchangeAmount,this.data[idx].receivedAmount,this.data[idx].status,this.data[idx].id);
        return cell;
    },

    updateData: function (isLastPage,data) {

        this.isLoading = false;

        this.isLastPage = isLastPage;
        this.data = this.data.concat(data);
        var old_count = this.count;
        this.count = this.data.length;
        this.tableView.reloadData();

        if(old_count != 0)
            this.tableView.getContainer().setPositionY(-(this.count - old_count) * 55);
    },

    numberOfCellsInTableView:function (table) {
        return 10;
        return this.data.length;
    },
    reset: function () {
        this.data = [];
        this.count = 0;
        this.tableView.reloadData();
    }

})