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
        this.roomID = pk.roomID;
        this.myChair = pk.position;
        this.mode = pk.roomType;

        this.players[this.myChair].enable(true);
        this.myPlayer = this.players[this.myChair];
        for(var i = 0;i< pk.playerInfo.length;i++)
        {
            var position = pk.playerInfo[i]["position"];
            this.players[position].playerData.rawData = pk.playerInfo[i];
            this.players[position].setChair();
            this.players[position].enable(true);
            this.players[position].updateInfo();
        }

        fishSound.playMusicBackgroundGame();
    },
    onUserJoin: function(pk)
    {

        this.players[pk.position].playerData.rawData = pk.info;
        this.players[pk.position].setChair(pk.position);
        this.players[pk.position].enable(true);
        this.players[pk.position].updateInfo();

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