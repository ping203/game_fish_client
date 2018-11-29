/**
 * Created by admin on 9/3/18.
 */

var EntityWeb = cc.Class.extend({
    ctor: function()
    {
        this._body = null;
        this._userData = null;
        this.need_remove = false;
        this._type = -1;
        this._nodeDisplay = null;
        this._id = -1;
        this.released = false;
        this.contentSize  = cc.size(0,0);
    },
    update : function(dt)
    {

    },
    isNeedRemove: function(){
        return this.need_remove;
    },
    setPosition: function(x,y)
    {
        this._body.SetPosition(new b2Vec2(x,y));
    },
    setTransform: function(pos,angle)
    {
        if(this._body){
            this._body.SetPosition(pos);
            this._body.SetAngle(angle);
        }

    },
    getBodyVelocity: function()
    {
        return this._body.GetLinearVelocity();
    },
    getBodyPosition: function()
    {
        return this._body.GetPosition();
    },
    rotationFromVel : function(vel)
    {
        if(vel.y == 0)
        {
            return vel.x > 0?90:-90;
        }
        else if(vel.y > 0)
        {
            return Math.atan(vel.x / vel.y) * 180 / 3.14;
        }
        else
        {
            return Math.atan(vel.x / vel.y) * 180 / 3.14 + 180;
        }
    },
    setNodeDisplay: function(node)
    {
        this._nodeDisplay = node;
    },
    getNodeDisplay: function()
    {
        return this._nodeDisplay;
    },
    release : function()
    {
            // do nothing
    },
    getType: function()
    {
        return this._type;
    },
    setContentSize: function(size){
        this.contentSize = size;
    }
})

var EntityNative = (cc.sys.isNative?engine.Entity:cc.Node).extend({
    ctor: function()
    {
        this._super();
        //this.setUpdateFunc(this.update.bind(this));
    },
    update: function(dt)
    {

    }
})

var Entity = cc.sys.isNative?EntityNative:EntityWeb;

var WallWeb = EntityWeb.extend({
    ctor: function()
    {
        this._super();
        this._type = Entity.WALL;
        this._id = -9999;
    }
})

var FishCommonWeb = EntityWeb.extend({
    ctor: function()
    {
        this._super();
        this._type = Entity.FISH;
        this.paused = true;
        this.path = null;
        this.enable_auto_die = true;
        this.outsite = false;


        this.enable_flip = false;
        this.enable_check_outside = false;
        this.tmpFlipCheck = false;

    },
    startWithPath: function(path,timeElapsed)
    {
        this.path = path;
        this.paused = false;
        this.time = timeElapsed;
        this.path.setPathListener(this.onNewCurve.bind(this));

        this.update(0);

    },
    enableAutoDie: function(die)
    {
        this.enable_auto_die = die;
    },
    enableFlip: function(flip){
        this.enable_flip = flip;
    },
    enableCheckOutsite: function(check){
        this.enable_check_outside = check;
    },
    isOutsite: function () {
        return this.outsite;
    },
    onNewCurve: function(curve){
        if(!this.enable_flip || !this._nodeDisplay)
            return;
        //cc.log(curve);
        var offset = (curve.v3 || curve.v2 || curve.v1).x - curve.v0.x;

        var sp = this._nodeDisplay.getChildByTag(0);
        if(sp)
        {
            sp.setFlippedX(offset > 0);
        }

        sp = this._nodeDisplay.getChildByTag(1);
        if(sp)
        {
            sp.setFlippedX(offset > 0);
        }

    },
    update: function(dt)
    {
        if(this.paused)
            return;
        this.time += dt;
        if(this.time >= this.path.duration)
        {
            this.time = 0;
            if(this.enable_auto_die)
            {
                this.need_remove = true;
                this.released = true;
            }
        }
        var ret = {};
        ret.position = this.path.getPositionFromTime(this.time);
        ret.angle = this.path.getCurrentAngleRad();
        if(this._nodeDisplay)
        {
            this._nodeDisplay.setPosition(ret.position);
            this._nodeDisplay.setRotation(ret.angle * 180 / Math.PI);
        }

        var bodyPos = vec2(ret.position.x / PM_RATIO,ret.position.y / PM_RATIO);
        this.setTransform(bodyPos,-ret.angle);

        if(this.enable_check_outside)
        {
            var rect = cc.rect(-1.5,-1.5,WORLD_WIDTH + 3,WORLD_HEIGHT + 3);
            this.outsite = !cc.rectContainsPoint(rect,bodyPos);
        }
    }

})



var BulletWeb = Entity.extend({
    ctor: function(live)
    {
        this._super();
        this._type = Entity.BULLET;
        this.live = live;
        this.id = -9999;

        this.velLength = 0;

        this.holdInfo = null;
    },
    setVelLength: function(vv){
        this.velLength = vv;
    },
    update: function(dt)
    {
        var pos = this.getBodyPosition();

        if(this.holdInfo && this.holdInfo.isHolding){
            var fish_pos = this.holdInfo.fishForHold.getBodyPosition();

            var vel_dir = cc.p(fish_pos.x - pos.x,fish_pos.y - pos.y);
            var vel = new b2Vec2(vel_dir.x,vel_dir.y)
            vel.Normalize();
            vel.x *= this.velLength;
            vel.y *= this.velLength;

            this._body.SetLinearVelocity(vel);
        }

        if(this._nodeDisplay)
        {

            this._nodeDisplay.setPosition(pos.x * PM_RATIO,pos.y * PM_RATIO);
            this._nodeDisplay.setRotation(this.rotationFromVel(this.getBodyVelocity()))
        }
    },
    getLive: function()
    {
        return this.live;
    },
    setHoldInfo: function(hInfo){
        this.holdInfo = hInfo;
    },
    getHoldInfo: function(){
        return this.holdInfo;
    }

})

var Fish = cc.sys.isNative?engine.Fish:FishCommonWeb;
var Wall = cc.sys.isNative?engine.Wall:WallWeb;
var Bullet = cc.sys.isNative?engine.Bullet:BulletWeb;

Entity.FISH = 0;
Entity.WALL = 1;
Entity.BULLET = 2;