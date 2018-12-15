
var EPSILLON = 0.01;



var HistoryLayer = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/HistoryLayer.json");
    },
    initGUI: function () {
        this.panel_bg = this.getControl("Panel");
        this.bg = this.getControl("bg",this.panel_bg);
        this.panel_table = this.getControl("panel_table",this.bg);

        this.historyPlayGame = new HistoryPlayGameLayer(this.panel_table);
        this.historyGoldVin = new HistoryGoldVinLayer(this.panel_table);

        this.historyGoldVin.setVisible(false);



        this.customizeButton("btnClose",HistoryLayer.BTN_CLOSE,this.bg);
        this.btnChoiGame = this.customizeButton("btnChoiGame",HistoryLayer.BTN_TAB_CHOI_GAME,this.bg);
        this.btnNhanVang = this.customizeButton("btnNhanVang",HistoryLayer.BTN_TAB_NAP_VANG,this.bg);
        this.btnTieuVang = this.customizeButton("btnTieuVang",HistoryLayer.BTN_TAB_TIEU_VANG,this.bg);

        this.type = HISTORY_TYPE_CHOI_GAME;

        this.titles = [];
        this.titles[HISTORY_TYPE_CHOI_GAME] = this.getControl("Panel_3",this.bg);
        this.titles[HISTORY_TYPE_EXCHANGE_TO_GOLD] = this.getControl("Panel_3_0",this.bg);
        this.titles[HISTORY_TYPE_EXCHANGE_TO_VIN] = this.getControl("Panel_3_0_0",this.bg);


        this.loadButton(this.type);

    },
    loadButton: function (type) {
        this.btnChoiGame.loadTextures("res/GUI/Lobby/Popup/btn_tabs/btn_choigame.png","res/GUI/Lobby/Popup/btn_tabs/btn_choigame.png","res/GUI/Lobby/Popup/btn_tabs/btn_choigame.png",ccui.Widget.LOCAL_TEXTURE);
        this.btnNhanVang.loadTextures("res/GUI/Lobby/Popup/btn_tabs/btn_nhanvang.png","res/GUI/Lobby/Popup/btn_tabs/btn_nhanvang.png","res/GUI/Lobby/Popup/btn_tabs/btn_nhanvang.png",ccui.Widget.LOCAL_TEXTURE);
        this.btnTieuVang.loadTextures("res/GUI/Lobby/Popup/btn_tabs/btn_tieuvang.png","res/GUI/Lobby/Popup/btn_tabs/btn_tieuvang.png","res/GUI/Lobby/Popup/btn_tabs/btn_tieuvang.png",ccui.Widget.LOCAL_TEXTURE);

        this.titles[HISTORY_TYPE_EXCHANGE_TO_VIN].setVisible(false);
        this.titles[HISTORY_TYPE_CHOI_GAME].setVisible(false);
        this.titles[HISTORY_TYPE_EXCHANGE_TO_GOLD].setVisible(false);


        switch (type)
        {
            case HISTORY_TYPE_CHOI_GAME:
            {
                this.titles[HISTORY_TYPE_CHOI_GAME].setVisible(true);

                this.btnChoiGame.loadTextures("res/GUI/Lobby/Popup/btn_tabs/btn_choigame_active.png","res/GUI/Lobby/Popup/btn_tabs/btn_choigame_active.png","res/GUI/Lobby/Popup/btn_tabs/btn_choigame_active.png",ccui.Widget.LOCAL_TEXTURE);
                break;
            }
            case HISTORY_TYPE_EXCHANGE_TO_GOLD:
            {
                this.titles[HISTORY_TYPE_EXCHANGE_TO_GOLD].setVisible(true);
                this.btnNhanVang.loadTextures("res/GUI/Lobby/Popup/btn_tabs/btn_nhanvang_active.png","res/GUI/Lobby/Popup/btn_tabs/btn_nhanvang_active.png","res/GUI/Lobby/Popup/btn_tabs/btn_nhanvang_active.png",ccui.Widget.LOCAL_TEXTURE);
                break;
            }
            case HISTORY_TYPE_EXCHANGE_TO_VIN:
            {
                this.titles[HISTORY_TYPE_EXCHANGE_TO_VIN].setVisible(true);

                this.btnTieuVang.loadTextures("res/GUI/Lobby/Popup/btn_tabs/btn_tieuvang_active.png","res/GUI/Lobby/Popup/btn_tabs/btn_tieuvang_active.png","res/GUI/Lobby/Popup/btn_tabs/btn_tieuvang_active.png",ccui.Widget.LOCAL_TEXTURE);
                break;
            }
        }

    },
    onEnter: function () {
        this._super();
    },
    finishAnimate: function () {
        fishBZ.sendRequestHistory(HISTORY_TYPE_CHOI_GAME,0,10);
        bcSceneMgr.addLoading("",false);
    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this.panel_bg);
    },
    updateHistory: function (type,isLastPage,data) {
        if(type == HISTORY_TYPE_CHOI_GAME)
        {
            this.historyPlayGame.updateData(isLastPage,data);
        }else
        {
            this.historyGoldVin.updateData(isLastPage,data,type);
        }

        bcSceneMgr.clearLoading();

    },
    onButtonReleased: function (btn, id) {
        switch (id)
        {
            case HistoryLayer.BTN_CLOSE:
            {
                this.onClose();
                break;
            }
            case HistoryLayer.BTN_TAB_CHOI_GAME:
            case HistoryLayer.BTN_TAB_NAP_VANG:
            case HistoryLayer.BTN_TAB_TIEU_VANG:
            {
                if(id != this.type)
                {
                    cc.log(id +"   " + this.type);
                    this.type = id;
                    this.loadButton(this.type);
                    fishBZ.sendRequestHistory(id,0,10);

                    this.historyPlayGame.reset();
                    this.historyGoldVin.reset();

                    this.historyPlayGame.setVisible(id == HISTORY_TYPE_CHOI_GAME);
                    this.historyGoldVin.setVisible(id != HISTORY_TYPE_CHOI_GAME);

                }
                break;
            }

        }
    }
    // table view

})

HistoryLayer.BTN_CLOSE = 3;
HistoryLayer.BTN_TAB_CHOI_GAME = 2;
HistoryLayer.BTN_TAB_NAP_VANG = 0;
HistoryLayer.BTN_TAB_TIEU_VANG = 1;
HistoryLayer.BTN_NAP_VANG = 4;



//////////// table layer

var HistoryPlayGameCell = cc.TableViewCell.extend({
    ctor: function () {
        this._super();
        var jsonLayout = ccs.load("res/GUI/CellHistoryPlayGame.json");
        this._layout = jsonLayout.node;
        this._layout.setContentSize(cc.director.getWinSize());
        if(cc.sys.isNative)
            ccui.Helper.doLayout(this._layout);
        this.addChild(this._layout);

        this.lbTime = this._layout.getChildByName("lbTime");
        this.lbMoneyChange = this._layout.getChildByName("lbMoneyChange");
        this.lbGold = this._layout.getChildByName("lbGold");
        this.lbRoom = this._layout.getChildByName("lbRoom");


    },
    updateCell: function(time,moneyChange,gold,room){
        this.lbTime.setString(time);
        this.lbMoneyChange.setString((moneyChange<0?"-":"+")+BCStringUtility.standartNumber(Math.abs(moneyChange))+"$");
        this.lbGold.setString(BCStringUtility.standartNumber(gold)+"$");
        this.lbRoom.setString("#"+room);
    }

})


var HistoryPlayGameLayer = cc.Layer.extend({
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

        var yy = view.getContainer().getPositionY();
        if(yy>=EPSILLON && !this.isLoading)
        {
            if(!this.isLastPage)
            {
                this.isLoading = true;
                // bcSceneMgr.addLoading("XIn cho");
                fishBZ.sendRequestHistory(HISTORY_TYPE_CHOI_GAME,this.count,10);

            }

        }

    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex:function (table) {
        return cc.size(this.Size.width, 52);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new HistoryPlayGameCell();
        }
        cell.updateCell(this.data[idx].time,this.data[idx].changeMoney,this.data[idx].gold,this.data[idx].roomID);
        return cell;
    },

    updateData: function (isLastPage,data,type) {

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
        return this.data.length;
    },
    reset: function () {
        this.data = [];
        this.count = 0;
        this.tableView.reloadData();
    }

})



/// to gold layer

var HistoryGoldVinCell = cc.TableViewCell.extend({
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
        this.lbStatus.setString(status?"Thành công!":"Thất bại!");
        this.lbStatus.setColor(status?cc.color(0,255,0):cc.color(255,0,0));
        this.lbID.setString("#"+id);
    }

})


var HistoryGoldVinLayer = cc.Layer.extend({
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

        var yy = view.getContainer().getPositionY();
        if(yy>=EPSILLON && !this.isLoading)
        {
            if(!this.isLastPage)
            {
                this.isLoading = true;
                // bcSceneMgr.addLoading("XIn cho");
                fishBZ.sendRequestHistory(HISTORY_TYPE_CHOI_GAME,this.count,10);

            }

        }

    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex:function (table) {
        return cc.size(this.Size.width, 52);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new HistoryGoldVinCell();
        }
        cell.updateCell(this.data[idx].time,this.data[idx].exchangeAmount,this.data[idx].receivedAmount,this.data[idx].status,this.data[idx].id);
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
        return this.data.length;
    },
    reset: function () {
        this.data = [];
        this.count = 0;
        this.tableView.reloadData();
    }

})