

var shopss = [10000,20000,50000,100000,200000,500000,1000000,2000000];

var ShopLayer = BCBaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/ShopGUI.json");
    },
    initGUI: function () {
        this.panel_bg = this.getControl("bg");
        this.btnNapVang = this.customizeButton("btnNapVang", ShopLayer.BTN_NAPVANG,this.panel_bg);
        this.btnDoiMan = this.customizeButton("btnDoiMan", ShopLayer.BTN_DOIMAN,this.panel_bg);

        this.btnQuit = this.customizeButton("btnQuit", ShopLayer.BTN_QUIT,this.panel_bg);

        var panel_btn = this.getControl("panel_btn",this.panel_bg);
        for(var i=0;i<8;i++)
        {
            this.customizeButton("btn"+i, i+3,panel_btn);
        }

        var panel_action = this.getControl("panel_action",this.panel_bg);

        this.tfNapVang = this.getControl("tfGold",panel_action);
        this.tfCapcha = this.getControl("tfCapcha",panel_action);
        this.nodeCapcha = this.getControl("nodeCapcha",panel_action);

        this.customizeButton("btnRefresh", ShopLayer.BTN_REFRESH,panel_action);
        this.customizeButton("btnOK", ShopLayer.BTN_OK,panel_action);

    },
    customizeGUI: function () {
        this.setFog(true);
    },
    onEnterFinish: function () {
        this.setShowHideAnimate(this.panel_bg);
    },
    onButtonReleased: function (btn, id) {
        switch (id)
        {
            case ShopLayer.BTN_QUIT:
            {
                this.onClose();
                break;
            }
            case ShopLayer.BTN_0:
            case ShopLayer.BTN_1:
            case ShopLayer.BTN_2:
            case ShopLayer.BTN_3:
            case ShopLayer.BTN_4:
            case ShopLayer.BTN_5:
            case ShopLayer.BTN_6:
            case ShopLayer.BTN_7:
            {
                this.tfNapVang.setString(BCStringUtility.standartNumber(shopss[id-3]));
                break;
            }

        }
    }
})


ShopLayer.BTN_NAPVANG = 0;
ShopLayer.BTN_DOIMAN = 1;
ShopLayer.BTN_OK = 2;
ShopLayer.BTN_QUIT = 11;
ShopLayer.BTN_REFRESH = 12;




ShopLayer.BTN_0 = 3;
ShopLayer.BTN_1 = 4;
ShopLayer.BTN_2 = 5;
ShopLayer.BTN_3 = 6;
ShopLayer.BTN_4 = 7;
ShopLayer.BTN_5 = 8;
ShopLayer.BTN_6 = 9;
ShopLayer.BTN_7 = 10;