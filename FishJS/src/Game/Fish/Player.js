/**
 * Created by admin on 9/4/18.
 */

var PlayerData = cc.Class.extend({
    ctor: function()
    {
        this.chair = -1;
        this.rawData = null;
    }
})

var HoldFishInfoWeb = cc.Class.extend({
    ctor: function(){
        this.prepare_hold = false;
        this.isHolding = false;
        this.fishForHold = null;
        this.player = null;
    },
    setIsHolding: function(hold){ this.isHolding = hold; },
    getIsHolding: function(){ return this.isHolding; },
    setPlayer: function(p){ this.player = p; },
    getPlayer: function(){ return this.player; },
    setFish: function(f){ this.fishForHold = f; },
    getFish: function(){ return this.fishForHold; }
})

var HoldFishInfo = cc.sys.isNative?engine.HoldFishInfo:HoldFishInfoWeb;

var MAX_SP_HOLD = 15;
var OFFSET_DEFAULT = 70;
var NodeDisplayHold = cc.Node.extend({
    ctor: function(){
        this._super();
        this.sprites = [];
        for(var i=0;i<MAX_SP_HOLD;i++){
            var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("IMG_LOCKFISH_CHAIN.png"));
            sp.setVisible(false);
            sp.setScale(1);
            this.addChild(sp);
            this.sprites.push(sp);
        }
        this.holdSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("hold_fish.png"));
        this.addChild(this.holdSprite,1);
        this.holdSprite.setScale(.35);
        this.holdSprite.setOpacity(200);
        this.holdSprite.setVisible(true);
    },
    setLength: function(length){
        this.setVisible(true);
        if(length <= 0)
        {
            this.setVisible(false);
            return;
        }
        this.holdSprite.setVisible(true);
        this.holdSprite.setPositionY(length);

        var offset = OFFSET_DEFAULT;
        if(length > OFFSET_DEFAULT * (MAX_SP_HOLD - 1)){
            offset = length / (MAX_SP_HOLD - 1);
        }
        this.sprites[0].setVisible(true);
        for(var i=1;i<this.sprites.length;i++){
            if(i * offset <= length){
                this.sprites[i].setVisible(true);
                this.sprites[i].setPositionY(i * offset);
            }
            else
                this.sprites[i].setVisible(false);
        }

    }
})

var Player = cc.Node.extend({
    ctor: function(panel,gameScene)
    {
        this._super();
        this.panel = panel;
        this.gameScene = gameScene;
        this.playerData = new PlayerData();
        this.panel.addNode(this);
        this.index = -1;


        var node = this.panel.getChildByName("node");
        if(!node)
            return;

        this.node = node;

        this.de_sung = node.getChildByName("sung");
        this.gun = this.de_sung.getChildByName("nong_sung");
        this.gun.origin_pos = this.gun.getPosition();
        this.duoi_sung = this.de_sung.getChildByName("duoi_sung");
        this.duoi_sung.origin_pos = this.duoi_sung.getPosition();
        this.fire_node = this.de_sung.getChildByName("fire");
        this.fire_real = this.de_sung.getChildByName("fire_real");

        this.ui = node.getChildByName("ui");

        var bg_thongtin = this.panel.getChildByName("bg_thongtin");
        // player info label
        this.lbName = bg_thongtin.getChildByName("username");
        this.lbMoney = bg_thongtin.getChildByName("lbMoney");

        this.bgThongTin = bg_thongtin;

        this.gunMoney = this.ui.getChildByName("money");
        this.btnPlus = this.ui.getChildByName("btnPlus");
        this.btnSub = this.ui.getChildByName("btnSub");

        this.txtWaiting = this.panel.getChildByName("waiting");

        this.txtWaiting.setOpacity(200);
        this.txtWaiting.runAction(cc.sequence(cc.fadeTo(1,100),cc.fadeTo(1,200)).repeatForever());


        this.holdFishInfo = new HoldFishInfo();
        this.holdFishInfo.setPlayer(this);
        this.nodeDisplayHold = new NodeDisplayHold();
        this.fire_real.addChild(this.nodeDisplayHold);

        this.nodeDisplayHold.setLength(0);

        this.isEnabled = false;

    },
    getChair: function()
    {
        return this.playerData.chair;
    },
    setChair: function(chair)
    {
        this.playerData.chair = chair;
    },
    setAngleForGun: function(screenPos)
    {
        var node_pos = screenPos;
        var gun_pos = this.fire_node.convertToWorldSpaceAR(cc.p(0,0));

        var vel = vec2(node_pos.x - gun_pos.x,node_pos.y - gun_pos.y);
        var angle = Math.RotationFromVel(vel);

        if(this.index >= 2)
            angle += 180;

        this.de_sung.setRotation(angle);

    },
    effectShoot: function()
    {
        this.gun.stopAllActions();
        this.duoi_sung.stopAllActions();

        this.duoi_sung.setPosition(this.duoi_sung.origin_pos);
        this.duoi_sung.runAction(cc.sequence(cc.moveBy(0.05,0,-5),cc.moveBy(0.05,0,5)))

        this.gun.setScale(.5);
        this.gun.runAction(cc.sequence(cc.scaleTo(0.05,.55,.15),cc.scaleTo(0.05,.55,.55)));
    },
    enable: function(bool)
    {
        this.panel.setVisible(true);
        this.isEnabled = bool;
        this.setIsMyPlayer(false);
        this.bgThongTin.setVisible(bool);
        this.gunMoney.setVisible(bool);
        this.node.setVisible(bool);
        this.txtWaiting.setVisible(!bool);

    },
    updateInfo: function()
    {
        this.lbName.setString(this.playerData.rawData["displayName"]);
        this.lbMoney.setString(BCStringUtility.standartNumber(this.playerData.rawData["gold"]) +"$");
    },
    setHold: function(fish){
        this.holdFishInfo.setIsHolding(true);
        this.holdFishInfo.setFish(fish);
    },
    releaseHold: function(){
        this.holdFishInfo.setIsHolding(false);
        this.nodeDisplayHold.setLength(0);
    },
    setIsMyPlayer: function(isMy){
        this.btnPlus.setVisible(isMy)
        this.btnSub.setVisible(isMy)
    },
    setGunBet: function(betGun,effect){
        this.gunMoney.setString(""+betGun);
        if(this.index == fishLifeCycle.myChair && effect)
        {
            this.gunMoney.setScale(3);
            this.gunMoney.runAction(cc.scaleTo(.25,1));
        }

    }


})