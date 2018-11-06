/**
 * Created by HOANGNGUYEN on 9/7/2018.
 */
var FishLifeCycle = cc.Class.extend({
    ctor: function()
    {
        this.gameScene =  null;
    },
    onJoinRoomSucess: function(pk)
    {
        this.gameScene = new GameLayerUI();
        sceneMgr.openWithScene(this.gameScene);
        this.players = this.gameScene.players;

        // read Data
        this.bets = pk.roomBet;
        this.myBetIdx = 0;          // index cua bet trong array
        this.roomID = pk.roomID;
        this.myChair = this.position = pk.position;
        this.roomType = pk.roomType;

        this.players[this.myChair].enable(true);
        this.players[this.myChair].setIsMyPlayer(true);
        this.players[this.myChair].setGunBet(this.bets[0]);
        this.myPlayer = this.players[this.myChair];
        for(var i = 0;i< pk.playerInfo.length;i++)
        {
            var position = pk.playerInfo[i]["position"];
            this.players[position].playerData.rawData = pk.playerInfo[i];
            this.players[position].setChair(position);
            this.players[position].enable(true);
            this.players[position].updateInfo();

            this.players[position].setIsMyPlayer(position == this.myChair);
        }

        fishSound.playMusicBackgroundGame();
    },
    onUserJoin: function(pk)
    {
        var info = pk.info;
        var position = info.position;
        this.players[position].playerData.rawData = info;
        this.players[position].setChair(position);
        this.players[position].enable(true);
        this.players[position].updateInfo();

    },
    onUpdateRound: function(pk)
    {
          if(pk.gameState == GameManager.STATE_NORMAL_MAP)
          {
              for(var i=0;i<pk.listFish.length;i++)
              {
                  this.gameScene.addFish(pk.listFish[i].id,pk.listFish[i].type,pk.listFish[i].listPoint,pk.listFish[i].totalTime,pk.listFish[i].elapsedTime);
              }
          }
          else if(pk.gameState == GameManager.STATE_MATRIX_MAP)
          {

          }
    },
    onUserQuit: function(pk)
    {

    },

    onAddFish: function(pk)
    {
        for(var i=0;i<pk.listFish.length;i++)
        {
            this.gameScene.addFish(pk.listFish[i].id,pk.listFish[i].type,pk.listFish[i].listPoint,pk.listFish[i].totalTime,pk.listFish[i].elapsedTime);
        }

    },
    onStartShoot: function(data)
    {
        var position = data.position;
        if(position != this.position)
            this.gameScene.shoot(this.players[position],vec2(data.x * PM_RATIO,data.y * PM_RATIO));
    },
    onShootResult: function(pk)
    {
        if(pk.isSuccess)
        {
            var fish = this.gameScene.gameMgr.getFishByID(pk.fishID)
            if(fish)
            {
                var fishSp = fish.getNodeDisplay();
                fish.setNodeDisplay(null);

                // cc.log(JSON.stringify(fish));
                this.gameScene.createEffectFishDie(fishSp,pk.won_money,pk.position);
                this.gameScene.gameMgr.destroyEntity(fish);

                fishSound.playEffectFishDie(fish.id);
            }
        }

    },
    onStateChange: function(pk)
    {
        cc.log(JSON.stringify(pk));
        this.gameScene.gameMgr.state = pk.state;

        if(this.gameScene.gameMgr.state != GameManager.STATE_MATRIX_MAP)
            matranMap.paused = true;
    },
    onMatrixData: function(pk)
    {
        matranMap.start(pk.time,pk.startID)
    },
    onLockFish: function(pk){
        if(pk.player_position == this.position)
            return;
        if(pk.isLock){
            var fishNeedLock = this.gameScene.gameMgr.getFishByID(pk.fish_id);
            cc.log("lock fish :" + JSON.stringify(pk));
            cc.log("find :" + fishNeedLock);
            if(fishNeedLock)
            {
                this.players[pk.player_position].setHold(fishNeedLock);
            }
        }
        else
            this.players[pk.player_position].releaseHold();
    }

})

var fishLifeCycle = null;