

var shopss = [10000,20000,50000,100000,200000,500000,1000000,2000000];
var capss = "iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAAFJUlEQVR42u2cf2QXcRjHHzOZzJhMkozk62smYyaT/RGTTJL+mfTHZEwyyUQmmWQkM5NEkmTyJZNM+ieZSTJmMpMZmeyPmZGZmfmKdY990nWe5+7zubsv3e394jF2z33uvnfPc5/nx+eOCAAAAAAAAAAAAAAAAAAAAKTNbopCEdvicjDhOQGQawfpgoMAOIhOPxwEwEF0xuEgIOsOMlRBB5mFg4AsO8gLi/HiUuXJLzgIyAL1nnwPGCA/3asr6CDNyngLuB3gf+NjwEi3PSlYzkhx6VbGG8ftAC6c9+S5JzOebHmyY0IT/rvuyTtPRjxpjTn+kGCkAw4hmwT3N+YF3TVPjhmdMWW8fssZryzsu2L5m1eEfctmXJARWjz55hiXv/bkkMMxOoQxvjrmNBKvBD127jafzhtlvHOW5/5a2f9kxH4nlf3ewOSyAxvSZszkdc6TGotj1Ah5B0t7Qge5Zmn4G4pe0cyYG+apzk/7Z4Lhn1P2vxPxu+8q+3XB7LLBAU+WE1afBiyOM+z4FLVxkDYl9OkL6NUpY5XNTKMdayxQBVsVdD5H/O4vwj6rZjyQAW6QXG4t+nQaPOk1MX2ccOG4YsjFBA7C5/RD2P5QyaviOv+rCCffDQkzGxT9hzC77BBMbidCdC8rN3wt4hglJX+hBA7yQdhWUsa6mXCGvG7GKSjbe5Tj9ij6zTC77HCE9kqgPGssRdy8A8oN3w7Zp6js05bAQe4J/5+mf/soUUm8i3B+UhsSMpUcEvtZmFy+kQzoV4j+uJLYU0wHkVbkLkZU074qYz014R/TaJJ17bh/8po+YduOkFNUKWHlDZhQvqgzMfyDEEPTyq9HSV7e0Z/AQX4K/3sXMVavqUxNmBlg04Rdtk99f+hZqxj+WYuqV5ncyuLgP6PaOMOwSbzXKdlapSFltmlI4CCadKR0DdqV8f1NwZfC9keBcR4Teh+5ocmEQmVKdzGfVGWaShDKhUlasX2VMv6OT6dT2L4cGGeZ0PvIBVcofJXrvHGeKyZet3WQ04rerQo5CMulCuZZ5YCOtHykyffAkSp96H1kjBbSy7bcoa53rC75GVX0WlNwkFGlmrQkGOGAyT+40jRpZjWuutU4Vuo2A3r3BZ3bZtugsG0E5pY9JhRjaHcMPyQHWSS3crCtg5RCwhypSjSv6HUrx9Waiu8DeicEnU9m2zSh95ELtshtSfkpSwc5rOi8TcFB/L0ObRlHrU9HW8W7oMwinxT924LuZ6EAcYLQ+8gNWu7RKejWCAahOcglRedBCg7i5wyFv7Yb5dRTvryhaBxYyz8OC+fYK+hOEnofuWEpJAfpMiEVP7EvUngPZDcQ+w87hjVxHYQUp90KGPQ0Jeuk31fO8aBF5Q+9jwwzTOl9bKHeIrfprICDdCh6j306BYq/nH+G9CUszIuI/d/CzLJLPcm9Ck1WQsKsrojcgKWuAg6izRB/8gHyJfVbjs7BeUpUU/NMxBgXYGbZptEYgs3bg2wsfcr2Qd+YmxZhWJoO0h5yzn64kjRn6RzPAsl+GNpDZp3Q+8gFfBOvmtBowzx9OXbmUi0v6GsNhCtRnewyJf/ggutHG6bIvu/C66Zemt+3TX9L0NMm7Cw4nqv21uAYTAuAvdduJQdpwaUBmH3ldVfzuDQA6LPHIC4N2G8UfEk3v+sypDgHV8vQ+wD7DtcPcAMABwkI94CqcakAHETumuNzomDfwp8a4j7RjhHONbj/84T2XhADAAAAAAAAAAAAADb8BlotfA/svRHWAAAAAElFTkSuQmCC";


function stringToArray(bufferString) {
    var uint8Array = new TextEncoder("utf-8").encode(bufferString);
    return uint8Array;
}

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
        this.spCaptcha = this.getControl("captchaSp",this.nodeCapcha);

        this.customizeButton("btnRefresh", ShopLayer.BTN_REFRESH,panel_action);
        this.customizeButton("btnOK", ShopLayer.BTN_OK,panel_action);

        this.money_need_change = shopss[0];
        this.effectDoiCuaso();



    },
    onEnter: function () {
        this._super();
        fishBZ.sendRequestCaptcha();

    },
    loadCaptcha: function (url) {

        if(cc.sys.isNative)
        {
            this.spCaptcha.initWithBase64(url);
        }
        else
        {
            cc.loader.loadImg("data:image/jpeg;base64,"+ url, {isCrossOrigin: false}, function (err, img) {
                this.doneDownload(img);
            }.bind(this));
        }


    },
    doneDownload: function (imgData) {
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(imgData);
        texture2d.handleLoadedTexture();

        this.spCaptcha.setTexture(texture2d);

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
                    var moneyStr = BCStringUtility.standartNumber(money);
                    var msg = this.isToVin?"Bạn muốn đổi " + moneyStr + " VÀNG thành "+moneyStr + " MAN?":"Bạn muốn đổi " + moneyStr + " MAN thành "+moneyStr + " VÀNG?";
                    BCDialog.showDialog(msg,this,function(id){
                        if(id == BCDialog.BTN_OK)
                        {
                            bcSceneMgr.addLoading("Hệ thống đang xử lý, vui lòng đợi!",true);
                            fishBZ.sendExchange(money,this.isToVin,this.tfCapcha.getString());
                        }
                    });
                }
                break;
            }
            case ShopLayer.BTN_REFRESH:
            {
                fishBZ.sendRequestCaptcha();
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