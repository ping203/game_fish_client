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
var __init = false;

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

var initManPortalEvent = function(){      // for update Man
    if(__init)
        return;
    this.customlistener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "updateMoney",
        callback: function(event){
            gameData.userData.vinMoney = event.currentMoney;
            var main = bcSceneMgr.getMainLayer();
            main.onUpdateData();
            //event.currentMoney Là tiền hiện tạ
        }});

    cc.eventManager.addListener(this.customlistener, 1);


    // init for mobile , quit game layer khi an dung
    if(cc.sys.isNative)
    {
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE,function () {
            var main = bcSceneMgr.getMainLayer();
            if(fishLifeCycle && !(main instanceof DemoScene))
            {
                fishBZ.sendQuit();
            }
        });
    }

    __init = true;

}

var updateManPortal = function(vinMoney)
{
    if(lobbyThanBien)
    {
        lobbyThanBien.updateVin(vinMoney);
    }
}

// Detect browser type (customized)
(function () {
    if (cc.sys.isNative) {
        return;
    }

    var win = window, nav = win.navigator;
    var ua = nav.userAgent.toLowerCase();

    cc.sys.browserType = cc.sys.BROWSER_TYPE_UNKNOWN;

    var typeReg1 = /micromessenger|mqqbrowser|sogou|qzone|liebao|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|msie|edge|miuibrowser/i;
    var typeReg2 = /qqbrowser|qq|chrome|safari|firefox|opr|oupeng|opera/i;
    var browserTypes = typeReg1.exec(ua);
    if(!browserTypes) browserTypes = typeReg2.exec(ua);
    var browserType = browserTypes ? browserTypes[0] : cc.sys.BROWSER_TYPE_UNKNOWN;
    if (browserType === 'micromessenger')
        browserType = cc.sys.BROWSER_TYPE_WECHAT;
    else if (browserType === "safari" && (cc.sys.os === cc.sys.OS_ANDROID))
        browserType = cc.sys.BROWSER_TYPE_ANDROID;
    else if (browserType === "trident" || browserType === "msie" || browserType === "edge")
        browserType = cc.sys.BROWSER_TYPE_IE;
    else if (browserType === "360 aphone")
        browserType = cc.sys.BROWSER_TYPE_360;
    else if (browserType === "mxbrowser")
        browserType = cc.sys.BROWSER_TYPE_MAXTHON;
    else if (browserType === "opr")
        browserType = cc.sys.BROWSER_TYPE_OPERA;

    cc.sys.browserType = browserType;
})();

var initWebWorker = function() {
    if (!webWorker) {
        var source = "var pause = true;\n" +
            "var interval = 1000/60.0;\n" +
            "\n" +
            "addEventListener('message', function (evt) {\n" +
            "    if (evt.data[0] == \"start\") {\n" +
            "        pause = false;\n" +
            "    } else if (evt.data[0] == \"pause\") {\n" +
            "        pause = true;\n" +
            "    }\n" +
            "}, false);\n" +
            "\n" +
            "function loop() {\n" +
            "    if (!pause) {\n" +
            "        postMessage(\"\");\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "setInterval(loop, interval);";
        var blob;
        try {
            blob = new Blob([source], {type: 'application/javascript'});
        } catch (e) { // Backwards-compatibility
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            blob = new BlobBuilder();
            blob.append(source);
            blob = blob.getBlob();
        }
        webWorker = new Worker(URL.createObjectURL(blob));
        webWorker.addEventListener('message', mainLoopForWebWorker);

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE,function () {
            cc.log("on game hide ----");
            if(!isWebWorkerRunning)
            {
                webWorker.postMessage(["start"]);
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
                webWorker.postMessage(["pause"]);
                isWebWorkerRunning = false;
                if(__funcForEvent)
                {
                    __funcForEvent.call(webWorker,cc.game.EVENT_SHOW);
                }
            }
        })
    }
}

var initSharedWorker = function () {
    initManPortalEvent();
    if(cc.sys.isNative)
        return;
    if (cc.sys.browserType == cc.sys.BROWSER_TYPE_CHROME || cc.sys.browserType == cc.sys.BROWSER_TYPE_FIREFOX) {
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
    } else {
        initWebWorker();
    }

}



