/**
 * Created by HOANG on 9/22/2018.
 */

CmdSendLogin = CmdSendCommon.extend({
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

        //update
        this.updateSize();
    }
})

CmdSendQuickJoin  = CmdSendCommon.extend({
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

CmdSendStartShoot = CmdSendCommon.extend(
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

CmdSendChangeBet = CmdSendCommon.extend(
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

CmdSendShootSuccess = CmdSendCommon.extend(
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

CmdSendLockFish = CmdSendCommon.extend(
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