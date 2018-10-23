/**
 * Created by admin on 9/11/18.
 */

var b2Vec2,b2BodyDef,b2Body,b2FixtureDef,b2World,b2PolygonShape,b2EdgeShape,b2Filter,b2ContactListener;
if(cc.sys.isNative)
{
    engine.Entity.extend = cc.Class.extend;
    //engine.GameListener.extend = cc.Class.extend;
    engine.GameManager.extend = cc.Class.extend;

}
else
{
    b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2World = Box2D.Dynamics.b2World
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
        , b2Filter = Box2D.Collision.b2FilterData
        , b2ContactListener = Box2D.Dynamics.b2ContactListener
    ;

}

