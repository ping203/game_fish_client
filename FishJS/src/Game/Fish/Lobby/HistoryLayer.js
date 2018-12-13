
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

var HistoryLayer = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.data = [];
        this.initWithBinaryFile("res/GUI/HistoryLayer.json");
    },
    initGUI: function () {
        this.panel_bg = this.getControl("Panel");

        this.bg = this.getControl("bg",this.panel_bg);
        this.panel_table = this.getControl("panel_table",this.bg);

        this.tableView = new cc.TableView(this,this.panel_table.getContentSize());
        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_BOTTOMUP);
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.panel_table.addChild(this.tableView);

        this.tableView.reloadData();


    },
    onEnter: function () {
        this._super();
        fishBZ.sendRequestHistory(HISTORY_TYPE_CHOI_GAME,0,10);
    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this.panel_bg);
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex:function (table) {
        return cc.size(1000, 55);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new HistoryPlayGameCell();
        }
        cell.updateCell(this.data[idx].time,this.data[idx].changeMoney,this.data[idx].gold,10);
        return cell;
    },

    updateHistory: function (type,isLastPage,data) {
        this.type = type;
        this.isLastPage = isLastPage;
        this.data = data;

        this.tableView.reloadData();
    },

    numberOfCellsInTableView:function (table) {
        return this.data.length;
    },
    // table view

})