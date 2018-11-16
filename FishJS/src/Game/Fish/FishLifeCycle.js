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
        this.gameScene.startMusic();
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
    onUserExit: function(pk){
        if(pk.position == this.myChair)     // minh` quit game
        {
            var lobbyScene = new LobbyScene();
            lobbyScene.onUpdateData();
            sceneMgr.openWithScene(lobbyScene);
        }
        else    // user khac quit
            this.players[pk.position].enable(false);
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
        {
            this.gameScene.shoot(this.players[position],vec2(data.x * PM_RATIO,data.y * PM_RATIO));
            this.players[position].setGunBet(data.bet,false);
        }
        else
        {
            gameData.userData.gold = data.user_money;
        }

        this.players[position].playerData.rawData["bean"] = data.user_money;
        this.players[position].updateInfo()
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

                this.gameScene.createEffectFishDie(fishSp,pk.won_money,pk.position,fish.fishType > 10);
                this.gameScene.gameMgr.destroyEntity(fish);

                fishSound.playEffectFishDie(fish.id);
            }
            if(pk.position == this.position)        // effect money for player
            {
                this.gameScene.effectMoney(pk.position,pk.won_money);
                gameData.userData.gold = pk.user_money;
            }
        }

    },
    onStateChange: function(pk)
    {
        this.gameScene.gameMgr.state = pk.state;
        if(this.gameScene.gameMgr.state != GameManager.STATE_MATRIX_MAP)
            matranMap.paused = true;
        switch (pk.state)
        {
            case GameManager.STATE_PREPARE:
            {
                this.gameScene.stateToPrepare(10);
                break;
            }
            case GameManager.STATE_NORMAL_MAP:
            {
                this.gameScene.stateToNormalMap();
                break;
            }
        }
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