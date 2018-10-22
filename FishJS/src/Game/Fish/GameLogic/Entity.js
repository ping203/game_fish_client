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
    },
    update : function(dt)
    {

    },
    setPosition: function(x,y)
    {
        this._body.SetPosition(new b2Vec2(x,y));
    },
    setTransform: function(pos,angle)
    {
        this._body.SetPosition(pos);
        this._body.SetAngle(angle);
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

    },
    startWithPath: function(path,timeElapsed)
    {
        this.path = path;
        this.paused = false;
        this.time = timeElapsed;

    },
    enableAutoDie: function(die)
    {
        this.enable_auto_die = die;
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
                this.need_remove = true;
        }

        //var position = this.path.getPositionFromTime(this.time);
        //var angle = this.path.getCurrentAngle();
        //cc.log(JSON.stringify(position) + "    _" + angle);
        var ret = this.path.getPositionAndAngleFromTime(this.time);
        if(this._nodeDisplay)
        {
            this._nodeDisplay.setPosition(ret.position);
            this._nodeDisplay.setRotation(ret.angle);
        }
        this.setTransform(vec2(ret.position.x / PM_RATIO,ret.position.y / PM_RATIO),ret.angle);
    }

})



var BulletWeb = Entity.extend({
    ctor: function(live)
    {
        this._super();
        this._type = Entity.BULLET;
        this.live = live;
        this.id = -9999;

    },
    update: function(dt)
    {
        if(this._nodeDisplay)
        {
            var pos = this.getBodyPosition();
            this._nodeDisplay.setPosition(pos.x * PM_RATIO,pos.y * PM_RATIO);
            this._nodeDisplay.setRotation(this.rotationFromVel(this.getBodyVelocity()))
        }
    },
    getLive: function()
    {
        return this.live;
    }



})

var Fish = cc.sys.isNative?engine.Fish:FishCommonWeb;
var Wall = cc.sys.isNative?engine.Wall:WallWeb;
var Bullet = cc.sys.isNative?engine.Bullet:BulletWeb;

Entity.FISH = 0;
Entity.WALL = 1;
Entity.BULLET = 2;