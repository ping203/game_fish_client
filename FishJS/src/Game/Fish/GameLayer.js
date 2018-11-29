/**
 * Created by admin on 9/3/18.
 */

var GameScene = cc.Scene.extend({
    ctor: function()
    {
        this._super();
        this.layer = new GameLayerUI()
        this.addChild(this.layer);

    }
})


var ActionListener = cc.Class.extend({
    onStartShoot: function(bet,x,y){

    },
    onShootFish: function(bet,fish_id){

    }
})


var GameLayerUI = BCBaseLayer.extend({
    ctor: function()
    {
        this._super();

        this.initWithBinaryFile("res/GUI/GameLayer.json");
        //this._layout.setVisible(false);

        this.actionListener = null;
    },
    initGUI: function()
    {

        this.backgrounds = [];
        var panel_bg = this.getControl("Panel_bg");             // panel BG
        this.panel_bg = panel_bg;
        this.backgrounds.push(this.getControl("bg0",panel_bg));
        this.backgrounds.push(this.getControl("bg1",panel_bg));
        this.backgrounds.push(this.getControl("bg2",panel_bg));
        //// end bg

        this.bulletLayer = new cc.Layer();
        this.effectLayer = new cc.Layer();
        this.effectLayerTop = new cc.Layer();

        this.topLayer = new cc.Layer();
        this.fish2DLayer = new Display2DScene();                // add fishSprite to this
        this.fish3DScene = new Display3DScene();                // add fish3D to this
        var panel_display = this.getControl("Panel_Fish");      // panel tren bg nhung duoi' UI
        this.panel_diaplay = panel_display;
        panel_display.addChild(this.fish3DScene,1);
        panel_display.addChild(this.fish2DLayer,2);
        panel_display.addChild(this.effectLayer,4);             // layer effect chinh'

        ////////


        var top_panel = this.getControl("Panel_Top");           // top panel (tren ca UI)
        top_panel.addChild(this.topLayer,40);                   // top layer chua bong' nuoc' khi touch move
        top_panel.addChild(this.bulletLayer,3);                 // layer chua' bullet
        top_panel.addChild(this.effectLayerTop,5);              // add coin khi fish die va` money lb


        var panel_ui = this.getControl("Panel_UI");
        this.customizeButton("btnHold",GameLayerUI.BTN_HOLD_FISH,panel_ui);
        this.btnMenu = this.customizeButton("btnMenu",GameLayerUI.BTN_MENU,panel_ui);
        this.btnAuto = this.customizeButton("btnAuto",GameLayerUI.BTN_AUTO,panel_ui);
        this.btnAuto.tick = this.btnAuto.getChildByName("tick");


        this.panel_menu = this.getControl("panel_menu",panel_ui);
        this.panel_menu.originalPos = this.panel_menu.getPosition();
        this.txtLock = this.getControl("txtLockFish",panel_ui);

        this.customizeButton("btnHome",GameLayerUI.BTN_QUIT,this.panel_menu);
        this.btnMusic = this.customizeButton("btnMusic",GameLayerUI.BTN_MUSIC,this.panel_menu);
        this.btnSound = this.customizeButton("btnSound",GameLayerUI.BTN_SOUND,this.panel_menu);
        this.customizeButton("btnFish",GameLayerUI.BTN_FISH,this.panel_menu);


        var water = this.createWater();
        water.setOpacity(100);

        panel_display.addChild(water,3);
        water.setPosition(cc.winSize.width /2 ,cc.winSize.height / 2);

        water.setScaleX(cc.winSize.width / 1024);
        water.setScaleY(cc.winSize.height / 576);

        this.particleBongNuoc = new cc.ParticleSystem("res/fishData/effect/bong_nuoc_effect.plist");
        this.topLayer.addChild(this.particleBongNuoc);
        this.particleBongNuoc.setPosition(0,0);
        this.particleBongNuoc.setVisible(false);


        this.loadUIMusicSound();



        this.players = [];
        for(var i =0 ;i< MAX_PLAYER;i++)
        {
            var panel = this.getControl("player_"+i);
            var player = new Player(panel,this);
            player.index = i;
            this.players.push(player);
            //panel.setVisible(false);

            player.btnPlus.setPressedActionEnabled(true);
            player.btnPlus.setTag(GameLayerUI.BTN_PLUS);
            player.btnPlus.addTouchEventListener(this.onTouchEventHandler,this);

            player.btnSub.setPressedActionEnabled(true);
            player.btnSub.setTag(GameLayerUI.BTN_SUB);
            player.btnSub.addTouchEventListener(this.onTouchEventHandler,this);

            player.enable(false);
        }
        this.time = 0;

        this.initBox2D();
        this.time_for_shoot = 0;
        this.time_auto_shoot = 0;
        this.enable_shoot = true;

        this.hold_mouse = false;
        this.point_to_shoot = vec2(0,0);

        this.auto_shoot = false;
        this.last_touch_point = null;

    },
    setActionListener: function(lis){
        this.actionListener = lis;
    },

    initBox2D: function()
    {
        this.gameMgr = new BCGameManager(new Setting());
        this.gameMgr.setEntityCollisionListener(this.onEntityCollision.bind(this));
        this.gameMgr.setOnContactPreSolve(this.onContactPreSolve.bind(this));
    },
    onEntityCollision: function(fish,bullet,pointCollide)
    {
        if(bullet.released)
        {
            cc.log("WARNING : this bullet is released , not collide in future!");
            return;
        }

        var collide_check = false;
        if(bullet.getHoldInfo() && bullet.getHoldInfo().getIsHolding())
        {
            collide_check = (bullet.getHoldInfo().getFish() == fish);
        }
        else
            collide_check = true;
        if(collide_check){
            bullet.released = true;
            this.createEffectFishFired(vec2(pointCollide.x * PM_RATIO,pointCollide.y *PM_RATIO),bullet.playerID);
            this.gameMgr.destroyEntity(bullet);

            if(!fish.getNodeDisplay())
                return;

            var spFish = fish.getNodeDisplay().getChildByTag(0);

            spFish.setColor(cc.color(200,0,0));
            spFish.stopActionByTag(111);
            var action = cc.tintTo(.35,255,255,255);action.setTag(111);
            spFish.runAction(action);

            if(fish.id !== undefined && bullet.playerID == fishLifeCycle.myChair)
            {
                if(this.actionListener && this.actionListener.onShootFish){
                    this.actionListener.onShootFish.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],fish.id);
                }
                else
                {
                    fishBZ.sendShootFish(fishLifeCycle.bets[fishLifeCycle.myBetIdx],fish.id);
                }
            }

        }

    },
    onContactPreSolve: function(entityA,entityB,contact)
    {
        if(entityA._type == Entity.BULLET && entityB._type == Entity.FISH)
        {
            contact.SetEnabled(false);
        }
        else if(entityA._type == Entity.FISH && entityB._type == Entity.BULLET)
        {
            contact.SetEnabled(false);
        }
        else if(entityA._type == Entity.BULLET && entityB._type == Entity.WALL)
        {

            contact.SetEnabled(!(entityA.holdInfo && entityA.holdInfo.isHolding));
        }
        else if(entityB._type == Entity.BULLET && entityA._type == Entity.WALL)
        {
            contact.SetEnabled(!(entityB.holdInfo && entityB.holdInfo.isHolding));
        }


    },

    setAutoShootFlag: function (flag) {
        this.auto_shoot = flag;
        // ui for btn auto
        this.btnAuto.tick.setVisible(flag);
    },

    shootAuto: function () {
        var screenPos = this.last_touch_point?this.last_touch_point:vec2(cc.winSize.width/2,cc.winSize.height/2);

        if(this.gameMgr.state != BCGameManager.STATE_PREPARE)
        {
            this.shoot(fishLifeCycle.myPlayer,screenPos);
            if(this.actionListener && this.actionListener.onStartShoot){
                this.actionListener.onStartShoot.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],screenPos.x / PM_RATIO,screenPos.y / PM_RATIO);
            }
            else
                fishBZ.sendStartShoot(fishLifeCycle.bets[fishLifeCycle.myBetIdx],screenPos.x / PM_RATIO,screenPos.y / PM_RATIO);
        }
        else{
            fishLifeCycle.myPlayer.setAngleForGun(screenPos);
        }
    },

    shoot: function(player,screenPosition)
    {
        fishSound.playEffectShoot();

        this.enable_shoot = false;
        var sprite = new cc.Sprite("res/bullet.png");
        sprite.setScale(.75);
        this.bulletLayer.addChild(sprite);

        var destPosition = screenPosition;
        if(fishLifeCycle.myPlayer.holdFishInfo.getIsHolding()){
            var posBody = fishLifeCycle.myPlayer.holdFishInfo.getFish().getBodyPosition();
            destPosition = vec2(posBody.x * PM_RATIO,posBody.y * PM_RATIO);
        }

        player.setAngleForGun(destPosition);
        player.effectShoot();


        var location = vec2(destPosition.x,destPosition.y);
        var gun_pos = player.fire_real.convertToWorldSpaceAR(cc.p(0,0));
        var bullet = new Bullet(BULLET_LIVE);
        bullet.playerID = player.index;
        bullet.released = false;
        bullet.setNodeDisplay( sprite);
        this.gameMgr.createBodyForBullet(bullet,vec2(.5,.5));
        this.gameMgr.shootBullet(bullet,vec2(gun_pos.x / PM_RATIO,gun_pos.y / PM_RATIO),vec2((location.x - gun_pos.x) / PM_RATIO,(location.y - gun_pos.y) / PM_RATIO));
        if(player.holdFishInfo.getIsHolding()){
            bullet.setHoldInfo(player.holdFishInfo);
        }
        bullet.update(0);
    },
    onEnter: function()
    {
        this._super();
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });

        cc.eventManager.addListener(this._listener,this);

        this.scheduleUpdateWithPriority(100);
        matranMap.listener = this;
        //matranMap.start(0,0)
        window.updateListener = this.doUpdate.bind(this);
    },
    onExit: function () {
        window.updateListener = null;
    },
    addFish: function(id,typeFish,pathData,pathTime,elapsedTime)        // add fish khi ban thuong
    {
        var sp = this.createFishAnim(typeFish);
        this.fish2DLayer.addChild(sp);

        var path = new PathEntity(pathTime);
        for(var i=0;i<pathData.length;i++)
        {
            path.addPathPoint(vec2(pathData[i].x * PM_RATIO,pathData[i].y * PM_RATIO));
        }
        path.calculate();
        var fish = new Fish();
        fish.id = id;
        fish.fishType = typeFish;
        fish.setNodeDisplay(sp);
        fish.startWithPath(path,elapsedTime);
        fish.enableFlip(typeFish>= 26);
        fish.setContentSize(cc.size(fishData.data["fish_type_"+typeFish]["box"][0] * PM_RATIO * 2,fishData.data["fish_type_"+typeFish]["box"][1] * PM_RATIO * 2));

        this.gameMgr.createBodyForFish(fish,vec2(fishData.data["fish_type_"+typeFish]["box"][0]/2,fishData.data["fish_type_"+typeFish]["box"][1]/2));

        this.gameMgr.saveFish(id,fish);

        return fish;
    },
    update: function(dt)
    {
        this.doUpdate(dt);
    },
    doUpdate: function (dt) {
        // cc.log("do update");
        if(this.gameMgr.state === BCGameManager.STATE_MATRIX_MAP)
        {
            matranMap.update(dt);
        }

        this.gameMgr.update(dt);

        // for holding Fish display
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].isEnabled && this.players[i].holdFishInfo.getIsHolding() && this.players[i].holdFishInfo.getFish()){
                if(this.players[i].holdFishInfo.getFish().isNeedRemove() || this.players[i].holdFishInfo.getFish().released || this.players[i].holdFishInfo.getFish().isOutsite())
                {
                    this.players[i].releaseHold();
                    continue;
                }
                var posBody = this.players[i].holdFishInfo.getFish().getBodyPosition();
                var screenPosBody = vec2(posBody.x * PM_RATIO,posBody.y * PM_RATIO);
                this.players[i].setAngleForGun(screenPosBody);

                var gun_pos = this.players[i].fire_real.convertToWorldSpaceAR(cc.p(0,0));
                var offsetX = screenPosBody.x - gun_pos.x;
                var offsetY = screenPosBody.y - gun_pos.y;
                var length = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
                this.players[i].nodeDisplayHold.setLength(length);
            }
        }

        // for enable shoot
        if(!this.enable_shoot)
        {
            this.time_for_shoot += dt;
            if(this.time_for_shoot >= DELAY_SHOOT)
            {
                this.time_for_shoot = 0;
                this.enable_shoot = true;
            }
        }
        if(!this.enable_shoot)
            return;

        if(this.auto_shoot)
        {
            if(this.checkMoney())
                this.shootAuto(fishLifeCycle.myPlayer);
            else
            {
                this.setAutoShootFlag(!this.auto_shoot);
                this.checkMoneyForShootDialog();
            }
        }
        else if(this.hold_mouse)
        {
            if(this.gameMgr.state != BCGameManager.STATE_PREPARE)
            {
                if(this.checkMoney())
                {
                    this.shoot(fishLifeCycle.myPlayer,this.point_to_shoot);
                    if(this.actionListener && this.actionListener.onStartShoot){
                        this.actionListener.onStartShoot.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],this.point_to_shoot.x / PM_RATIO,this.point_to_shoot.y / PM_RATIO);
                    }
                    else
                        fishBZ.sendStartShoot(fishLifeCycle.bets[fishLifeCycle.myBetIdx],this.point_to_shoot.x / PM_RATIO,this.point_to_shoot.y / PM_RATIO);
                }
                else
                {
                    this.hold_mouse = false;
                    this.checkMoneyForShootDialog();
                }


            }
            else{
                fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
            }
        }
    },
    onCreateFish: function(id,fish_type,path,time_xuat_hien,elapsedTime)       // create fish in matran
    {
        //cc.log("id :" + id +" fish: "+fish_type);
        this.addFish(id,fish_type,path,time_xuat_hien,elapsedTime);
    },
    onTouchBegan: function(touch,event)
    {
        if((touch.getID() !== undefined) && touch.getID() != 0)
            return false;
        if(this.isShowMenu)
        {
            this.btnMenu.setVisible(true);
            this.isShowMenu = false;
            this.panel_menu.runAction(cc.sequence(cc.moveTo(.35,this.panel_menu.originalPos.x,this.panel_menu.originalPos.y).easing(cc.easeBackIn()),cc.hide()));
        }

        var location = touch.getLocation();
        this.last_touch_point = location;

        this.particleBongNuoc.stopAllActions();
        this.particleBongNuoc.setOpacity(100);
        this.particleBongNuoc.setPosition(location.x,location.y - 40);
        this.particleBongNuoc.setVisible(true);

        if(fishLifeCycle.myPlayer.holdFishInfo.prepare_hold){
            var fish_find = this.gameMgr.getFishByPos(location);
            if(fish_find){
                if((fish_find.fishType >= 19 && fish_find.fishType <= 22) || fish_find.fishType == 25)
                {
                    cc.log("Khong the khoa' loai. ca' nay`");
                }
                else
                {
                    if(fish_find.fishType < 26)     // voi 3 loai boss thi ko can` vi` no boi vong quanh
                        fish_find.enableCheckOutsite(true);
                    fishLifeCycle.myPlayer.setHold(fish_find);
                    fishBZ.sendLockFish(true,fish_find.id);
                }
                this.txtLock.setVisible(false);
                fishLifeCycle.myPlayer.holdFishInfo.prepare_hold = false;
            }
            // else
            // {
            //     fishLifeCycle.myPlayer.releaseHold();
            // }
            // fishLifeCycle.myPlayer.holdFishInfo.prepare_hold = false;
            return true;
        }

        if(!this.checkMoneyForShootDialog())
            return false;

        if(this.enable_shoot && this.gameMgr.state != BCGameManager.STATE_PREPARE)
        {
            this.shoot(fishLifeCycle.myPlayer,location);
            if(this.actionListener && this.actionListener.onStartShoot){
                this.actionListener.onStartShoot.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],location.x / PM_RATIO,location.y / PM_RATIO);
            }
            else {
                // for (var i = 0; i < 10; i ++) {
                    fishBZ.sendStartShoot(fishLifeCycle.bets[fishLifeCycle.myBetIdx], location.x / PM_RATIO, location.y / PM_RATIO);
                // }
            }


        }
        else if(this.gameMgr.state == BCGameManager.STATE_PREPARE){
            fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
        }
        this.point_to_shoot = location;
        this.hold_mouse = true;
        this.time_auto_shoot = 0;

        return true;
    },
    onTouchMoved: function(touch,event)
    {
        if((touch.getID() !== undefined) && touch.getID() != 0)
            return false;
        this.point_to_shoot = touch.getLocation();
        this.last_touch_point = this.point_to_shoot;

        fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
        this.particleBongNuoc.setPosition(this.point_to_shoot.x,this.point_to_shoot.y - 40);
    },
    onTouchEnded: function(touch,event)
    {
        if((touch.getID() !== undefined) && touch.getID() != 0)
            return false;
        this.last_touch_point = touch.getLocation();

        this.hold_mouse = false;
        this.particleBongNuoc.runAction(cc.sequence(cc.fadeOut(.5),cc.hide()));

    },
    createEffectFishDie: function(fishSp,money,playerIndex,withCoin)
    {
        if(!fishSp)
        {
            cc.log("WARNING : fishSp is NULL");
            return;
        }
        var pos = fishSp.getPosition();

        var str = "" + BCStringUtility.standartNumber(Math.abs(money));
        var fontFile = (playerIndex == fishLifeCycle.myChair)?"res/GUI/Fonts/Tien vang-export.fnt":"res/GUI/Fonts/Tien bac-export.fnt";
        var moneyLb =  new cc.LabelBMFont(str,fontFile,0);
        moneyLb.setPosition(pos);

        this.effectLayer.addChild(moneyLb,1);
        // remove fish SP
        var spF = fishSp.getChildByTag(0);
        spF.stopActionByTag(110);           //end action swim
        if(fishSp.getChildByTag(1))
            fishSp.getChildByTag(1).stopAllActions();
        spF.runAction(cc.sequence(cc.delayTime(.85),cc.fadeOut(.15)));
        fishSp.runAction(cc.sequence(cc.delayTime(1),cc.removeSelf()));
        //effect money
        moneyLb.setOpacity(50);
        moneyLb.setScale(.5);
        moneyLb.runAction(cc.sequence(new cc.EaseBackOut(cc.scaleTo(.2,.85)),new cc.EaseBackOut(cc.scaleTo(.15,.6)),new cc.EaseBackOut(cc.scaleTo(.2,.85))));
        moneyLb.runAction(cc.sequence(cc.fadeIn(.25),cc.delayTime(1),cc.fadeOut(.25),cc.removeSelf()));

        //
        //effect gold
        var goldSp = this.createEffectMoney(pos,playerIndex,money);

        if(withCoin)
            this.createEffectCoin(pos);
    },
    createEffectFishFired: function(pos,index)
    {
        var sp = new cc.Sprite("res/fishData/effect/net2.png");
        this.effectLayer.addChild(sp);
        if(fishLifeCycle.myChair == index)
            sp.setColor(cc.color(255,100,0));
        sp.setOpacity(150);
        sp.setScale(.35);
        sp.setPosition(pos);
        sp.runAction(cc.sequence(cc.spawn(cc.fadeIn(.25),new cc.EaseBackOut(cc.scaleTo(.25,.55))),cc.fadeTo(.35,0),cc.removeSelf()));
    },
    effectMoney: function(playerPosition,won_money)
    {

    },

    createWater: function()
    {
        var sp = new cc.Sprite("res/fishData/water/water_0.png");
        var animation = new cc.Animation()
        for (var i = 0; i <= 15; i++) {
            var frameName = "res/fishData/water/water_" + i+ ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.1);
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));

        return sp;
    },
    createFishAnim: function(type)
    {
        var node = new cc.Node();
        var data = fishData.data["fish_type_"+type];
        var animation = cc.animationCache.getAnimation("fish_"+type+"_swim");

        if(data["shadow"])
        {
            var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("fish_" +type +"_01.png"));
            var action = cc.animate(animation);
            sp.runAction(cc.repeatForever(action));
            node.addChild(sp,0,1);
            sp.setPosition(data["shadow_offset"][0] + data["sprite_offset"][0],data["shadow_offset"][1] +  data["sprite_offset"][1]);
            sp.setColor(cc.color(0,0,0));
            sp.setOpacity(100);
            //sp.setFlippedX(true);
        }
        if(data["isBoss"])
        {
            var sp = new cc.Sprite("res/fishData/effect/boss_chan_"+(type - 25) +".png");
            node.addChild(sp,1,2);
            sp.runAction(cc.repeatForever(cc.rotateBy(5,360)));
        }
        var sp2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("fish_" +type +"_01.png"));
        var action =cc.repeatForever(cc.animate(animation));action.setTag(110);
        sp2.runAction(action);
        node.addChild(sp2,2,0);
        sp2.setPosition( data["sprite_offset"][0], data["sprite_offset"][1]);
        if(Config.DEBUG)
        {
            var ww = data["box"][0] * PM_RATIO;
            var hh = data["box"][1] * PM_RATIO;
            var color = new cc.LayerColor(cc.color(255,255),ww,hh);
            color.setPosition(-ww/2,-hh/2);
            color.setScale( 1 / data["scale"]);
            node.addChild(color,0);

            //sp2.setVisible(false);

        }
        node.setScale(data["scale"]);
        node.setLocalZOrder(Math.floor(data["zorder"]));


        return node;
    },
    onButtonReleased: function(btn,id){
        switch (id){
            case GameLayerUI.BTN_HOLD_FISH:{

                if(this.gameMgr.state == BCGameManager.STATE_PREPARE)
                    break;

                if(!fishLifeCycle.myPlayer.holdFishInfo.getIsHolding())
                {
                    fishLifeCycle.myPlayer.holdFishInfo.prepare_hold = true;
                    this.txtLock.setVisible(true);
                }
                else
                {
                    fishLifeCycle.myPlayer.releaseHold();
                    fishBZ.sendLockFish(false,-1);
                    this.txtLock.setVisible(false);

                }
                break;
            }
            case GameLayerUI.BTN_PLUS:
            {
                fishLifeCycle.myBetIdx++;
                if(fishLifeCycle.myBetIdx >= (fishLifeCycle.bets.length-1))
                    fishLifeCycle.myBetIdx = (fishLifeCycle.bets.length-1);

                fishLifeCycle.myPlayer.setGunBet(fishLifeCycle.bets[fishLifeCycle.myBetIdx],true);

                break;
            }
            case GameLayerUI.BTN_SUB:
            {
                fishLifeCycle.myBetIdx--;
                if(fishLifeCycle.myBetIdx <= 0)
                    fishLifeCycle.myBetIdx = 0;

                fishLifeCycle.myPlayer.setGunBet(fishLifeCycle.bets[fishLifeCycle.myBetIdx],true);
                break;
            }
            case GameLayerUI.BTN_QUIT:
            {
                if(!this.actionListener)
                {
                    BCDialog.showDialog("Bạn muốn thoát khỏi phòng chơi?",this,function (id) {
                        if(id == BCDialog.BTN_OK)
                            fishBZ.sendQuit();
                    })
                }
                else
                {
                    var lobbyScene = new LobbyScene();
                    lobbyScene.onUpdateData();
                    bcSceneMgr.openWithScene(lobbyScene);
                    fishSound.stopMusic();
                    fishSound.playMusicLobby();
                }
                break;

            }
            case GameLayerUI.BTN_MENU:
            {
                this.panel_menu.stopAllActions();
                if(!this.isShowMenu)
                {
                    btn.setVisible(false);
                    this.isShowMenu = true;
                    this.panel_menu.runAction(cc.sequence(cc.show(),cc.moveTo(.35,this.panel_menu.originalPos.x - 320,this.panel_menu.originalPos.y).easing(cc.easeBackOut())));
                }
                else
                {
                    this.isShowMenu = false;
                    this.panel_menu.runAction(cc.sequence(cc.moveTo(.35,this.panel_menu.originalPos.x,this.panel_menu.originalPos.y).easing(cc.easeBackIn()),cc.hide()));
                }

                break;
            }
            case GameLayerUI.BTN_AUTO:
            {
                if(!this.actionListener && !this.checkMoneyForShootDialog())
                    break;
                this.setAutoShootFlag(!this.auto_shoot);
                break;
            }
            case GameLayerUI.BTN_MUSIC:
            {
                gameData.enableMusic = !gameData.enableMusic;
                gameData.saveStorage();
                this.loadUIMusicSound();
                break;
            }
            case GameLayerUI.BTN_SOUND:
            {
                gameData.enableSound = !gameData.enableSound;
                gameData.saveStorage();
                if(gameData.enableSound) {
                    this.btnSound.loadTextures("button/btnSound.png", "button/btnSound.png", "button/btnSound.png", 1);
                }
                else
                    this.btnSound.loadTextures("button/btnSoundOff.png", "button/btnSoundOff.png", "button/btnSoundOff.png", 1);
                break;
            }
        }
    },
    createEffectMoney: function(pos,playerIndex,money)
    {
        var node = new cc.Node();
        var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("coin1_0.png"));
        this.effectLayerTop.addChild(node);
        var animation = new cc.Animation();
        for (var i = 0; i < 5; i++) {
            var frameName = "coin1_"+ i + ".png";
            animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName));
        }
        animation.setDelayPerUnit(0.075);
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));

        sp.setRotation(90);;
        sp.setColor(cc.color(220,220,220))
        node.addChild(sp);
        sp.setScale(.75);

        var destPos = this.players[playerIndex].lbMoney.convertToWorldSpaceAR(cc.p(0,0));
        var offset = cc.p(pos.x - destPos.x,pos.y - destPos.y);
        var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        var time = distance / 1280;
        node.setPosition(pos.x , pos. y + 20);
        node.runAction(cc.sequence(cc.moveTo(.15,cc.p(pos.x,pos.y + 80)),new cc.EaseBounceOut(cc.moveBy(.45,cc.p(0,-100))),
            cc.delayTime(.15),cc.moveTo(time,cc.p(destPos)),cc.removeSelf()
        ))
        sp.runAction(cc.sequence(cc.delayTime(.15 +.45 +.15+time -.15),cc.fadeOut(.15)));

        fishSound.playEffectCoin();

        if(playerIndex == fishLifeCycle.position || true)
        {
            var txt = BCBaseLayer.createLabelText("+"+BCStringUtility.standartNumber(money)+"$",cc.color(255,255,255));
            txt.setFontSize(22);
            txt.setPosition(destPos);
            this.effectLayerTop.addChild(txt);
            var timeDelay = .15 +.45 +.15+time -.15;
            txt.setVisible(false);
            txt.runAction(cc.sequence(cc.delayTime(timeDelay),cc.show(),cc.moveBy(1,cc.p(0,playerIndex>=2?-100:100)),cc.removeSelf()));
            txt.runAction(cc.sequence(cc.delayTime(timeDelay +.5),cc.fadeOut(.5)));

            //this.players[playerIndex].lbMoney.stopAllActions();
            if(playerIndex == fishLifeCycle.position)
                this.players[playerIndex].lbMoney.runAction(cc.sequence(cc.delayTime(timeDelay),cc.callFunc(function(){
                this.setScale(2.5);
                this.runAction(cc.scaleTo(.35,1));
            }.bind(this.players[playerIndex].lbMoney))))
        }



        return node;
    },
    createEffectMoney2: function(pos,playerIndex)
    {
        var node = new cc.Node();
        var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("xu_00000.png"));
        this.effectLayer.addChild(node);
        var animation = new cc.Animation();
        for (var i = 0; i < 80; i++) {
            var frameName = "xu_000"+ (i<10?"0"+i:i) + ".png";
            animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName));
        }
        animation.setDelayPerUnit(0.01);
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));

        sp.setRotation(90);;
        sp.setColor(cc.color(220,220,220))
        node.addChild(sp);
        sp.setScale(.75);

        var destPos = this.players[playerIndex].lbMoney1.convertToWorldSpaceAR(cc.p(0,0));
        var offset = cc.p(pos.x - destPos.x,pos.y - destPos.y);
        var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        var time = distance / 1280;
        node.setPosition(pos.x , pos. y + 20);
        node.runAction(cc.sequence(cc.moveTo(.15,cc.p(pos.x,pos.y + 80)),new cc.EaseBounceOut(cc.moveBy(.45,cc.p(0,-100))),
            cc.delayTime(.15),cc.moveTo(time,cc.p(destPos)),cc.fadeOut(.25),cc.removeSelf()
        ))

        return node;
    },
    startMusic: function(){

        this.currentBG = Math.floor(Math.random() * 3);
        if(this.currentBG > 2)
            this.currentBG = 2;

        this.backgrounds[0].setVisible(false);
        this.backgrounds[1].setVisible(false);
        this.backgrounds[2].setVisible(false);

        this.backgrounds[this.currentBG].setVisible(true);

        fishSound.playMusicBackgroundGame(this.currentBG);

        var action = cc.sequence(cc.delayTime(100),cc.callFunc(function(){
            var lastBG = this.currentBG;
            this.currentBG++;
            if(this.currentBG > 2)
                this.currentBG -= 3;

            this.backgrounds[0].setVisible(false);
            this.backgrounds[1].setVisible(false);
            this.backgrounds[2].setVisible(false);

            this.backgrounds[lastBG].setVisible(true);
            this.backgrounds[lastBG].runAction(cc.fadeOut(.5));
            this.backgrounds[this.currentBG].setVisible(true);
            this.backgrounds[this.currentBG].setOpacity(0);
            this.backgrounds[this.currentBG].runAction(cc.fadeIn(.5));

            fishSound.playMusicBackgroundGame(this.currentBG);
        }.bind(this))).repeatForever();
        action.setTag(1111);
        this.runAction(action);

    },
    stopMusic: function(){
        fishSound.stopMusic();
        this.stopActionByTag(1111);
    },
    createEffectCoin: function(pos){

        var node = new cc.Node();
        var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("coin.0000.png"));
        this.effectLayer.addChild(node);
        var animation = new cc.Animation();
        for (var i = 0; i < 90; i++) {
            var frameName = "coin.00"+ (i<10?"0"+i:i) + ".png";
            animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName));
        }
        animation.setDelayPerUnit(0.02);
        var action = cc.animate(animation);
        sp.runAction(action);
        sp.runAction(cc.sequence(cc.delayTime(0.02 * 90 - 0.25),cc.fadeOut(.25)));

        node.addChild(sp);
        sp.setScale(2.25);
        sp.setColor(cc.color(220,220,220));

        node.setPosition(pos);
        node.runAction(cc.sequence(cc.delayTime(0.02 * 90),cc.removeSelf()))
        this.shakeScreen();
        fishSound.playEffectBoom();
        return node;
    },
    shakeScreen: function(){
        this.panel_diaplay.stopActionByTag(9);
        var shake = cc.sequence(cc.moveBy(.0175,cc.p(3,3)),cc.moveBy(.035,cc.p(-6,-6)),cc.moveBy(.0175,cc.p(3,3))).repeat(2);
        shake.setTag(9);
        this.panel_diaplay.runAction(shake);
    },
    playerScreen: function () {
        var sp = new cc.Sprite("res/GUI/ScreenGame/Background/playerPos.png");
        switch (fishLifeCycle.position)
        {
            case 0:
            {
                sp.setAnchorPoint(cc.p(0.2,0));
                sp.setPositionX(cc.winSize.width * 0.2);
                break;
            }
            case 1:
            {
                sp.setFlippedX(true);
                sp.setAnchorPoint(cc.p(0.8,0));
                sp.setPosition(cc.winSize.width * 0.8,0);
                break;
            }
            case 2:
            {
                sp.setFlippedX(true);
                sp.setFlippedY(true);
                sp.setAnchorPoint(cc.p(0.8,1));
                sp.setPosition(cc.winSize.width * 0.8,cc.winSize.height);
                break;
            }
            case 3:
            {
                sp.setAnchorPoint(cc.p(0.2,1));
                sp.setFlippedY(true);
                sp.setPosition(cc.winSize.width * 0.2,cc.winSize.height);
                break;
            }
        }
        this.addChild(sp,10);
        sp.runAction(cc.sequence(cc.delayTime(.75),cc.scaleTo(.85,10),cc.removeSelf()));

    },

    // chuan bi cho ca tran
    stateToPrepare: function(time){

        this.animCatranDen();
        // this.stopActionByTag(1111);     // khong doi background cho den khi normal map tro lai
        this.runAction(cc.sequence(cc.delayTime(time - 1.5),cc.callFunc(function(){
            this.effectLayer.removeAllChildren();
            this.cleanScreenForCatran();
        }.bind(this))))

        this.check_matrix = false;
    },
    cleanScreenForCatran: function(){

        this.bulletLayer.removeAllChildren();

        // clean hold

        for(var i =0 ;i< MAX_PLAYER;i++)
        {
            this.players[i].releaseHold();
        }
        fishLifeCycle.myPlayer.holdFishInfo.prepare_hold = false;
        this.txtLock.setVisible(false);

        // destroy all
        if(!this.check_matrix)
            this.gameMgr.destroyAllEntity(false);

        var currentFishLayer = this.fish2DLayer;
        this.fish2DLayer = new Display2DScene();
        this.panel_diaplay.addChild(this.fish2DLayer,2);

        var bgPath = this.currentBG==0?"res/GUI/ScreenGame/Background/bg2.jpg":((this.currentBG==1)?"res/GUI/ScreenGame/Background/bg.jpg":"res/GUI/ScreenGame/Background/bg3.jpg");

        var bgTmp = new cc.Sprite(bgPath);
        bgTmp.setScaleX(cc.winSize.width / 1920);
        bgTmp.setScaleY(cc.winSize.height / 1080);
        bgTmp.setPosition(cc.winSize.width/2,cc.winSize.height/2);

        var stencil = new cc.Sprite(bgPath);
        stencil.setScaleX(cc.winSize.width / 1920);
        stencil.setScaleY(cc.winSize.height / 1080);
        stencil.setPosition(cc.winSize.width /2.0,cc.winSize.height/2);

        var TIME_CLEAN = 1.5;

        var clipping = new cc.ClippingNode(stencil);
        clipping.setAlphaThreshold(0);
        clipping.addChild(bgTmp);
        clipping.setInverted(true);
        currentFishLayer.addChild(clipping,100);
        stencil.runAction(cc.moveBy(TIME_CLEAN,cc.p(-cc.winSize.width - 30,0)));

        currentFishLayer.runAction(cc.sequence(cc.delayTime(TIME_CLEAN),cc.removeSelf()));

        var wave = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("wave_01.png"));
        wave.setScaleY(cc.winSize.height / wave.getContentSize().height);
        var animation = cc.animationCache.getAnimation("wave_move");
        wave.runAction(cc.repeatForever(cc.animate(animation)));

        currentFishLayer.addChild(wave,101);
        wave.setPosition(cc.winSize.width + 30,cc.winSize.height/2);
        wave.runAction(cc.sequence(cc.moveBy(TIME_CLEAN,cc.p(-cc.winSize.width - 30,0))));
    },
    animCatranDen: function(){
        var catranAnim =  sp.SkeletonAnimation.createWithJsonFile("res/FX/FXCaTran.json","res/FX/FXCaTran.atlas");
        catranAnim.setAnimation(0,"animation",true);
        this.effectLayer.addChild(catranAnim,20);
        catranAnim.setPosition(cc.winSize.width/2,0);
    },
    bossComing: function(){
        var catranAnim =  sp.SkeletonAnimation.createWithJsonFile("res/FX/Text_Boss_Coming.json","res/FX/Text_Boss_Coming.atlas");
        catranAnim.setAnimation(0,"BossTextAnim",true);

        this.addChild(catranAnim,20);
        catranAnim.setPosition(cc.winSize.width/2,400);
    },
    stateToNormalMap: function(){
        // this.stopMusic();
        // this.startMusic();
    },
    stateToMatrixMap: function(){

        this.gameMgr.destroyAllEntity(false);
        this.check_matrix = true;

    },
    checkMoney: function () {
        if(this.actionListener)
            return (fishLifeCycle.bets[fishLifeCycle.myBetIdx] <= fishLifeCycle.myPlayer.playerData.rawData["gold"]);
        return (fishLifeCycle.bets[fishLifeCycle.myBetIdx] <= gameData.userData["gold"]);
    },
    checkMoneyForShootDialog: function () {
        if(this.actionListener)
            return true;
        if(!this.checkMoney())
        {
            BCDialog.showDialog("   Bạn cần nạp thêm vàng để tiếp tục chơi!",this,function (id) {
                if(id == BCDialog.BTN_OK)
                {

                }
            })
            return false;
        }
        return true;
    },

    loadUIMusicSound: function () {
        if(gameData.enableMusic)
        {
            fishSound.playMusicBackgroundGame(this.currentBG);
            this.btnMusic.loadTextures("button/btnMusic.png","button/btnMusic.png","button/btnMusic.png",1);
        }
        else
        {
            fishSound.stopMusic();
            this.btnMusic.loadTextures("button/btnMusicOff.png","button/btnMusicOff.png","button/btnMusicOff.png",1);
        }

        if(gameData.enableSound) {
            this.btnSound.loadTextures("button/btnSound.png", "button/btnSound.png", "button/btnSound.png", 1);
        }
        else
            this.btnSound.loadTextures("button/btnSoundOff.png", "button/btnSoundOff.png", "button/btnSoundOff.png", 1);


    }


});

GameLayerUI.BTN_HOLD_FISH = 0;
GameLayerUI.BTN_MENU = 1;

GameLayerUI.BTN_PLUS = 2;
GameLayerUI.BTN_SUB = 3;
GameLayerUI.BTN_AUTO = 4;

GameLayerUI.BTN_QUIT = 5;
GameLayerUI.BTN_MUSIC = 6;
GameLayerUI.BTN_SOUND = 7;
GameLayerUI.BTN_FISH = 8;