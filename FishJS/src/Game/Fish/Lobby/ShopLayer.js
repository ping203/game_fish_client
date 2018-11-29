

var shopss = [10000,20000,50000,100000,200000,500000,1000000,2000000];

var ShopLayer = BCBaseLayer.extend({
    ctor: function (isDoiVin) {
        this._super();
        this.isToVin = false;
        if(isDoiVin)
            this.isToVin = true;
        this.initWithBinaryFile("res/GUI/ShopGUI.json");
    },
    initGUI: function () {
        this.panel_bg = this.getControl("bg");
        this.btnNapVang = this.customizeButton("btnNapVang", ShopLayer.BTN_NAPVANG,this.panel_bg);
        this.btnDoiMan = this.customizeButton("btnDoiMan", ShopLayer.BTN_DOIMAN,this.panel_bg);

        this.btnNapVang.originalPos = this.btnNapVang.getPosition();
        this.btnDoiMan.originalPos = this.btnDoiMan.getPosition();


        this.btnQuit = this.customizeButton("btnQuit", ShopLayer.BTN_QUIT,this.panel_bg);

        var panel_btn = this.getControl("panel_btn",this.panel_bg);
        this.panel_btn = panel_btn;
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

        this.money_need_change = shopss[0];
        this.effectDoiCuaso();

    },
    effectDoiCuaso: function () {
        if(this.isToVin)
        {
            this.btnNapVang.runAction(cc.moveTo(.05,this.btnNapVang.originalPos.x - 20,this.btnNapVang.originalPos.y));
            this.btnDoiMan.runAction(cc.moveTo(.05,this.btnDoiMan.originalPos.x,this.btnDoiMan.originalPos.y));

            this.tfNapVang.setPlaceHolder("Nạp MAN");
        }
        else
        {
            this.btnNapVang.runAction(cc.moveTo(.05,this.btnNapVang.originalPos.x,this.btnNapVang.originalPos.y));
            this.btnDoiMan.runAction(cc.moveTo(.05,this.btnDoiMan.originalPos.x - 20,this.btnDoiMan.originalPos.y));
            this.tfNapVang.setPlaceHolder("Nạp VÀNG");
        }
        this.tfNapVang.setString("");
        this.panel_btn.setOpacity(0)
        this.panel_btn.runAction(cc.sequence(cc.fadeIn(.15)));
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
            case ShopLayer.BTN_DOIMAN:
            {
                if(!this.isToVin)
                {
                    this.isToVin = true;
                    this.effectDoiCuaso();
                }
                break;
            }
            case ShopLayer.BTN_NAPVANG:
            {
                if(this.isToVin)
                {
                    this.isToVin = false;
                    this.effectDoiCuaso();
                }
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
                this.money_need_change = shopss[id - 3];
                this.tfNapVang.setString(""+this.money_need_change);
                break;
            }
            case ShopLayer.BTN_OK:
            {
                var txt = this.tfNapVang.getString();
                var money = parseInt(txt);
                if(isNaN(money))
                {
                    BCDialog.showDialog(this.isToVin?"Số MAN nhập phải là một dãy số.":"Số VÀNG nhập phải là một dãy số.",this,function (id) {

                    });
                }
                else
                {
                    var money = BCStringUtility.standartNumber(money);
                    var msg = this.isToVin?"Bạn muốn đổi " + money + " VÀNG thành "+money + " MAN?":"Bạn muốn đổi " + money + " MAN thành "+money + " VÀNG?";
                    BCDialog.showDialog(msg,this,function(id){
                        if(id == BCDialog.BTN_OK)
                        {
                            bcSceneMgr.addLoading("Hệ thống đang xử lý, vui lòng đợi!",true);
                            fishBZ.sendExchange(money,this.isToVin,"abc");
                        }
                    });
                }
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