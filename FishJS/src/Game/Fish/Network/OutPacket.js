/**
 * Created by HOANG on 9/22/2018.
 */



BCCmdSendLogin = CmdSendCommon.extend({
    ctor: function()
    {
        this._super();
        this.initData(1000);
        this.setCmdId(CMD.CMD_LOGIN_BY_TOKEN);

    },
    putData: function(username,password){

        //pack
        this.packHeader();

        this.putString(username);
        this.putString(password);

        var platform = LOGIN_WEB;
        if(cc.sys.isNative)
        {
            platform = (cc.sys.os == cc.sys.OS_IOS)?LOGIN_IOS:LOGIN_ANDROID;
        }
        this.putInt(platform);

        //update
        this.updateSize();
    }
})

BCCmdSendQuickJoin  = CmdSendCommon.extend({
    ctor: function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(CMD.CMD_QUICK_JOIN);

        this.putData();

    },
    putData: function(){

        //pack
        this.packHeader();

        this.putInt(0);
        this.putShort(0);

        //update
        this.updateSize();
    }
})

BCCmdSendQuit  = CmdSendCommon.extend({
    ctor: function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(CMD.CMD_USER_EXIT);
        this.putData();

    },
    putData: function(){

        //pack
        this.packHeader();

        //update
        this.updateSize();
    }
})


BCCmdSendStartShoot = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(10000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_START_SHOOT);
        },
        putData: function(bet,x,y){

            //pack
            this.packHeader();

            this.putLong(bet);
            this.putFloat(x);
            this.putFloat(y);
            //update
            this.updateSize();
        }
    }
)

BCCmdSendChangeBet = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_QUIT_ROOM);

        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)

BCCmdSendShootSuccess = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_SHOOT_RESULT);
        },
        putData:function(bet,fish_id){
            //pack
            this.packHeader();
            this.putLong(bet);
            this.putInt(fish_id);
            //update
            this.updateSize();
        }
    }
)

BCCmdSendLockFish = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_LOCK_FISH);
        },
        putData:function(isLock,fish_id){
            //pack
            this.packHeader();
            this.putByte(isLock);
            this.putInt(fish_id);
            //update
            this.updateSize();
        }
    }
)

BCCmdSendExchange = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_EXCHANGE);
        },
        putData:function(gold_or_vin,isToVin,captcha){
            //pack
            this.packHeader();
            this.putLong(gold_or_vin);
            this.putByte(isToVin);
            this.putString(captcha);
            //update
            this.updateSize();
        }
    }
)

BCCmdSendRequestCaptcha= CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_CAPTCHA);
            this.putData();
        },
        putData:function(){
            //pack
            this.packHeader();

            //update
            this.updateSize();
        }
    }
)

HISTORY_TYPE_CHOI_GAME = 2;
HISTORY_TYPE_EXCHANGE_TO_GOLD = 0;
HISTORY_TYPE_EXCHANGE_TO_VIN = 1;

BCCmdSendRequestHistoty = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_HISTOTY);

        },
        putData:function(type,offset,size){
            //pack
            this.packHeader();

            this.putShort(type);
            this.putShort(offset);
            this.putShort(size);

            //update
            this.updateSize();
        }
    }
)


BCCmdSendRequestTop = CmdSendCommon.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(1000);
            this.setControllerId(1);
            this.setCmdId(CMD.CMD_TOP);
            this.putData();

        },
        putData:function(){
            //pack
            this.packHeader();


            //update
            this.updateSize();
        }
    }
)
