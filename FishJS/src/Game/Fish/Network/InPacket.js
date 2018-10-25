/**
 * Created by HOANG on 9/22/2018.
 */

CmdReceivedLogin = CmdReceivedCommon.extend({
    ctor: function(pkg){
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.username = this.getString();
        this.displayName = this.getString();
        this.avatar = this.getString();
        this.balance = this.getLong();
        this.vipType = this.getShort();
    }
})

CmdReceivedJoinRoomSuccess = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.uChair = this.getByte();
        this.roomBet = this.getLong();
        this.roomID = this.getInt();
        this.roomType = this.getByte();

        this.playerInfo = new Array(4);
        var length = this.getShort();
        for(var i=0;i<length;i++)
        {
            var info = {};
            info["uID"] = this.getInt();
            info["avatar"] = this.getString();
            info["uName"] = this.getString();
            info["displayName"] = this.getString();
            info["bean"] = this.getLong();
            info["exp"] = this.getLong();
            info["vip"] = this.getByte();
            info["chair"] = this.getByte();
            this.playerInfo[info["chair"]] = info;
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
        this.info["avatar"] = this.getString();
        this.info["uID"] = this.getInt();
        this.info["displayname"]  = this.getString();
        this.info["uName"] = this.getString();

        this.info["bean"]= this.getDouble();
        this.info["exp"] = this.getDouble();
        this.info["winCount"] = this.getInt();
        this.info["lostCount"] = this.getInt();
        this.getInt();
        this.getString();
        this.uStatus = this.getByte();
        this.uChair = this.getByte();
        this.info["vip"] = this.getByte();
    }
})


CmdReceivedRegQuitRoom = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){
        this.reg = this.getBool();
    }
})

CmdReceivedUserExitRoom = CmdReceivedCommon.extend({
    ctor :function(pkg)
    {
        this._super(pkg);
        this.readData();
    },
    readData: function(){

        this.chair = this.getByte();
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

        this.chair = this.getByte();
        this.bet = this.getLong();
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
                for(var i=0;i<size;i+=2)
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
            for(var i=0;i<size;i+=2)
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
        this.nChair = this.getByte();
        this.fishID = this.getInt();
        this.isSuccess = this.getBool();
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
        this.matrix_type = this.getShort();
        this.startID = this.getInt();
        this.time = this.getFloat();
    }
})




