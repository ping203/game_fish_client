/**
 * Created by admin on 9/11/18.
 */

var BC = BC || {};

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

var box2D_init = function(){

}


var webWorker = null;
var isWebWorkerRunning = false;
var __funcForLoop = null;
var __funcForEvent = null;

var setFuncForLoopWebWorker = function (func) {
    __funcForLoop = func;
}

var setFuncForEvent = function (func) {
    __funcForEvent = func;
}


var mainLoopForWebWorker=  function () {
    if(__funcForLoop)
    {
        __funcForLoop.call(webWorker,1.0/60);
    }
}

var initSharedWorker = function () {
    if(cc.sys.isNative)
        return;
    if (!webWorker) {
        webWorker = new SharedWorker("SharedWebworker.js");
        webWorker.port.start();
        webWorker.port.addEventListener("message", mainLoopForWebWorker);

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE,function () {
            cc.log("on game hide ----");
            if(!isWebWorkerRunning)
            {
                webWorker.port.postMessage({type: "start"});
                isWebWorkerRunning = true;
                if(__funcForEvent)
                {
                    __funcForEvent.call(webWorker,cc.game.EVENT_HIDE);
                }
            }

        })

        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
            cc.log("on game show ----")
            if(isWebWorkerRunning)
            {
                webWorker.port.postMessage({type: "pause"});
                isWebWorkerRunning = false;
                if(__funcForEvent)
                {
                    __funcForEvent.call(webWorker,cc.game.EVENT_SHOW);
                }
            }
        })
    }
}

