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
        this.bet = pk.roomBet;
        this.roomOwner = pk.roomOwner;
        this.roomID = pk.roomID;
        this.roomIndex =   pk.roomIndex;
        this.myChair = pk.uChair;
        this.roomOwnerID = pk.roomOwnerID;
        this.roomJackpot = pk.roomJackpot;
        this.gameAction = pk.gameAction;
        this.mode = pk.roomType;
        this.dialerChair = pk.dialerChair;
        this.minGold = pk.minGold;

        this.players[this.myChair].enable(true);
        this.myPlayer = this.players[this.myChair];
        for(var i = 0;i< MAX_PLAYER;i++)
        {
            if(pk.playerStatus[i] != USER_STATUS_NO_LOGIN){
                this.players[i].playerData.rawData = pk.playerInfo[i];
                this.players[i].setChair(i);
                this.players[i].enable(true);
                this.players[i].updateInfo();
            }
        }

        fishSound.playMusicBackgroundGame();
    },
    onUserJoin: function(pk)
    {

        this.players[pk.uChair].playerData.rawData = pk.info;
        this.players[pk.uChair].setChair(pk.uChair);
        this.players[pk.uChair].enable(true);
        this.players[pk.uChair].updateInfo();

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
        this.gameScene.shoot(this.players[data.chair],vec2(data.x * PM_RATIO,data.y * PM_RATIO));
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

                cc.log(JSON.stringify(fish));
                this.gameScene.createEffectFishDie(fishSp,pk.won_money,pk.nChair);
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
    }

})

var fishLifeCycle = null;