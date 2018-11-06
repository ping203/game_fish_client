/**
 * Created by HOANG on 9/22/2018.
 */

CmdReceivedLogin = CmdReceivedCommon.extend({
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

CmdReceivedJoinRoomSuccess = CmdReceivedCommon.extend({
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
            info["balance"] = this.getLong();
            info["vipType"] = this.getByte();

            info["position"] = this.getByte();
            this.playerInfo.push(info);
        }
        log(this.playerInfo);
    }
})



CmdReceivedUserJoinRoom = CmdReceivedCommon.extend({
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
        this.info["balance"] = this.getLong();
        this.info["vipType"] = this.getByte();

        this.info["position"] = this.getByte();
    }
})


CmdReceivedUserExitRoom = CmdReceivedCommon.extend({
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


CmdReceivedStartShoot = CmdReceivedCommon.extend({
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

CmdReceivedUpdateRound = CmdReceivedCommon.extend({
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
        if(this.gameState == GameManager.STATE_NORMAL_MAP)
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
        }
        else if(this.gameState == GameManager.STATE_PREPARE)
        {
            this.timeElapsed = this.getFloat();
        }
        else if(this.gameState == GameManager.STATE_MATRIX_MAP)
        {
            this.timeElapsed = this.getFloat();
            this.startID = this.getInt();
        }

    }}
)

CmdReceivedAddFish = CmdReceivedCommon.extend({
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

CmdReceivedShootResult = CmdReceivedCommon.extend({
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

CmdReceivedStateChange = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.state = this.getByte();
    }
})

CmdReceivedMatrixData = CmdReceivedCommon.extend({
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



CmdReceivedLockFish = CmdReceivedCommon.extend({
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




