/*
 * SCENE MRG
 * - OpenGUI as Scene
 * - Loading Toast
 * - Dialog
 */
var BC_LOADING_TAG = 9998;
var BC_WAITING_TAG = 9997;

var TOAST_FLOAT_TAG = 99998;
var LOADING_FLOAT_TAG = 99999;

var BCSceneMgr = cc.Class.extend({

    ctor: function () {
        this.ccWhite = cc.color(203, 204, 206, 0);
        this.ccYellow = cc.color(251, 212, 93, 0);
        this.ccGreen = cc.color(9, 212, 9, 0);
        this.ccBlue = cc.color(132, 140, 220, 0);

        this.curGui = "";
        this.arGuis = {};
        this.arPopups = {};

        this.layerGUI = null;

        this.backScenes = [];       // queue scene back from other scene

        this.ignoreGuis = [];
    },

    getRunningScene: function () {
        var currentScene = cc.director.getRunningScene();
        return currentScene;
    },
    
    getMainLayer : function () {
        if(lobbyThanBien)
        {
            return lobbyThanBien.getChildByTag(BCBaseScene.TAG_LAYER);
        }
        var curScene = this.getRunningScene();
        if(curScene === undefined || curScene == null) return null;
        if(curScene instanceof cc.TransitionScene)
        {
            return (cc.sys.isNative?curScene.getInScene():curScene._inScene).getMainLayer();
        }
        else
        {
            return curScene.getMainLayer();
        }

    },

    checkMainLayer : function (layer) {
        return (this.getMainLayer() instanceof layer);
    },

    addLoading: function (text, fog) {
        var loading = this.layerGUI.getChildByTag(BC_LOADING_TAG);
        if (loading) {
            loading.stopAllActions();
            loading.removeFromParent();
        }

        var loading = new BCLoading(text, fog);
        this.layerGUI.addChild(loading);

        loading.setLocalZOrder(BC_LOADING_TAG);
        loading.setTag(BC_LOADING_TAG);
        return loading;
    },

    clearLoading: function () {

        var loading = this.layerGUI.getChildByTag(BC_LOADING_TAG);
        if (loading) {
            loading.stopAllActions();
            loading.removeFromParent();
        }
    },
    
    addWaiting : function () {
        var loading = this.layerGUI.getChildByTag(BC_WAITING_TAG);
        if (loading) {
            loading.stopAllActions();
            loading.removeFromParent();
        }

        var loading = new Waiting();
        this.layerGUI.addChild(loading);

        loading.setLocalZOrder(BC_WAITING_TAG);
        loading.setTag(BC_WAITING_TAG);
        return loading;
    },

    clearWaiting : function () {
        var loading = this.layerGUI.getChildByTag(BC_WAITING_TAG);
        if (loading) {
            loading.stopAllActions();
            loading.removeFromParent();
        }
    },
    updateCurrentGUI: function (data) {
        var gui = this.getRunningScene().getMainLayer();
        gui.onUpdateGUI(data);
    },

    // hungdd's function
    openWithScene: function (layer, callback, direct) {
        if(lobbyThanBien)
        {
            this.layerGUI = lobbyThanBien;
            lobbyThanBien.removeAllChildren();
            layer.setTag(BCBaseScene.TAG_LAYER);
            lobbyThanBien.addChild(layer);
            return;
        }
        var curLayer = null;

        if (layer instanceof  LoginScene) {
            this._isWaitingCallBack = false;
            this._waitingScene = "";
        }

        if (direct === undefined) {
            direct = false;
        }
        if (this._isWaitingCallBack && !direct) {
            curLayer = new window[this._waitingScene];

            this._isWaitingCallBack = false;
            this._waitingScene = "";
        }
        else {
            curLayer = layer;
        }

        if (callback !== undefined) {
            if (callback != "" || callback != null) {
                this._isWaitingCallBack = true;
                this._waitingScene = callback;
            }
        }

        var scene = new BCBaseScene();
        scene.addChild(curLayer);
        this.layerGUI = curLayer;

        cc.director.runScene(new cc.TransitionFade(BCBaseLayer.TIME_APPEAR_GUI, scene));
        //cc.director.runScene()
    },

    addQueueScene : function (layer) {
        for(var i = 0, size = this.backScenes.length ; i < size ; i ++ ) {
            if(this.backScenes[i] == layer) return;
        }

        this.backScenes.push(layer);

        cc.log("+++Add QueueScene : " + layer + " -> " + this.backScenes.join());
    },

    getQueueScene : function (direct) {
        if(direct) {
            this.backScenes = [];
        }

        if(this.backScenes.length <= 0) return null;

        var sIdx = this.backScenes.length - 1;
        var sLayer = this.backScenes[sIdx];
        this.backScenes.splice(sIdx,1);

        cc.log("+++Get QueueScene : " + sLayer + " -> " + this.backScenes.join());
        return sLayer;
    },
    loadScene: function(layer)
    {
        if(!(layer in this.arGuis))
        {
            var ll = new window[layer];
            ll.retain();
            this.arGuis[layer] = ll;
        }
    },

    openScene: function (layer, callback, direct) {
        cc.log("_________OPEN__SCENE___" + layer + "/" + this.curGui + " ++ " + callback + " , " + direct);

        CheckLogic.updateDesignSolution(layer);

        var isCallback = true;
        if (layer == LoginScene.className) {
            isCallback = false;
        }

        if (layer == this.curGui) {
            return;
        }

        if (this.layerGUI !== undefined && this.layerGUI && this.layerGUI.getParent()) {
            this.layerGUI.removeAllChildren();
            this.layerGUI.retain();
        }


        if(isCallback) {
            if (direct === undefined || direct == null) {
                direct = false;
            }

            var backLayer = this.getQueueScene(direct);
            if(backLayer) {
                layer = backLayer;
            }

            if(callback) {
                this.addQueueScene(callback);
            }
        }
        else {
            this.backScenes = [];
        }

        var curLayer = null;
        if (this.curGui in this.arGuis) {
            cc.log("____REMOVE___CUR__GUI___" + this.curGui);
            this.arGuis[this.curGui].retain();
        }

        this.curGui = layer;

        var isCache = true;
        for (var i = 0; i < this.ignoreGuis.length; i++) {
            if (this.ignoreGuis[i] == layer) {
                isCache = false;
                break;
            }
        }

        if (isCache) {
            if (layer in this.arGuis) {
                cc.log("____LOAD___CACHE___GUI__" + layer);
                curLayer = this.arGuis[layer];
            }
            else {
                cc.log("____CREATE___NEW___GUI__" + layer);
                curLayer = new window[layer];

                this.arGuis[layer] = curLayer;
            }
        }
        else {
            curLayer = new window[layer];
        }

        var scene = new BCBaseScene();
        scene.addChild(curLayer);
        cc.director.runScene(scene);

        return curLayer;
    },

    openGUI: function (slayer, zoder, tag, isCache) {

        if (slayer === undefined || slayer == "") return null;

        var layer = null;

        if (isCache === undefined) isCache = true;

        if (isCache) {
            if (slayer in this.arPopups) {
                cc.log("____LOAD___CACHE___POPUP__" + slayer);
                layer = this.arPopups[slayer];
            }
            else {
                cc.log("____CREATE___NEW___POPUP__WITH___CACHE__" + slayer);
                var _class = this.getClassGUI(slayer);
                layer = new window[_class];
                this.arPopups[slayer] = layer;
            }
        }
        else {
            cc.log("____CREATE___POPUP__NOT_CACHE___" + slayer);
            var _class = this.getClassGUI(slayer);
            layer = new window[_class];
        }

        if (layer !== undefined && layer != null) {
            if (layer.getParent()) {
                layer.removeFromParent();
            }
        }

        if (zoder === undefined) zoder = 1;
        if (tag === undefined) tag = 1;

        if (layer !== undefined && layer != null) {
            layer.setAsPopup(true,isCache);
            this.layerGUI.addChild(layer, zoder, tag);
        }
        return layer;
    },

    getClassGUI : function (cName) {
        if(cName === undefined || cName == null || cName == "")
            return cName;

        var cIdx = cName.indexOf("_");
        if(cIdx > -1)
        {
            cName = cName.substr(0,cIdx);
        }

        return cName;
    },

    getGUI : function (tag) {
        return this.layerGUI.getChildByTag(tag);
    },

    getGUIByClassName : function(classname){
        if (!classname) return null;
        if (classname in this.arPopups) return this.arPopups[classname];
        return null;
    },

    initialLayer: function () {
        cc.log("_______INITIAL____LAYER___GUI_____");

        if (this.layerGUI == null) {
            this.layerGUI = new cc.Layer();
        }
        else {
            if (this.layerGUI.getParent()) {
                cc.log("--->REMOVE___FROM____PARENT____");
                this.layerGUI.removeFromParent();
            }
        }

        this.getRunningScene().addChild(this.layerGUI, BCBaseScene.TAG_GUI, BCBaseScene.TAG_GUI);

        if(Config.ENABLE_CHEAT)
        {
            bcSceneMgr.openGUI(CheatCenterScene.className,CheatCenterScene.TAG,CheatCenterScene.TAG);
        }

        gamedata.onEnterScene();
    },

    updateScene: function (dt) {
        effectMgr.updateEffect(dt);
        gamedata.onUpdateScene(dt);
    },

    checkBackAvailable: function (ignores) {
        if (ignores === undefined) ignores = [];

        for (var s in this.arPopups) {
            var check = true;
            for (var i = 0; i < ignores.length; i++) {
                if (s == ignores[i]) {
                    check = false;
                    break;
                }
            }

            if (check) {
                var g = this.arPopups[s];
                if (g && g.getParent() && !(g instanceof  CheatCenterScene)) {
                    return true;
                }
            }
        }

        return false;
    },

    showOkCancelDialog: function (message, target, selector) {
        cc.log("#showOkCancelDialog : " + message);

        var dlg = this.openGUI(CheckLogic.getDialogClassName(), Dialog.ZODER, Dialog.TAG);
        dlg.setOkCancel(message, target, selector);
    },

    showOkDialogWithAction: function (message, target, selector) {
        cc.log("#showOkDialogWithAction : " + message);

        var dlg = this.openGUI(CheckLogic.getDialogClassName(), Dialog.ZODER, Dialog.TAG);
        dlg.setOkWithAction(message, target, selector);
    },

    showOKDialog: function (message) {
        cc.log("#showOKDialog : " + message);

        var dlg = this.openGUI(CheckLogic.getDialogClassName(), Dialog.ZODER, Dialog.TAG);
        dlg.setOKNotify(message);
    },

    showChangeGoldDialog: function (message, target, selector) {
        cc.log("#showChangeGoldDialog : " + message);

        var dlg = this.openGUI(CheckLogic.getDialogClassName(), Dialog.ZODER, Dialog.TAG);
        dlg.setChangeGold(message, target, selector);
    },

    showAddGDialog: function (message, target, selector) {
        cc.log("#showAddGDialog : " + message);

        var dlg = this.openGUI(CheckLogic.getDialogClassName(), Dialog.ZODER, Dialog.TAG);
        dlg.setAddG(message, target, selector);
    }
});

var BCLoading = cc.Layer.extend({

    ctor: function (text, fog) {

        this._layerColor = null;
        this._message = "";
        this._fog = true;
        this._super();
        if (text)
            this._message = text;
        if (fog != null) {
            this._fog = fog;
        }

    },

    timeout: function (time) {
        this.runAction(cc.sequence(cc.delayTime(time), cc.removeSelf()));
    },

    onEnter: function () {
        cc.Layer.prototype.onEnter.call(this);
        if (this._fog) {
            this._layerColor = new cc.LayerColor(cc.BLACK);
            this._layerColor.runAction(cc.fadeTo(.25, 150));
            this.addChild(this._layerColor);
        }

        var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("loadingCircle_01.png"));
        this.addChild(sp);
        sp.setPosition(cc.winSize.width/2,cc.winSize.height/2+ 10);
        var animation = new cc.Animation()

        for (var i = 1; i <= 10; i++) {
            var frameName = "loadingCircle_" + ((i<10)?"0"+i:i) + ".png";
            animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
        }
        animation.setDelayPerUnit(0.1);
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));



        var scale = cc.director.getWinSize().width / 800;
        scale = (scale > 1) ? 1 : scale;

        this._label = new ccui.Text();
        this._label.setAnchorPoint(cc.p(0.5, 0.5));
        this._label.setFontName("res/Lobby/Popup/Fonts/UTM Swiss Condensed.ttf");
        this._label.setFontSize(BCSceneMgr.FONT_SIZE_DEFAULT);
        this._label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._label.setColor(bcSceneMgr.ccWhite);
        this._label.setString(this._message);
        this._label.setScale(scale);
        this._label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 50);
        this.addChild(this._label);

        if (this._fog) {
            this._listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded
            });

            cc.eventManager.addListener(this._listener, this);
        }

    },

    remove: function () {
        if (this._layerColor) {
            this._layerColor.runAction(cc.fadeTo(0.2, 0));
        }
        this.runAction(cc.sequence(cc.delayTime(0.2), cc.removeSelf()));
    },

    onTouchBegan: function (touch, event) {
        return true;
    },

    onTouchMoved: function (touch, event) {

    },

    onTouchEnded: function (touch, event) {

    }
});

var Waiting = cc.Layer.extend({

    ctor: function () {

        this._layerColor = null;
        this._message = "";
        this._fog = true;
        this._super();
    },

    timeout: function (time) {
        this.runAction(cc.sequence(cc.delayTime(time), cc.removeSelf()));
    },

    onEnter: function () {
        cc.Layer.prototype.onEnter.call(this);

        this._layerColor = new cc.LayerColor(cc.BLACK);
        this._layerColor.runAction(cc.fadeTo(.25, 150));
        this.addChild(this._layerColor);

        var size = cc.director.getWinSize();
        var scale = size.width / 800;

        scale = (scale > 1) ? 1 : scale;

        this._sprite = new cc.Sprite("common/circlewait.png");
        this.addChild(this._sprite);
        this._sprite.runAction(cc.repeatForever(cc.rotateBy(1.2, 360)));
        this._sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this._sprite.setVisible(true);

        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });

        cc.eventManager.addListener(this._listener, this);
    },

    remove: function () {
        if (this._layerColor) {
            this._layerColor.runAction(cc.fadeTo(0.2, 0));
        }
        this.runAction(cc.sequence(cc.delayTime(0.2), cc.removeSelf()));
    },

    onTouchBegan: function (touch, event) {
        return true;
    },

    onTouchMoved: function (touch, event) {

    },

    onTouchEnded: function (touch, event) {

    }
});

BCSceneMgr.sharedInstance = null;
BCSceneMgr.firstInit = true;

BCSceneMgr.FONT_NORMAL = "res/Lobby/Popup/Fonts/UTM Swiss Condensed.ttf";
BCSceneMgr.FONT_BOLD = "res/Lobby/Popup/Fonts/UTM Swiss Condensed.ttf";
BCSceneMgr.FONT_SIZE_DEFAULT = 26;

BCSceneMgr.convertPosToParent = function (parent, target) {
    if(!parent || !target || !target.getParent()) return cc.p(0,0);
    return parent.convertToNodeSpace(target.getParent().convertToWorldSpace(target.getPosition()));
}

BCSceneMgr.getInstance = function () {
    if (BCSceneMgr.firstInit) {
        BCSceneMgr.sharedInstance = new BCSceneMgr();
        BCSceneMgr.firstInit = false;
    }
    return BCSceneMgr.sharedInstance;
}

var bcSceneMgr = BCSceneMgr.getInstance();

// BCToast on Top Screen
var BCToast = cc.Layer.extend({

    ctor: function(time,message){
        this._super();
        this._time = time;
        this._message = message;
        this._layerColor = new cc.LayerColor(cc.BLACK);
        this._layerColor.setOpacity(210);
        this.addChild(this._layerColor);
    },

    onEnter: function() {
        var scale = cc.director.getWinSize().width/Constant.WIDTH;
        scale = (scale > 1) ? 1 : scale;

        cc.Layer.prototype.onEnter.call(this);

        this._label = new ccui.Text();
        this._label.setAnchorPoint(cc.p(0.5,0.5));
        this._label.ignoreContentAdaptWithSize(false);

        this._label._customSize = true;
        //this._label._setWidth(cc.winSize.width * 0.5);

        //this._label._setBoundingWidth(cc.winSize.width * 0.5);
        //this._label.setLineBreakOnSpace(true);
        //this._label.setTextAreaSize(cc.size(cc.winSize.width * 0.5, 40));

        this._label.setFontName("res/Lobby/Popup/Fonts/UTM Swiss Condensed.ttf");
        this._label.setFontSize(BCSceneMgr.FONT_SIZE_DEFAULT);
        this._label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._label.setColor(bcSceneMgr.ccWhite);
        this._label.setString(this._message);
        this._label.setScale(scale);
        this._label._setWidth(cc.winSize.width * 0.9);
        this._label._setHeight(70);

        this._layerColor.addChild(this._label);
        this._layerColor.setPosition(0,0);

        this._label.setPosition(cc.winSize.width/2,this._label.getContentSize().height/4);
        this.setPosition(0,cc.winSize.height);

        this.runAction(cc.sequence(new cc.EaseBackOut(cc.moveBy(0.3,cc.p(0,-this._label.getContentSize().height))),
            cc.delayTime(this._time),
            new cc.EaseBackIn(cc.moveBy(0.3,cc.p(0,this._label.getContentSize().height/2))),cc.removeSelf()));
    }
});

BCToast.makeToast = function(time,message){
    var instance = new BCToast(time,message);
    bcSceneMgr.layerGUI.addChild(instance);
    instance.setLocalZOrder(BC_LOADING_TAG);
    return instance;
};

BCToast.SHORT = 1.0;
BCToast.LONG = 2.0;

// BCToast Float center scene
var ToastFloat = cc.Node.extend({

    ctor : function () {
        this._super();

        this.timeDelay = -1;
        this.isRunningDelay = false;

        this.lb = null;
        this.bg = null;

        this.bg = new cc.Scale9Sprite("common/9patch.png");
        this.addChild(this.bg);

        this._scale = cc.director.getWinSize().width/Constant.WIDTH;
        this._scale = (this._scale > 1) ? 1 : this._scale;
        this.setScale(this._scale);
    },

    onEnter : function () {
        cc.Layer.prototype.onEnter.call(this);

        this.bg.setOpacity(0);
        this.lb.setOpacity(0);

        this.bg.runAction(cc.fadeIn(0.5));
        this.lb.runAction(cc.fadeIn(0.5));

        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(this.finishEffect.bind(this))));
    },

    finishEffect : function () {
        this.isRunningDelay = true;
    },

    setToast : function (txt,time) {
        if(txt)
        {
            this.lb = BCBaseLayer.createLabelText(txt);
            this.lb.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.lb.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.lb.ignoreContentAdaptWithSize(false);
            this.addChild(this.lb);
            var winSize = cc.director.getWinSize();

            var lbSize = this.lb.getContentSize();
            var deltaWidth = winSize.width*BCToast.DELTA_WIDTH;
            if(lbSize.width > deltaWidth)
            {

                this.lb.setContentSize(cc.size(deltaWidth,lbSize.height*2));
            }

            this.bg.setContentSize(this.lb.getContentSize().width + ToastFloat.PAD_SIZE,this.lb.getContentSize().height + ToastFloat.PAD_SIZE);
        }

        if(time === undefined || time == null) time = ToastFloat.SHORT;
        this.timeDelay = time;
        this.scheduleUpdate();
    },

    clearToast : function () {
        this.bg.runAction(cc.fadeOut(0.5));
        this.lb.runAction(cc.fadeOut(0.5));

        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(this.removeFromParent.bind(this))));
    },

    update : function (dt) {
        if(this.timeDelay > 0 && this.isRunningDelay)
        {
            this.timeDelay -= dt;
            if(this.timeDelay <= 0)
            {
                this.clearToast();
            }
        }
    }
});

ToastFloat.makeToast = function (time, text) {
    var toast = new ToastFloat();
    toast.setToast(text,time);
    var winSize = cc.director.getWinSize();
    toast.setPosition(winSize.width/2,winSize.height*ToastFloat.POSITION_Y);

    bcSceneMgr.layerGUI.addChild(toast);
    toast.setLocalZOrder(TOAST_FLOAT_TAG);
};

ToastFloat.SHORT = 1.0;
ToastFloat.LONG  = 3.0;
ToastFloat.MEDIUM = 2.0;

ToastFloat.POSITION_Y = 1/3;
ToastFloat.DELTA_WIDTH = 0.8;
ToastFloat.PAD_SIZE = 35;

// Loading Float center scene
var LoadingFloat = cc.Node.extend({

    ctor : function () {
        this._super();

        this.img = null;
        this.fog = null;
        this._listener = null;
        this.lb = null;

        this.funcTimeOut = null;

        // init
        this.img = cc.Sprite.create("common/circlewait.png");
        this.img.setPositionY(this.img.getContentSize().height/2);
        this.addChild(this.img);

        // set default
        var wSize = cc.director.getWinSize();
        this.setPosition(wSize.width/2,wSize.height/2);
    },

    onExit : function () {
        LoadingFloat.instance = null;

        cc.Node.prototype.onExit.call(this);
    },

    setText : function (text,fog) {
        var wSize = cc.director.getWinSize();

        this.img.cleanup();
        this.img.runAction(cc.repeatForever(cc.rotateBy(0.01,5)));
        this.scheduleUpdate();

        if(text)
        {
            this.lb = BCBaseLayer.createLabelText(text);
            this.lb.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.lb.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.lb.setPositionY(this.img.getPositionY() - this.img.getContentSize().height);
            this.addChild(this.lb);
        }

        if(fog)
        {
            this.fog = new cc.LayerColor(cc.BLACK);
            this.fog.setVisible(true);
            this.fog.setPosition(-wSize.width/2,-wSize.height/2);
            this.addChild(this.fog,-1);

            this._listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch,event){return true;},
                onTouchMoved: function(touch,event){},
                onTouchEnded: function(touch,event){}
            });

            cc.eventManager.addListener(this._listener,this);
            this.fog.setOpacity(150);
        }
        else
        {
            if(this.fog) this.fog.removeFromParent();
            if(this._listener) cc.eventManager.removeListener(this._listener);

            this.fog = null;
            this._listener = null;
        }
    },

    setTimeOut : function (t,func) {
        this.timeOutDelay = t;
        this.funcTimeOut = func;
    },

    finishLoading : function () {
        if(this.funcTimeOut)
        {
            this.funcTimeOut();
        }

        if(this.fog) this.fog.removeFromParent();
        if(this._listener) cc.eventManager.removeListener(this._listener);
        this.fog = null;
        this._listener = null;

        LoadingFloat.instance.removeFromParent();
    },

    update : function (dt) {
        if(this.timeOutDelay !== undefined && this.timeOutDelay != null && this.timeOutDelay > 0)
        {
            this.timeOutDelay -= dt;
            if(this.timeOutDelay <= 0)
            {
                this.finishLoading();
            }
        }
    }
});

LoadingFloat.instance = null;

LoadingFloat.makeLoading = function (txt,fog,timeout,callback) {
    if(LoadingFloat.instance)
    {
        LoadingFloat.instance.removeFromParent();
        LoadingFloat.instance = null;
    }

    if(LoadingFloat.instance == null)
    {
        LoadingFloat.instance = new LoadingFloat();

        bcSceneMgr.layerGUI.addChild(LoadingFloat.instance);
        LoadingFloat.instance.setLocalZOrder(LOADING_FLOAT_TAG);
    }

    LoadingFloat.instance.setVisible(true);
    LoadingFloat.instance.setText(txt,fog);
    LoadingFloat.instance.setTimeOut(timeout,callback);

};

LoadingFloat.clearLoading = function () {
    if(LoadingFloat.instance && LoadingFloat.instance.getParent())
    {
        LoadingFloat.instance.removeFromParent();
        LoadingFloat.instance = null;
    }
};


// effect
var EffectMgr = cc.Class.extend({

    ctor: function () {
        this.arLbPoints = [];   // array of label effect change value point
    },

    runLabelPoint: function (label, cur, des, delayTime, numChange) {
        numChange = numChange || 50;
        delayTime = delayTime || 0;
        var lb = null;
        var isNew = true;
        for (var i = 0, size = this.arLbPoints.length; i < size; i++) {
            if (this.arLbPoints[i] == label) {
                lb = label;
                isNew = false;
                break;
            }
        }

        if(isNew) {
            lb = label;
        }

        lb.cur = cur;
        lb.des = des;
        lb.delta = parseInt((des - cur) / numChange);
        lb.delay = delayTime;
        lb.setString(BCStringUtility.pointNumber(lb.cur));
        if(isNew)
            this.arLbPoints.push(lb);
    },

    flyCoinEffect: function (parent, gold, ratio, pStart, pEnd, fGoldDone, checkTime) {
        if (!parent) return 0;

        ratio = ratio || 100000; // default 100K gold
        var num = Math.floor(gold / ratio);
        if (num < 1) num = 1;
        var goldReturn = Math.floor(gold / num);

        var timeMove = 1.5;
        var dTime = 0.5;
        var timeHide = 0.25;
        var timeShow = 0.15;

        if (checkTime) {
            return timeMove + timeHide + dTime + timeShow;
        }

        var winSize = cc.director.getWinSize();
        var rangeX = [-50, 50];
        var rangeY = [-50, 50];

        num = (num < 10) ? num : (10 + parseInt(num / 5));
        num = (num < 200) ? num : 200;

        for (var i = 0; i < num; i++) {
            var sp = new CoinEffect();
            sp.start();

            // random pos start
            var rndX = Math.random() * (rangeX[1] - rangeX[0]) + rangeX[0];
            var rndY = Math.random() * (rangeY[1] - rangeY[0]) + rangeY[0];

            var rndRotate = -(Math.random() * 360);

            var pCX = Math.random() * winSize.width;
            var pCY = Math.random() * winSize.height;

            var posStart = cc.p(pStart.x + rndX, pStart.y + rndY);
            var posCenter = cc.p(pCX, pCY);

            var actShow = new cc.EaseBackOut(cc.scaleTo(timeShow, 0.4));
            var actMove = new cc.EaseSineOut(cc.BezierTo.create(timeMove, [posStart, posCenter, pEnd]));
            var actHide = cc.spawn(new cc.EaseBackIn(cc.scaleTo(timeHide, 0)), cc.fadeOut(timeHide));
            sp.setPosition(posStart);
            sp.setRotation(rndRotate);
            parent.addChild(sp);
            sp.setScale(0);

            sp.runAction(cc.sequence(cc.delayTime(Math.random() * dTime),
                actShow,
                cc.spawn(actMove,
                    cc.sequence(cc.delayTime(1.5 * Math.random()), cc.callFunc(function () {
                        if (gamedata.sound) {
                            var rnd = parseInt(Math.random() * 10) % 3 + 1;
                            cc.audioEngine.playEffect(lobby_sounds["coin" + rnd], false);
                        }
                    }))), cc.callFunc(function () {
                    if (fGoldDone) fGoldDone.apply(this, arguments);
                }.bind(this, goldReturn)), actHide));
        }
        return (timeMove + timeHide + dTime + timeShow);
    },

    dropCoinEffect: function (parent, gold, pos, type, func) {
        pos = pos || cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        type = type || CoinEffect.TYPE_FLOW;

        //var scale = cc.director.getWinSize().width/Constant.WIDTH;
        //scale = (scale > 1) ? 1 : scale;

        var eff = new CoinEffectLayer();
        eff.setPositionCoin(pos);
        eff.startEffect(gold, type);
        eff.setCallbackFinish(func);
        //eff.setScale(scale);
        parent.addChild(eff);
    },

    updateEffect: function (dt) {
        for (var i = this.arLbPoints.length - 1; i >= 0; i--) {
            try {
                var lb = this.arLbPoints[i];
                if (lb.delay > 0) {
                    lb.delay -= dt;
                    continue;
                }

                lb.cur += lb.delta;
                lb.setString(BCStringUtility.pointNumber(lb.cur));
                if (lb.cur > lb.des) {
                    lb.setString(BCStringUtility.pointNumber(lb.des));
                    this.arLbPoints.splice(i, 1);
                }
            }
            catch (e) {
                this.arLbPoints.splice(i, 1);
            }
        }
    },
});

EffectMgr._inst = null;

EffectMgr.getInstance = function () {
    if (!EffectMgr._inst) {
        EffectMgr._inst = new EffectMgr();
    }
    return EffectMgr._inst;
};

effectMgr = EffectMgr.getInstance();

// Coin Effect
var CoinEffectLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.listCoin = [];
        this.numEffect = 0;
        this.numCoinNow = 0;
        this.callBack = null;
        this.timeCount = 0;
        this.positionCoin = [0, 0];
        this.isRun = false;
        this.typeEffect = 0;
    },

    setCallbackFinish: function (cb) {
        this.callBack = cb;
    },

    setPositionCoin: function (p) {
        this.positionCoin = p;
    },

    update: function (dt) {
        var coin;
        var isFinish = false;
        for (var i = this.numCoinNow; i < this.numEffect; i++) {
            coin = this.listCoin[i];
            if (coin.visible) {
                coin.updateCoin(dt);
                isFinish = true;
            }
        }
        if (this.numCoinNow > 0) {
            this.timeCount += dt;
            if (this.timeCount >= CoinEffect.TIME_OUT_COIN) {
                var num = 10;
                if (this.typeEffect == CoinEffect.TYPE_FLOW) {
                    num = CoinEffect.NUM_COIN_EACH_TIME * this.timeCount;
                    this.timeCount = 0;
                }
                else if (this.typeEffect == CoinEffect.TYPE_RAIN) {
                    num = CoinEffect.NUM_COIN_RATE_RAIN * 0.05;
                    this.timeCount = CoinEffect.TIME_OUT_COIN - 0.05;
                }
                for (i = 0; i < num; i++) {
                    coin = this.listCoin[this.numCoinNow--];
                    coin.start();
                    if (this.numCoinNow == 0)break;
                }
            }
        }
        else {
            if (!isFinish) {
                this.unscheduleUpdate();
                if (this.callBack) {
                    this.callBack.call();
                }
                this.isRun = false;
            }
        }
    },

    startEffect: function (numEffect, type) {
        if (this.isRun)this.stopEffect();
        var coin;
        this.typeEffect = type;
        this.numEffect = numEffect;
        if (numEffect > this.listCoin.length) {
            for (var i = 0, len = numEffect - this.listCoin.length; i < len; i++) {
                coin = this.getCoinItem();
                this.listCoin.push(coin);
                this.addChild(coin);
            }
        }
        for (var i = 0; i < numEffect; i++) {
            coin = this.listCoin[i];
            coin.stop();
            coin.initCoin(type);
        }
        this.numCoinNow = numEffect - 1;
        this.timeCount = 0;
        this.scheduleUpdate();
        this.setVisible(true);
        this.isRun = true;
        this.runAction(cc.sequence(cc.delayTime(CoinEffect.DELAY_PLAY_SOUND), cc.callFunc(function () {
            if (gamedata.sound) {
                cc.audioEngine.playEffect(lobby_sounds.coinFall, false);
            }
        })));
    },

    stopEffect: function () {
        for (var i = 0; i < this.listCoin.length; i++) {
            this.listCoin[i].setVisible(false);
        }
    },

    getCoinItem: function () {
        return new CoinEffect();
    }
});

var CoinEffect = cc.Sprite.extend({

    ctor: function () {
        this._super();
        var animation = cc.animationCache.getAnimation("gold");
        if (!animation) {
            var arr = [];
            var cache = cc.spriteFrameCache;
            var aniFrame;
            for (var i = 0; i < CoinEffect.NUM_SPRITE_ANIMATION_COIN; i++) {
                aniFrame = new cc.AnimationFrame(cache.getSpriteFrame(CoinEffect.NAME_ANIMATION_COIN + i + ".png"), CoinEffect.TIME_ANIMATION_COIN);
                arr.push(aniFrame);
            }
            for (i = CoinEffect.NUM_SPRITE_ANIMATION_COIN - 2; i >= 1; i--) {
                aniFrame = new cc.AnimationFrame(cache.getSpriteFrame(CoinEffect.NAME_ANIMATION_COIN + i + ".png"), CoinEffect.TIME_ANIMATION_COIN);
                arr.push(aniFrame);
            }
            animation = new cc.Animation(arr, CoinEffect.TIME_ANIMATION_COIN);
            cc.animationCache.addAnimation(animation, CoinEffect.NAME_ANIMATION_COIN);
        }
        this.anim = animation;
        this.setVisible(false);
    },

    initCoin: function (type) {
        this.isCollided = false; //kiem tra da cham dat 1 lan chua
        this.opacity = 0;
        var valueRan;
        if (type == CoinEffect.TYPE_FLOW) {
            this.speedX = 2 * Math.random() * CoinEffect.RATE_SPEED_X - CoinEffect.RATE_SPEED_X;
            //this.speedY = Math.random() * CoinEffect.RATE_SPEED_Y + CoinEffect.DEFAULT_SPEED_Y;
            var def = Math.random() * 800 + 800;
            this.speedY = Math.sqrt(def * def - this.speedX * this.speedX);
            this.speedR = 2 * Math.random() * CoinEffect.RATE_SPEED_R - CoinEffect.RATE_SPEED_R;
            valueRan = Math.random() * (CoinEffect.MAX_SCALE - CoinEffect.MIN_SCALE) + CoinEffect.MIN_SCALE;
            this.setScale(valueRan, valueRan);
            this.setRotation(Math.random() * 360);
            var p = cc.p(this.getParent().positionCoin.x + (Math.random() - 0.5) * CoinEffect.RATE_Position_X,
                this.getParent().positionCoin.y + (Math.random() - 0.5) * CoinEffect.RATE_Position_Y);
            this.setPosition(p);
        }
        else if (type == CoinEffect.TYPE_RAIN) {
            this.speedX = 0;
            this.speedY = Math.random() * CoinEffect.RATE_SPEED_X;
            this.speedR = 2 * Math.random() * CoinEffect.RATE_SPEED_R - CoinEffect.RATE_SPEED_R;
            valueRan = Math.random() * (CoinEffect.MAX_SCALE - CoinEffect.MIN_SCALE) + CoinEffect.MIN_SCALE;
            this.setScale(valueRan, valueRan);
            this.setRotation(Math.random() * 360);
            var parent = this.getParent();
            this.setPosition(Math.random() * parent.width, parent.height + this.height + Math.random() * CoinEffect.RATE_Position_Y);
        }
        this.setVisible(false);
    },

    start: function () {
        this.setVisible(true);
        var ani = cc.animate(this.anim);
        //ani.setSpeed(Math.random() * 0.5 + 0.5);
        this.runAction(ani.repeatForever());
    },

    stop: function () {
        this.setVisible(false);
        this.stopAllActions();
    },

    updateCoin: function (dt) {
        var opa = this.opacity;
        opa += 1500 * dt;
        if (opa > 255)this.opacity = 255;
        else this.opacity = opa;
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
        this.speedY -= CoinEffect.GRAVITY * dt;
        this.rotation += this.speedR;
        //cham dat thi cho nhay len 1 lan roi roi tiep
        if (this.y < this.getContentSize().height / 2 && !this.isCollided) {
            this.isCollided = true;
            this.speedY = -this.speedY * (Math.random() * CoinEffect.RATE_JUMP_BACK);
            this.speedX = 0;
        }
        else if (this.y + (this.height * this.scale) < 0 && this.isCollided) {
            this.stop();
        }
    }
});

CoinEffect.RATE_SPEED_Y = 600;
CoinEffect.DEFAULT_SPEED_Y = 850;
CoinEffect.RATE_SPEED_X = 350;
CoinEffect.RATE_SPEED_R = 10;
CoinEffect.RATE_Position_X = 70;
CoinEffect.RATE_Position_Y = 70;
CoinEffect.MIN_SCALE = 0.32;
CoinEffect.MAX_SCALE = 0.42;
CoinEffect.RATE_JUMP_BACK = 0.5;
CoinEffect.GRAVITY = 2300;
CoinEffect.POSI = 90;
CoinEffect.NAME_ANIMATION_COIN = "gold";
CoinEffect.NUM_SPRITE_ANIMATION_COIN = 5;
CoinEffect.NUM_COIN_EACH_TIME = 100;
CoinEffect.NUM_COIN_RATE_RAIN = 100;
CoinEffect.TIME_ANIMATION_COIN = 0.3;
CoinEffect.TIME_OUT_COIN = 0.05;
CoinEffect.TYPE_FLOW = 0;
CoinEffect.TYPE_RAIN = 1;
CoinEffect.DELAY_PLAY_SOUND = 0.3;