/**
 * Created by admin on 9/3/18.
 */

var WORLD_WIDTH = 40;
var WORLD_HEIGHT = 22.5;

var SettingWeb = cc.Class.extend({
    ctor: function()
    {
        this.world_size = vec2(WORLD_WIDTH,WORLD_HEIGHT);
        this.bullet_vel = 40;
        this.bullet_live = 10;

        this.using_constant_fps = false;
        this.FPS = 1.0 / 60;
        this.PM_RATIO = 32;

        this.gravity = vec2(0,0);

        this.game_width = this.world_size.x;
        this.game_height = this.world_size.y;
    }
})

var GameManagerWeb = cc.Class.extend({
    deltaTime: 1/60.0,
    accumulator: 0,
    ctor: function(setting)
    {
        this.gameLayer = null;
        this._entities = [];

        this.setting = setting;

        PM_RATIO = this.setting.PM_RATIO;

        this.initWorld();

        this._entityCollisionListener = null;
        this._contactPreSolveLitener = null;
        this._fishDestroyDelegate = null;

    },
    setEntityCollisionListener: function(_lis)
    {
        this._entityCollisionListener = _lis;
    },
    setOnContactPreSolve: function(lis){
        this._contactPreSolveLitener = lis;
    },
    setFishDestroyDelegate: function (lis) {
        this._fishDestroyDelegate = lis;
    },
    createWall: function()
    {
        var wallBodyDef = new b2BodyDef;
        wallBodyDef.type = b2Body.b2_staticBody;

        var wallFixtureDef = new b2FixtureDef;
        wallFixtureDef.density = 1.0;
        wallFixtureDef.friction = 0.0;
        wallFixtureDef.restitution = 1.0;
        wallFixtureDef.filter.categoryBits = BCGameManager.WALL_BIT;
        wallFixtureDef.filter.maskBits = BCGameManager.BULLET_BIT;
        this.wall = new Wall();

        this.wall._body = this._world.CreateBody(wallBodyDef);
        this.wall._body.SetUserData(this.wall);


        var bottom_shape = new b2PolygonShape;
        bottom_shape.SetAsEdge(new b2Vec2(0,0),new b2Vec2(this.setting.game_width,0));
        wallFixtureDef.shape = bottom_shape;
        this.wall._body.CreateFixture(wallFixtureDef);

        //
        var left_shape =  new b2PolygonShape;
        left_shape.SetAsEdge(new b2Vec2(0,0),new b2Vec2(0,this.setting.game_height));
        wallFixtureDef.shape = left_shape;
        this.wall._body.CreateFixture(wallFixtureDef);

        var right_shape = new b2PolygonShape;
        right_shape.SetAsEdge(new b2Vec2(this.setting.game_width,0),new b2Vec2(this.setting.game_width,this.setting.game_height));
        wallFixtureDef.shape = right_shape;
        this.wall._body.CreateFixture(wallFixtureDef);

        var top_shape =  new b2PolygonShape;
        top_shape.SetAsEdge(new b2Vec2(0,this.setting.game_height),new b2Vec2(this.setting.game_width,this.setting.game_height));
        wallFixtureDef.shape = top_shape;
        this.wall._body.CreateFixture(wallFixtureDef);


    },
    initWorld: function()
    {
        this._world = new b2World(new b2Vec2(this.setting.gravity.x,this.setting.gravity.y));


        var contactListener = new b2ContactListener;
        contactListener.BeginContact = this.BeginContact.bind(this);
        contactListener.PreSolve = this.PreSolve.bind(this);

        this._world.SetContactListener(contactListener);



        this.bulletBodyDef = new b2BodyDef;
        this.bulletBodyDef.type = b2Body.b2_dynamicBody;

        // body & fixture def for fish
        this.fishBodyDef = new b2BodyDef;
        this.fishBodyDef.type = b2Body.b2_kinematicBody;

        this.fishFixtureFef = new b2FixtureDef;
        this.fishFixtureFef.density = 1.0;
        this.fishFixtureFef.restitution = 1.0;
        this.fishFixtureFef.friction = 0.0;
        this.fishFixtureFef.filter.categoryBits = BCGameManager.FISH_BIT;
        this.fishFixtureFef.filter.maskBits = BCGameManager.BULLET_BIT;
        this.fishFixtureFef.shape = new b2PolygonShape;
        this.fishFixtureFef.shape.SetAsBox(0.5,1);


        this.createWall();

    },
    getFishByPos: function(screenPos){
        var ret = null;
        var listFishCheck = [];
        for(var i=0;i<this._entities.length;i++){
            if(this._entities[i]._type == Entity.FISH && this._entities[i]._nodeDisplay){
                var node = this._entities[i]._nodeDisplay;
                var convertPos = node.convertToNodeSpaceAR(screenPos);
                var data = fishData.data["fish_type_"+this._entities[i].fishType];
                var contentSize =cc.size(data["box"][0] * PM_RATIO * 2,data["box"][1] * PM_RATIO * 2);

                var rect_check = cc.rect(-contentSize.width/2,-contentSize.height/2,contentSize.width,contentSize.height);
                if(cc.rectContainsPoint(rect_check,convertPos)){
                    listFishCheck.push(this._entities[i]);
                }
            }
        }

        if(listFishCheck.length>0){
            listFishCheck.sort(function(a,b){
                return a._nodeDisplay.getLocalZOrder() < b._nodeDisplay.getLocalZOrder();
            })

            var test = [];
            for(var i=0;i<listFishCheck.length;i++){
                test.push(listFishCheck[i]._nodeDisplay.getLocalZOrder());
            }
            return listFishCheck[0];
        }
        return null;
    },
    update: function(dtt)
    {
        // cc.log(dtt);
        // var dt = dtt;
        // if(this.setting.using_constant_fps)
        //     dt = this.setting.FPS;
        if (dtt >= 0.1) {
            dtt = 0.1;
        }

        this.accumulator += dtt;

        while (this.accumulator >= this.deltaTime) {
            this._doUpdate(this.deltaTime);
            this.accumulator -= this.deltaTime;
        }
    },
    _doUpdate: function (dt) {
        var count = this._entities.length;
        while(count--)
        {
            this._entities[count].update(dt);
            if(this._entities[count].need_remove && this._entities[count]._type == Entity.FISH)
            {
                var fix = this._entities[count]._body.GetFixtureList();
                fix.m_filter.categoryBits = 0;
            }
        }
        this._world.Step(dt,8,3);

        // remove entity
        count = this._entities.length;
        while(count--)
        {
            if(this._entities[count].need_remove)
            {
                if(this._entities[count].getType() == Entity.FISH)
                {
                    this.onRealDestroyFish(this._entities[count]);
                }
                if(this._entities[count]._nodeDisplay)
                {
                    this._entities[count]._nodeDisplay.removeFromParent();
                }
                this._world.DestroyBody(this._entities[count]._body);
                this._entities.splice(count,1);
            }
        }
    },

    shootBullet: function(bullet,start_pos,vel_dir)
    {
        var vel = new b2Vec2(vel_dir.x,vel_dir.y)
        vel.Normalize();
        vel.x *= this.setting.bullet_vel;
        vel.y *= this.setting.bullet_vel;

        bullet.setPosition(start_pos.x,start_pos.y);
        bullet.setVelLength(this.setting.bullet_vel);
        bullet._body.SetLinearVelocity(vel);

        return bullet;

    },
    destroyEntity: function(entity)
    {
        entity.need_remove = true;
        entity.released = true;
    },
    onRealDestroyFish: function (fish) {
        if(this._fishDestroyDelegate != null)
        {
            this._fishDestroyDelegate(fish);
        }
    },
    destroyAllEntity: function(destroyNode){
        var count = this._entities.length;
        while(count--)
        {
            if(this._entities[count]._nodeDisplay)
            {
                if(destroyNode)
                    this._entities[count]._nodeDisplay.removeFromParent();
                else if(this._entities[count]._nodeDisplay.getChildByTag(0))
                {
                    this._entities[count]._nodeDisplay.getChildByTag(0).stopAllActions();
                    if(this._entities[count]._nodeDisplay.getChildByTag(1))
                        this._entities[count]._nodeDisplay.getChildByTag(1).stopAllActions();

                }
            }
            this._world.DestroyBody(this._entities[count]._body);
        }
        this._entities = [];
    },
    destroyWordl: function(){

    },

    BeginContact: function(contact)
    {
        if(!contact.IsTouching())
            return;
        var entityA = contact.GetFixtureA().GetBody().GetUserData();
        var entityB = contact.GetFixtureB().GetBody().GetUserData();

        if(entityA._type == Entity.BULLET && entityB._type == Entity.FISH)
        {
            if(contact.GetManifold().m_pointCount > 0)
            {
                if(this._entityCollisionListener && contact.GetManifold().m_pointCount > 0)
                {
                    var worldMani = new Box2D.Collision.b2WorldManifold;contact.GetWorldManifold(worldMani);
                    var pointCollide = vec2(worldMani.m_points[0].x,worldMani.m_points[0].y );
                    this._entityCollisionListener.call(this._entityCollisionListener,entityB,entityA,pointCollide);
                }
            }
        }
        else if(entityA._type == Entity.FISH && entityB._type == Entity.BULLET)
        {
            if(this._entityCollisionListener && contact.GetManifold().m_pointCount > 0)
            {
                var worldMani = new Box2D.Collision.b2WorldManifold;contact.GetWorldManifold(worldMani);
                var pointCollide = vec2(worldMani.m_points[0].x,worldMani.m_points[0].y );
                this._entityCollisionListener.call(this._entityCollisionListener,entityA,entityB,pointCollide);
            }
        }
        else if(entityA._type == Entity.WALL && entityB._type == Entity.BULLET)
        {
            entityB.live--;
            if(entityB.live < 0)
                entityB.need_remove = true;
        }
        else if(entityA._type == Entity.BULLET && entityB._type == Entity.WALL)
        {
            entityA.live--;
            if(entityA.live < 0)
                entityA.need_remove = true;
        }
    },
    PreSolve: function(contact,manifold)
    {
        if(!contact.IsTouching())
            return;

        var entityA = contact.GetFixtureA().GetBody().GetUserData();
        var entityB = contact.GetFixtureB().GetBody().GetUserData();

        if(this._contactPreSolveLitener != null){
            this._contactPreSolveLitener.call(this._contactPreSolveLitener,entityA,entityB,contact);
            return;
        }

        if(entityA._type == Entity.BULLET && entityB._type == Entity.FISH)
        {
            contact.SetEnabled(false);
        }
        else if(entityA._type == Entity.FISH && entityB._type == Entity.BULLET)
        {
            contact.SetEnabled(false);
        }
    },
    createBodyForBullet: function(bullet,body_box)
    {
        // body & fixture def for bullet
        var bulletFixtureFef = new b2FixtureDef;
        bulletFixtureFef.density = 1.0;
        bulletFixtureFef.restitution = 1.0;
        bulletFixtureFef.friction = 0.0;
        bulletFixtureFef.filter.categoryBits = BCGameManager.BULLET_BIT;
        bulletFixtureFef.filter.maskBits = BCGameManager.WALL_BIT | BCGameManager.FISH_BIT;
        bulletFixtureFef.shape = new b2PolygonShape;
        bulletFixtureFef.shape.SetAsBox(body_box.x,body_box.y);

        bullet._body = this._world.CreateBody(this.bulletBodyDef);
        bullet._body.CreateFixture(bulletFixtureFef);

        bullet._body.SetUserData(bullet);

        this._entities.push(bullet);

        return bullet;
    },
    createBodyForFish: function(fish,body_box)
    {
        var fishFixtureFef = new b2FixtureDef;
        fishFixtureFef.density = 1.0;
        fishFixtureFef.restitution = 1.0;
        fishFixtureFef.friction = 0.0;
        fishFixtureFef.filter.categoryBits = BCGameManager.FISH_BIT;
        fishFixtureFef.filter.maskBits = BCGameManager.BULLET_BIT;
        fishFixtureFef.shape = new b2PolygonShape;
        fishFixtureFef.shape.SetAsBox(body_box.x,body_box.y);

        this.fishBodyDef = new b2BodyDef;
        this.fishBodyDef.type = b2Body.b2_kinematicBody;

        fish._body = this._world.CreateBody(this.fishBodyDef);
        //cc.log("body null :" +(fish._body == null) + " def null :" + (this.fishBodyDef));
        fish._body.CreateFixture(fishFixtureFef);
        fish._body.SetUserData(fish);

        this._entities.push(fish);
        return fish;
    }


})

if (!Object.keys) {
    Object.keys = function (obj) {
        var arr = [],
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(key);
            }
        }
        return arr;
    };
}


var Setting = cc.sys.isNative?engine.Setting:SettingWeb;
var BCGameManager = (cc.sys.isNative?engine.GameManager:GameManagerWeb).extend({
    ctor: function(setting)
    {
        this._super(setting);
        this.fishEntities = {};
        this.state = BCGameManager.STATE_NORMAL_MAP;
    },
    saveFish: function(id,fish)
    {
        this.fishEntities[""+id] = fish;
    },
    getFishByID: function(id)
    {
        return this.fishEntities[""+id];
    },
    destroyEntity: function(entity)
    {
        this._super(entity);
        entity.released = true;
    },
    destroyFish: function (fish) {
        this.destroyEntity(fish);

    },
    removeFish: function (fish) {
        // cc.log("ahii--------------------------------------------------: " +Object.keys(this.fishEntities).length);
        delete this.fishEntities[""+fish.id];
    },
    clean:function () {
        this.fishEntities = {};
    }


});

BCGameManager.WALL_BIT = 0x0001;
BCGameManager.FISH_BIT = 0x0002;
BCGameManager.BULLET_BIT = 0x0004;

BCGameManager.STATE_NORMAL_MAP = 0;
BCGameManager.STATE_PREPARE = 1;
BCGameManager.STATE_MATRIX_MAP = 2;