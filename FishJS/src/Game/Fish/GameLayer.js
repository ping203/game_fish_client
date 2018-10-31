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


var GameLayerUI = BaseLayer.extend({
    ctor: function()
    {
        this._super();

        this.initWithBinaryFile("res/GUI/GameLayer.json");
        //this._layout.setVisible(false);

        this.actionListener = null;
    },
    initGUI: function()
    {

        this.bulletLayer = new cc.Layer();
        this.effectLayer = new cc.Layer();
        this.topLayer = new cc.Layer();
        this.fish2DLayer = new Display2DScene();
        this.fish3DScene = new Display3DScene();
        var panel_display = this.getControl("Panel_Fish");
        panel_display.addChild(this.fish3DScene,1);
        panel_display.addChild(this.fish2DLayer,2);
        panel_display.addChild(this.effectLayer,4);
        var top_panel = this.getControl("Panel_Top");
        top_panel.addChild(this.topLayer,40);
        top_panel.addChild(this.bulletLayer,1);


        var panel_ui = this.getControl("Panel_UI");
        this.customizeButton("btnHold",GameLayerUI.BTN_HOLD_FISH,panel_ui);

        var water = this.createWater();
        water.setOpacity(100);

        panel_display.addChild(water,3);
        water.setPosition(cc.winSize.width /2 ,cc.winSize.height / 2);

        water.setScaleX(cc.winSize.width / water.getContentSize().width);
        water.setScaleY(cc.winSize.height / water.getContentSize().height);

        this.particleBongNuoc = new cc.ParticleSystem("res/fishData/effect/bong_nuoc_effect.plist");
        this.topLayer.addChild(this.particleBongNuoc);
        this.particleBongNuoc.setPosition(0,0);
        this.particleBongNuoc.setVisible(false);

        this.players = [];
        for(var i =0 ;i< MAX_PLAYER;i++)
        {
            var panel = this.getControl("player_"+i);
            var player = new Player(panel,this);
            player.index = i;
            this.players.push(player);
            panel.setVisible(false);

            player.btnPlus.setPressedActionEnabled(true);
            player.btnPlus.setTag(GameLayerUI.BTN_PLUS);
            player.btnPlus.addTouchEventListener(this.onTouchEventHandler,this);

            player.btnSub.setPressedActionEnabled(true);
            player.btnSub.setTag(GameLayerUI.BTN_SUB);
            player.btnSub.addTouchEventListener(this.onTouchEventHandler,this);
        }
        this.time = 0;

        this.initBox2D();
        this.time_for_shoot = 0;
        this.time_auto_shoot = 0;
        this.enable_shoot = true;

        this.auto_shoot = false;
        this.hold_mouse = false;
        this.point_to_shoot = vec2(0,0);

    },
    setActionListener: function(lis){
        this.actionListener = lis;
    },

    initBox2D: function()
    {
        this.gameMgr = new GameManager(new Setting());
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
        if(bullet.holdInfo && bullet.holdInfo.isHolding)
        {
            collide_check = (bullet.holdInfo.fishForHold == fish);
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
                fishBZ.sendShootFish(fishLifeCycle.bets[fishLifeCycle.myBetIdx],fish.id);
                if(this.actionListener && this.actionListener.onShootFish){
                    this.actionListener.onShootFish.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],fish.id);
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

    shoot: function(player,screenPosition)
    {
        var sprite = new cc.Sprite("res/bullet.png");
        sprite.setScale(.75);
        this.bulletLayer.addChild(sprite);

        var destPosition = screenPosition;
        if(fishLifeCycle.myPlayer.holdFishInfo.isHolding){
            var posBody = fishLifeCycle.myPlayer.holdFishInfo.fishForHold.getBodyPosition();
            destPosition = vec2(posBody.x * PM_RATIO,posBody.y * PM_RATIO);
        }

        player.setAngleForGun(destPosition);
        player.effectShoot();


        var location = vec2(destPosition.x,destPosition.y);
        var gun_pos = player.fire_real.convertToWorldSpaceAR(cc.p(0,0));
        var bullet = new Bullet(4);
        bullet.playerID = player.index;
        bullet.released = false;
        bullet.setNodeDisplay( sprite);
        this.gameMgr.createBodyForBullet(bullet,vec2(.5,.5));
        this.gameMgr.shootBullet(bullet,vec2(gun_pos.x / PM_RATIO,gun_pos.y / PM_RATIO),vec2((location.x - gun_pos.x) / PM_RATIO,(location.y - gun_pos.y) / PM_RATIO));
        if(player.holdFishInfo.isHolding){
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

        this.scheduleUpdate();
        matranMap.listener = this;
        //matranMap.start(0,0)

    },
    addFish: function(id,typeFish,pathData,pathTime,elapsedTime)
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
        fish.setNodeDisplay(sp);
        fish.startWithPath(path,elapsedTime);

        this.gameMgr.createBodyForFish(fish,vec2(fishData.data["fish_type_"+typeFish]["box"][0]/2,fishData.data["fish_type_"+typeFish]["box"][1]/2));

        this.gameMgr.saveFish(id,fish);

        return fish;
    },
    update: function(dt)
    {
        if(this.gameMgr.state == GameManager.STATE_MATRIX_MAP)
        {
            matranMap.update(1.0/60);
        }

        this.gameMgr.update(dt);

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
        //  for hold mouse
        if(this.hold_mouse)
        {
            this.time_auto_shoot += dt;
            if(this.time_auto_shoot >= DELAY_SHOOT)
            {
                this.time_auto_shoot = 0;
                if(this.gameMgr.state != GameManager.STATE_PREPARE)
                {
                    this.shoot(fishLifeCycle.myPlayer,this.point_to_shoot);
                    fishBZ.sendStartShoot(fishLifeCycle.bets[fishLifeCycle.myBetIdx],this.point_to_shoot.x / PM_RATIO,this.point_to_shoot.y / PM_RATIO);
                    if(this.actionListener && this.actionListener.onStartShoot){
                        this.actionListener.onStartShoot.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],this.point_to_shoot.x / PM_RATIO,this.point_to_shoot.y / PM_RATIO);
                    }
                    fishSound.playEffectShoot();
                }
                else{
                    fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
                }
            }
        }

        // for holding Fish display
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].isEnabled && this.players[i].holdFishInfo.isHolding && this.players[i].holdFishInfo.fishForHold){
                if(this.players[i].holdFishInfo.fishForHold.released)
                {
                    this.players[i].releaseHold();
                    continue;
                }
                var posBody = this.players[i].holdFishInfo.fishForHold.getBodyPosition();
                var screenPosBody = vec2(posBody.x * PM_RATIO,posBody.y * PM_RATIO);
                this.players[i].setAngleForGun(screenPosBody);

                var gun_pos = this.players[i].fire_real.convertToWorldSpaceAR(cc.p(0,0));
                var offsetX = screenPosBody.x - gun_pos.x;
                var offsetY = screenPosBody.y - gun_pos.y;
                var length = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
                this.players[i].nodeDisplayHold.setLength(length);
            }
        }
    },
    onCreateFish: function(id,fish_type,path)       // create fish in matran
    {
        //cc.log("id :" + id +" fish: "+fish_type);
        this.addFish(id,fish_type,path,8,0);
    },
    onTouchBegan: function(touch,event)
    {
        if((touch.getID() !== undefined) && touch.getID() != 0)
            return false;
        var location = touch.getLocation();


        this.particleBongNuoc.stopAllActions();
        this.particleBongNuoc.setOpacity(100);
        this.particleBongNuoc.setPosition(location.x,location.y - 40);
        this.particleBongNuoc.setVisible(true);

        if(fishLifeCycle.myPlayer.holdFishInfo.prepare_hold){
            var fish_find = this.gameMgr.getFishByPos(location);
            if(fish_find){
                fishLifeCycle.myPlayer.setHold(fish_find);
                fishBZ.sendLockFish(true,fish_find.id);
            }
            else
            {
                fishLifeCycle.myPlayer.releaseHold();
            }
            fishLifeCycle.myPlayer.holdFishInfo.prepare_hold = false;
            return true;
        }

        if(this.enable_shoot && this.gameMgr.state != GameManager.STATE_PREPARE)
        {
            this.shoot(fishLifeCycle.myPlayer,location);
            fishBZ.sendStartShoot(fishLifeCycle.bets[fishLifeCycle.myBetIdx],location.x / PM_RATIO,location.y / PM_RATIO);
            if(this.actionListener && this.actionListener.onStartShoot){
                this.actionListener.onStartShoot.call(this.actionListener,fishLifeCycle.bets[fishLifeCycle.myBetIdx],location.x / PM_RATIO,location.y / PM_RATIO);
            }
            fishSound.playEffectShoot();
            this.enable_shoot = false;
        }
        else if(this.gameMgr.state == GameManager.STATE_PREPARE){
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
        fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
        this.particleBongNuoc.setPosition(this.point_to_shoot.x,this.point_to_shoot.y - 40);
    },
    onTouchEnded: function(touch,event)
    {
        if((touch.getID() !== undefined) && touch.getID() != 0)
            return false;
        this.hold_mouse = false;
        this.particleBongNuoc.runAction(cc.sequence(cc.fadeOut(.5),cc.hide()));

    },
    createEffectFishDie: function(fishSp,money,playerIndex)
    {
        if(!fishSp)
        {
            cc.log("WARNING : fishSp is NULL");
            return;
        }
        var pos = fishSp.getPosition();

        var str = "" + StringUtility.standartNumber(Math.abs(money));
        var fontFile = (playerIndex == fishLifeCycle.myChair)?"res/fonts/Tien bac-export.fnt":"res/fonts/Tien bac-export.fnt";
        var moneyLb =  new cc.LabelBMFont(str,fontFile,0);
        moneyLb.setPosition(pos);

        this.effectLayer.addChild(moneyLb,1);
        // remove fish SP
        var spF = fishSp.getChildByTag(0);
        spF.stopActionByTag(110);           //end action swim
        if(fishSp.getChildByTag(1))
            fishSp.getChildByTag(1).stopAllActions();
        //spF.setColor(cc.color(150,0,0));
        spF.runAction(cc.sequence(cc.delayTime(.85),cc.fadeOut(.15)));
        fishSp.runAction(cc.sequence(cc.delayTime(1),cc.removeSelf()));
        //effect money
        moneyLb.setOpacity(50);
        moneyLb.setScale(.5);
        moneyLb.runAction(cc.sequence(new cc.EaseBackOut(cc.scaleTo(.2,.85)),new cc.EaseBackOut(cc.scaleTo(.15,.6)),new cc.EaseBackOut(cc.scaleTo(.2,.85))));
        moneyLb.runAction(cc.sequence(cc.fadeIn(.25),cc.delayTime(1),cc.fadeOut(.25),cc.removeSelf()));

        //effect gold
        var goldSp = this.createEffectMoney(pos,playerIndex);
    },
    createEffectFishFired: function(pos,index)
    {
        var sp = new cc.Sprite("res/GUI/ScreenGame/FXNew/FXBulletHit/net2.png");
        this.effectLayer.addChild(sp);
        if(fishLifeCycle.myChair == index)
            sp.setColor(cc.color(255,100,0));
        sp.setOpacity(150);
        sp.setScale(.5);
        sp.setPosition(pos);
        sp.runAction(cc.sequence(cc.spawn(cc.fadeIn(.25),cc.scaleTo(.25,.7)),cc.fadeTo(.35,0),cc.removeSelf()));
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
        var sp2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("fish_" +type +"_01.png"));
        var action =cc.repeatForever(cc.animate(animation));action.setTag(110);
        sp2.runAction(action);
        node.addChild(sp2,1,0);
        sp2.setPosition( data["sprite_offset"][0], data["sprite_offset"][1]);
        //sp2.setFlippedX(true);
        if(Config.DEBUG)
        {
            var ww = data["box"][0] * PM_RATIO;
            var hh = data["box"][1] * PM_RATIO;
            var color = new cc.LayerColor(cc.color(255,255),ww,hh);
            color.setPosition(-ww/2,-hh/2);
            color.setScale( 1 / data["scale"]);
            node.addChild(color,0);

        }

        node.setScale(data["scale"]);
        node.setLocalZOrder(Math.floor(data["zorder"]));


        return node;
    },
    onButtonReleased: function(btn,id){
        switch (id){
            case GameLayerUI.BTN_HOLD_FISH:{
                if(!fishLifeCycle.myPlayer.holdFishInfo.isHolding)
                    fishLifeCycle.myPlayer.holdFishInfo.prepare_hold = true;
                else
                {
                    fishLifeCycle.myPlayer.releaseHold();
                    fishBZ.sendLockFish(false,-1);
                }
                break;
            }
            case GameLayerUI.BTN_PLUS:
            {
                fishLifeCycle.myBetIdx++;
                if(fishLifeCycle.myBetIdx >= (fishLifeCycle.bets.length-1))
                    fishLifeCycle.myBetIdx = (fishLifeCycle.bets.length-1);

                fishLifeCycle.myPlayer.setGunBet(fishLifeCycle.bets[fishLifeCycle.myBetIdx]);

                break;
            }
            case GameLayerUI.BTN_SUB:
            {
                fishLifeCycle.myBetIdx--;
                if(fishLifeCycle.myBetIdx <= 0)
                    fishLifeCycle.myBetIdx = 0;

                fishLifeCycle.myPlayer.setGunBet(fishLifeCycle.bets[fishLifeCycle.myBetIdx]);
                break;
            }
        }
    },
    createEffectMoney: function(pos,playerIndex)
    {
        var node = new cc.Node();
        var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("coin1_0.png"));
        this.effectLayer.addChild(node);
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

        var destPos = this.players[playerIndex].lbMoney1.convertToWorldSpaceAR(cc.p(0,0));
        var offset = cc.p(pos.x - destPos.x,pos.y - destPos.y);
        var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        var time = distance / 1280;
        node.setPosition(pos.x , pos. y + 20);
        node.runAction(cc.sequence(cc.moveTo(.15,cc.p(pos.x,pos.y + 80)),new cc.EaseBounceOut(cc.moveBy(.45,cc.p(0,-100))),
            cc.delayTime(.15),cc.moveTo(time,cc.p(destPos)),cc.fadeOut(.25),cc.removeSelf()
        ))

        return node;
    }


});

GameLayerUI.BTN_HOLD_FISH = 0;
GameLayerUI.BTN_MENU = 1;

GameLayerUI.BTN_PLUS = 2;
GameLayerUI.BTN_SUB = 3;