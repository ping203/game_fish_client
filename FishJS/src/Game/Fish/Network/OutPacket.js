/**
 * Created by HOANG on 9/22/2018.
 */

CmdSendLogin = CmdSendCommon.extend({
    ctor: function()
    {
        this._super();
        this.initData(1000);
        this.setCmdId()
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