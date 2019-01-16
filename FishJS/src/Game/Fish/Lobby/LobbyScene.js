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


        var animCua =  sp.SkeletonAnimation.createWithJsonFile("res/GUI/Lobby/Anim/cua/skeleton.json","res/GUI/Lobby/Anim/cua/skeleton.atlas");
        animCua.setAnimation(0,"animation",true);
        animCua.setScale(.3);


        var panel_cua = this.getControl("panel_cua");
        panel_cua.addChild(animCua);

        // bong bong

        var panel_left = this.getControl("Panel_anim_left").getChildByName("Node");
        var bongbong =  sp.SkeletonAnimation.createWithJsonFile("res/FX/Bubbles_FX.json","res/FX/Bubbles_FX.atlas");
        bongbong.setAnimation(0,"Normal",true);
        panel_left.addChild(bongbong);
        var panel_right = this.getControl("Panel_anim_right").getChildByName("Node");
        bongbong =  sp.SkeletonAnimation.createWithJsonFile("res/FX/Bubbles_FX.json","res/FX/Bubbles_FX.atlas");
        bongbong.setAnimation(0,"Normal",true);
        panel_right.addChild(bongbong);

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


        this.bg_menu = this.getControl("bg_menu",this.panelTopRight);
        this.btnSound = this.customizeButton("btnSound",LobbyScene.BTN_SOUND,this.bg_menu);
        this.btnSound.lbOn = this.btnSound.getChildByName("lb_on");
        this.btnSound.lbOff = this.btnSound.getChildByName("lb_off");
        this.btnSound.icon = this.btnSound.getChildByName("icon");

        this.btnMusic = this.customizeButton("btnMusic",LobbyScene.BTN_MUSIC,this.bg_menu);
        this.btnMusic.lbOn = this.btnMusic.getChildByName("lb_on");
        this.btnMusic.lbOff = this.btnMusic.getChildByName("lb_off");
        this.btnMusic.icon = this.btnMusic.getChildByName("icon");

        this.bg_menu.originalPos = this.bg_menu.getPosition();

        this.bg_menu.setPositionY(this.bg_menu.originalPos.y + 400);
        this.bg_menu.setVisible(false);


        this.loadUIMusicSound(false);


    },
    loadUIMusicSound: function (play) {
        if(gameData.enableMusic)
        {
            if(play)
                fishSound.playMusicLobby()
            this.btnMusic.lbOn.setVisible(true);
            this.btnMusic.lbOff.setVisible(false);
            this.btnMusic.icon.setPositionX(98.9);
        }
        else
        {
            if(play)
                fishSound.stopMusic();
            this.btnMusic.lbOn.setVisible(false);
            this.btnMusic.lbOff.setVisible(true);
            this.btnMusic.icon.setPositionX(15.95);

        }

        if(gameData.enableSound) {
            this.btnSound.lbOn.setVisible(true);
            this.btnSound.lbOff.setVisible(false);
            this.btnSound.icon.setPositionX(98.9);
        }
        else
        {
            this.btnSound.lbOn.setVisible(false);
            this.btnSound.lbOff.setVisible(true);
            this.btnSound.icon.setPositionX(15.95);
        }


    },

    withLogin: function(){
        this.need_login = true;
        this.avatar.setVisible(false);
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        // cc.log("hiu hiu 2 " + BCGameClient.getInstance().connected);

        if(!BCGameClient.getInstance().connected && !this.need_login)
        {
            BCDialog.showDialog("Bạn đã bị ngắt kết nối từ máy chủ!",this,function () {
                var lobbyScene = new LobbyScene();
                lobbyScene.withLogin();
                bcSceneMgr.openWithScene(lobbyScene);
                //
                BCGameClient.getInstance().setListener(lobbyListenner);
                BCGameClient.getInstance().connect(SERVER_IP,SERVER_PORT);
            },this)
        }
    },
    onEnter: function(){
        this._super();
        if(this.need_login)
            bcSceneMgr.addLoading("Loading...",true);


        // cc.log("hiu hiu 1");

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
        updateAvatar(gameData.userData.avatar,this.avatar);

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
            case LobbyScene.BTN_TUTORIAL:
            {
                var layer = new BCHeSoCa();
                layer.updateHeso(gameData.config["prize"]);
                this.addChild(layer,10,1000);
                break;
            }
            case LobbyScene.BTN_SETTING:
            {
                this.bg_menu.stopAllActions();
                if(this.bg_menu.isVisible())
                {
                    this.bg_menu.runAction(cc.sequence(cc.moveTo(.275,cc.p(this.bg_menu.originalPos.x,this.bg_menu.originalPos.y + 400)).easing(cc.easeBackIn()),cc.hide()))
                }
                else
                {
                    this.bg_menu.runAction(cc.sequence(cc.show(),cc.moveTo(.35,cc.p(this.bg_menu.originalPos.x,this.bg_menu.originalPos.y )).easing(cc.easeBackOut())))

                }
                break;
            }
            case LobbyScene.BTN_SOUND:
            {
                gameData.enableSound = !gameData.enableSound;
                gameData.saveStorage();
                this.loadUIMusicSound(false);
                break;
            }
            case LobbyScene.BTN_MUSIC:
            {
                gameData.enableMusic = !gameData.enableMusic;
                gameData.saveStorage();
                this.loadUIMusicSound(true);
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
LobbyScene.BTN_SOUND = 11;
LobbyScene.BTN_MUSIC = 12;



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



BCDialog.showDialog = function (msg, target, selector , parent) {
    var mainLayer = bcSceneMgr.getMainLayer();
    if(parent)
        mainLayer = parent;
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

        this.customizeButton("btnClose",BCTopLayer.BTN_CLOSE,this.bg);

        this.top = new BCTopLayerTable(this.panel_table);

        this.bg_my = this.getControl("bg_my",this.bg);
        this.bg_my.setVisible(false);
    },
    onEnter: function () {
        this._super();
    },
    finishAnimate: function () {
        fishBZ.sendRequestTop();
    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this.panel_bg);
    },
    updateData: function (data) {

        this.top.updateData(data);

        var exist = false;
        for(var i=0;i<data.length;i++)
        {
            if(data[i].username === gameData.userData.userName)
            {
                exist = true;
                break;
            }
        }
        if(!exist)
        {
            this.bg_my.setVisible(true);
            this.bg_my.getChildByName("username").setString(gameData.userData.userName);
            this.bg_my.getChildByName("gold").setString(BCStringUtility.standartNumber(gameData.userData.gold)+"$");

            updateAvatar(gameData.userData.avatar,this.bg_my.getChildByName("avatar"));

        }
    },
    onButtonReleased: function (btn, id) {
        switch (id)
        {
            case BCTopLayer.BTN_CLOSE:
            {
                this.onClose();
                break;
            }
        }
    }
})

BCTopLayer.BTN_CLOSE = 0;

/// to TOP

var BCTopCell = cc.TableViewCell.extend({
    ctor: function () {
        this._super();
        var jsonLayout = ccs.load("res/GUI/CellTopUser.json");
        this._layout = jsonLayout.node;
        this._layout.setContentSize(cc.director.getWinSize());
        if(cc.sys.isNative)
            ccui.Helper.doLayout(this._layout);
        this.addChild(this._layout);

        this.lbRank = this._layout.getChildByName("rank");
        this.lbName = this._layout.getChildByName("username");
        this.lbGold = this._layout.getChildByName("gold");
        this.avatar = this._layout.getChildByName("avatar");


        this.tops = [];
        this.tops.push(this._layout.getChildByName("top1"));
        this.tops.push(this._layout.getChildByName("top2"));
        this.tops.push(this._layout.getChildByName("top3"));


    },
    updateCell: function(rank,name,gold,avatar){
        this.lbRank.setString(""+rank);
        this.lbGold.setString(BCStringUtility.standartNumber(gold)+"$");
        this.lbName.setString(name);

        this.lbRank.setVisible(false);
        this.tops[0].setVisible(false);
        this.tops[1].setVisible(false);
        this.tops[2].setVisible(false);
        if(rank <= 3)
        {
            this.tops[rank-1].setVisible(true);
        }
        else
        {
            this.lbRank.setVisible(true);
        }

        updateAvatar(avatar,this.avatar);
    }

})


var BCTopLayerTable = cc.Layer.extend({
    ctor: function (parent) {
        this._super();

        this.data = [];
        this.tableView = new cc.TableView(this,parent.getContentSize());
        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
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

        var idx = cell.getIdx();
        var info = new BCUserInfo();
        info.set(this.data[idx].username,this.data[idx].gold,this.data[idx].win,this.data[idx].avatar);

        // bcSceneMgr.getMainLayer().addChild(info,11);
    },

    tableCellSizeForIndex:function (table) {
        return cc.size(972, 75);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new BCTopCell();
        }
        cell.updateCell(idx+1,this.data[idx].username,this.data[idx].win,this.data[idx].avatar);
        // cell.updateCell(this.data[idx].time,this.data[idx].exchangeAmount,this.data[idx].receivedAmount,this.data[idx].status,this.data[idx].id);
        return cell;
    },

    updateData: function (data) {

        this.isLoading = false;
        this.data = this.data.concat(data);
        var old_count = this.count;
        this.count = this.data.length;
        this.tableView.reloadData();

    },

    numberOfCellsInTableView:function (table) {
        return this.data.length;
    },
    reset: function () {
        this.data = [];
        this.count = 0;
        this.tableView.reloadData();
    }

})


var BCHeSoCa = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/HeSoCaLayer.json");
    },
    initGUI: function () {
        this.bg = this.getControl("bg");
        this.customizeButton("btnClose",0,this.bg);

        this.fishes = [];
        for(var i=1;i<=28;i++){
            var node = this.getControl("Node_"+i,this.bg);
            node.lb = node.getChildByName("lb");
            this.fishes.push(node);
        }

    },
    updateHeso: function (data) {
        for(var i=0;i<this.fishes.length;i++)
        {
            var hic = data[i];
            var str = (data[i].length == 1)?"x "+data[i][0]:"x "+data[i][0]+" - "+data[i][1]+"    ";
            this.fishes[i].lb.setString(str);
        }
    },
    finishAnimate: function () {

    },
    customizeGUI: function () {
    },
    onEnter: function () {
        this._super();
        this.setFog(true);
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeListener(this._listener);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this.bg);
    },
    onButtonReleased: function (btn, id) {
        if(id == 0)
        {
            this.onClose();
        }
    },
    onCloseDone : function () {
        this.retain();
        this.removeFromParent();
    },
})


var BCUserInfo = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/UserInfo.json");
        this.target = this.callback = null;
    },
    initGUI: function () {
        this._bg = this.getControl("bg");
        this._btnCancel = this.customizeButton("btnCancel", BCDialog.BTN_CANCEL,this._bg);

        this.lbUserName = this._bg.getChildByName("bg_username").getChildByName("lb");
        this.lbGold = this._bg.getChildByName("bg_gold").getChildByName("lb");
        this.lbWin = this._bg.getChildByName("bg_win").getChildByName("lb");

        this.avatar = this._bg.getChildByName("avatar");


    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this._bg);
    },

    set: function (username,gold,win,avatar) {
        this.lbUserName.setString(username);
        this.lbGold.setString(BCStringUtility.standartNumber(gold));
        this.lbWin.setString(BCStringUtility.standartNumber(win));

        updateAvatar(avatar,this.avatar);
    },
    onButtonReleased: function (btn,id) {
        this.btnID = id;
        this.onClose();
    },
    onClose: function () {
        this._super();
    }
})


var updateAvatar = function (avatarStr, avatarSp) {
    var avaStr = "res/fishData/avatar/1.png";
    if(typeof (avatarStr) == 'string')
    {
        var tmp = parseInt(avatarStr,10);
        if(!isNaN(tmp) && tmp > 0 && tmp < 13)
        {
            avaStr = "res/fishData/avatar/"+avatarStr+".png"
        }
    }
    avatarSp.loadTexture(avaStr);
}