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


var GameLayerUI = BaseLayer.extend({
    ctor: function()
    {
        this._super();

        this.initWithBinaryFile("res/GUI/GameLayer.json");
        //this._layout.setVisible(false);
    },
    initGUI: function()
    {

        this.bulletLayer = new cc.Layer();
        this.effectLayer = new cc.Layer();
        this.fish2DLayer = new Display2DScene();
        this.fish3DScene = new Display3DScene();
        var panel_display = this.getControl("Panel_Fish");
        panel_display.addChild(this.fish3DScene,1);
        panel_display.addChild(this.fish2DLayer,2);
        panel_display.addChild(this.bulletLayer,3);
        panel_display.addChild(this.effectLayer,4);

        var water = this.createWater();
        water.setOpacity(100);

        panel_display.addChild(water,3);
        water.setPosition(cc.winSize.width /2 ,cc.winSize.height / 2);

        water.setScaleX(cc.winSize.width / water.getContentSize().width);
        water.setScaleY(cc.winSize.height / water.getContentSize().height);



        this.players = [];
        for(var i =0 ;i< MAX_PLAYER;i++)
        {
            var panel = this.getControl("player_"+i);
            var player = new Player(panel,this);
            player.index = i;
            this.players.push(player);
            panel.setVisible(false);
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
    initBox2D: function()
    {
        this.gameMgr = new GameManager(new Setting());
        this.gameMgr.setEntityCollisionListener(this.onEntityCollision.bind(this));
        //this.gameMgr.setOnContactPreSolve(this.onContactPreSolve.bind(this));
    },
    onEntityCollision: function(fish,bullet,pointCollide)
    {
        if(bullet.released)
        {
            cc.log("ERROR : adu : bullet failed~");
            return;
        }

        bullet.released = true;
        this.createEffectFishFired(vec2(pointCollide.x * PM_RATIO,pointCollide.y *PM_RATIO),bullet.playerID);
        this.gameMgr.destroyEntity(bullet);

        if(fish.id !== undefined)
            fishBZ.sendShootFish(2000,fish.id);

    },
    onContactPreSolve: function(entity1,entity2,pointCollide)
    {
        if(entity1._type == Entity.FISH || entity2._type == Entity.FISH)
        {
            return false;
        }
        return true;
    },

    shoot: function(player,screenPosition)
    {
        var sprite = new cc.Sprite("res/bullet.png");
        sprite.setScale(.75);
        this.bulletLayer.addChild(sprite);

        player.setAngleForGun(screenPosition);
        player.effectShoot();


        var location = vec2(screenPosition.x,screenPosition.y);
        //cc.log(JSON.stringify(location))
        var gun_pos = player.fire_node.convertToWorldSpaceAR(cc.p(0,0));


        var bullet = new Bullet(4);
        bullet.playerID = player.index;
        bullet.released = false;
        bullet.setNodeDisplay( sprite);
        this.gameMgr.createBodyForBullet(bullet,vec2(.5,.5));

        this.gameMgr.shootBullet(bullet,vec2(gun_pos.x / PM_RATIO,gun_pos.y / PM_RATIO),vec2((location.x - gun_pos.x) / PM_RATIO,(location.y - gun_pos.y) / PM_RATIO));
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
    addFish3D: function()
    {
        if(this.count >= 10)
            return;
        this.count++;

        var fishModel = this.fish3DScene.createFish3D();
        var fish = new engine.Fish();
        fish.setNodeDisplay(fishModel);

        fishModel.setUserData(fishModel.camera);

        var rand = Math.floor(Math.random() * 8) + 2;
        var rand2 = Math.floor(Math.random() * 12) + 1;
        var path = new PathEntity(10);
        var pathData = fishData.fishPathData["P_"+rand2];

        for(var i=0;i<pathData.data.length;i++)
        {
            path.addPathPoint(pathData.data[i]);
            //cc.log("add :" + JSON.stringify(pathData.data[i]))
        }
        path.calculate();
        fish.startWithPath(path);

         this.gameMgr.createBodyForFish(fish,vec2(1,1));
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
        //
        if(this.hold_mouse)
        {
            this.time_auto_shoot += dt;
            if(this.time_auto_shoot >= DELAY_SHOOT)
            {
                this.time_auto_shoot = 0;
                if(this.gameMgr.state != GameManager.STATE_PREPARE)
                {
                    this.shoot(fishLifeCycle.myPlayer,this.point_to_shoot);
                    fishBZ.sendStartShoot(2000,this.point_to_shoot.x / PM_RATIO,this.point_to_shoot.y / PM_RATIO);
                    fishSound.playEffectShoot();
                }
                else{
                    fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
                }
            }
        }
    },
    onCreateFish: function(id,fish_type,path)
    {
        //cc.log("id :" + id +" fish: "+fish_type);
        this.addFish(id,fish_type,path,8,0);
    },
    onTouchBegan: function(touch,event)
    {
        //cc.log(touch.getID())
        //if(touch.getID() != 0)
        //    return false;
        var location = touch.getLocation();
        if(this.enable_shoot && this.gameMgr.state != GameManager.STATE_PREPARE)
        {
            this.shoot(fishLifeCycle.myPlayer,location);
            fishBZ.sendStartShoot(2000,location.x / PM_RATIO,location.y / PM_RATIO);
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
        //if(touch.getID() != 0)
        //    return;
        this.point_to_shoot = touch.getLocation();
        fishLifeCycle.myPlayer.setAngleForGun(this.point_to_shoot);
    },
    onTouchEnded: function(touch,event)
    {
        //if(touch.getID() != 0)
        //    return;
        this.hold_mouse = false;
    },
    createEffectFishDie: function(fishSp,money,playerIndex)
    {
        var pos = fishSp.getPosition();
        var str = "+" + StringUtility.standartNumber(Math.abs(money));
        var fontFile = (playerIndex == fishLifeCycle.myChair)?"res/Other/fonts/Tien vang-export.fnt":"res/Other/fonts/Tien bac-export.fnt";
        var moneyLb =  new cc.LabelBMFont(str,fontFile,0);
        moneyLb.setScale(.75);
        moneyLb.setPosition(pos);

        this.effectLayer.addChild(moneyLb);

        fishSp.runAction(cc.sequence(cc.spawn(new cc.EaseBackIn(cc.scaleTo(1,0)),cc.rotateBy(1,360)),cc.removeSelf()));
        moneyLb.setOpacity(50)
        moneyLb.runAction(cc.moveBy(1,cc.p(0,75)));
        moneyLb.runAction(cc.sequence(cc.fadeIn(.25),cc.delayTime(.5),cc.fadeOut(.25),cc.removeSelf()));
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
    createFish2D: function(type)
    {
        var obj = fishData.data["fish_X"+type];
        var sp = new cc.Sprite(obj["template_path"] +"00.png");
        var shader = cc.GLProgram.createWithFilenames("shaders/ccShader_PositionTextureColor_noMVP.vert","shaders/ccShader_PositionTextureColor_noMVP.frag");
        sp.setShaderProgram(shader);
        //sp.setScale(.5);

        var animation = new cc.Animation()
        for (var i = 1; i < obj["count"]; i++) {
            var frameName = obj["template_path"] + ((i < 10) ? ("0" + i) : i) + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.1);
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));
        //sp.setVisible(false);
        return sp;
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
            node.addChild(sp,0);
            sp.setPosition(data["shadow_offset"][0],data["shadow_offset"][1]);
            sp.setColor(cc.color(0,0,0));
            sp.setOpacity(100);
            //sp.setFlippedX(true);
        }
        var sp2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("fish_" +type +"_01.png"));
        sp2.runAction(cc.repeatForever(cc.animate(animation)));
        node.addChild(sp2,1);
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
    }


});
