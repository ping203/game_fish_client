/**
 * Created by HOANG on 9/22/2018.
 */

BCCmdReceivedLogin = CmdReceivedCommon.extend({
    ctor: function(pkg){
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.uID = this.getInt();
        this.userName = this.getString();
        this.displayName = this.getString();
        this.avatar = this.getString();
        this.balance = this.getLong();
        this.vipType = this.getByte();
        this.vinMoney = this.getLong();
    }
})


BCCmdReceivedExchange = CmdReceivedCommon.extend({
    ctor: function(pkg){
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.isToVin = this.getBool();
        this.money_exchange = this.getLong();
        this.gold = this.getLong();
        this.vinMoney = this.getLong();
    }
})

BCCmdReceivedJoinRoomSuccess = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.position = this.getByte();
        this.roomID = this.getInt();
        this.roomType = this.getByte();
        this.roomBet = this.getLongs();
        this.playerInfo = [];
        var length = this.getShort();
        for(var i=0;i<length;i++)
        {
            var info = {};
            info["uID"] = this.getInt();
            info["username"] = this.getString();
            info["displayName"] = this.getString();
            info["avatar"] = this.getString();
            info["balance"] = info["gold"]= this.getLong();
            info["vipType"] = this.getByte();

            info["position"] = this.getByte();
            this.playerInfo.push(info);
        }
        log(this.playerInfo);
    }
})



BCCmdReceivedUserJoinRoom = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.info = {};
        this.info["uID"] = this.getInt();
        this.info["username"] = this.getString();
        this.info["displayName"] = this.getString();
        this.info["avatar"] = this.getString();
        this.info["balance"] = this.info["gold"] = this.getLong();
        this.info["vipType"] = this.getByte();

        this.info["position"] = this.getByte();
    }
})


BCCmdReceivedUpdateBG = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.bgIdx = this.getInt();
    }
})

BCCmdReceivedCaptcha = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.captchaStr = this.getString();
    }
})


BCCmdReceivedUserExitRoom = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.position = this.getByte();
        this.uID = this.getInt();
    }
})


BCCmdReceivedStartShoot = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){

        this.position = this.getByte();
        this.bet = this.getLong();
        this.user_money = this.getLong();
        this.x = this.getFloat();
        this.y = this.getFloat();

    }
})

BCCmdReceivedUpdateRound = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function() {
        this.gameState = this.getByte();
        this.listFish = [];
        this.startID = -1;
        this.timeElapsed = 0;
        this.lockInfos = [];
        if(this.gameState == BCGameManager.STATE_NORMAL_MAP)
        {
            var length = this.getShort();
            for(var j=0;j<length;j++)
            {
                var f = {};

                f.id = this.getInt();
                f.type = this.getShort();
                f.totalTime = this.getFloat();
                f.elapsedTime = this.getFloat();


                f.listPoint = [];

                var size = this.getShort();
                for(var i=0;i<size;i++)
                {
                    f.listPoint.push(vec2(this.getFloat(),this.getFloat()));
                }

                this.listFish.push(f);
            }
            length = this.getShort();
            for(var j=0;j<length;j++)
            {
                this.lockInfos.push(this.getInt());
            }
        }
        else if(this.gameState == BCGameManager.STATE_PREPARE)
        {
            this.timeElapsed = this.getFloat();
        }
        else if(this.gameState == BCGameManager.STATE_MATRIX_MAP)
        {
            this.timeElapsed = this.getFloat();
            this.startID = this.getInt();
        }

    }}
)

BCCmdReceivedAddFish = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){

        var length = this.getShort();
        this.listFish = [];
        for(var j=0;j<length;j++)
        {
            var f = {};

            f.id = this.getInt();
            f.type = this.getShort();
            f.totalTime = this.getFloat();
            f.elapsedTime = this.getFloat();


            f.listPoint = [];

            var size = this.getShort();
            for(var i=0;i<size;i++)
            {
                f.listPoint.push(vec2(this.getFloat(),this.getFloat()));
            }

            this.listFish.push(f);
        }

    }
})

BCCmdReceivedShootResult = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.position = this.getByte();
        this.fishID = this.getInt();
        this.isSuccess = this.getBool();
        this.bet = this.getLong();
        this.won_money = this.getLong();
        this.user_money = this.getLong();
    }
})

BCCmdReceivedStateChange = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.state = this.getByte();
        this.time = this.getFloat();
    }
})

BCCmdReceivedMatrixData = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.matrix_type = this.getByte();
        this.startID = this.getInt();
        this.time = this.getFloat();
    }
})



BCCmdReceivedLockFish = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.player_position = this.getByte();
        this.isLock = this.getBool();
        this.fish_id = this.getInt();
    }
})



/// lobby


BCCmdReceivedHistory = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.type= this.getShort();
        this.lastPage = this.getBool();

        this.dataHisoty = [];

        var length = this.getShort();

        for(var i=0;i<length;i++)
        {
            if(this.type == HISTORY_TYPE_CHOI_GAME)
            {
                var obj = {};
                obj.changeMoney = this.getLong();
                obj.gold = this.getLong();
                obj.time = this.getString();

                this.dataHisoty.push(obj);
            }
            else
            {
                var obj = {};
                obj.id = this.getLong();
                obj.exchangeAmount = this.getLong();
                obj.receivedAmount = this.getLong();
                obj.status = this.getBool();
                obj.time = this.getString();

                this.dataHisoty.push(obj);
            }
        }


    }
})

var BCCmdReceivedGetTop = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.data = [];
        var length = this.getShort();
        for(var i=0;i<length;i++)
        {
            var obj = {};
            this.gold = this.getLong();
            this.bet = this.getLong();
            this.win = this.getLong();
            this.username = this.getString();
            this.avatar = this.getString();
        }
    }
})

