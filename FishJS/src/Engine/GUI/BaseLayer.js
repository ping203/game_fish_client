/**
 * Created by HOANGNGUYEN on 7/20/2015.
 */
    
var engine = engine || {};
var ccui = ccui || {};
ccui.Helper = ccui.Helper || {};
ccui.Helper.seekWidgetByName = function(parent,name)
{
    return parent.getChildByName(name);
}

var BCBaseLayer  = cc.Layer.extend({
    
    ctor: function(id){
        cc.Layer.prototype.ctor.call(this);

        this._hasInit = false;

        this._id = id;
        this._layout = null;
        this._bg = null;
        this._layoutPath = "";
        this._scale = -1;
        this._scaleRealX = -1;
        this._scaleRealY = -1;

        this._layerGUI = null;
        this._aaPopup = false;

        this._showHideAnimate = false;
        this._bgShowHideAnimate = null;
        this._currentScaleBg = 1;

        this._enableBack = false;

        if(this._scale  < 0)
        {
            this._scale = cc.director.getWinSize().width/Constant.WIDTH;
            this._scale = (this._scale > 1) ? 1 : this._scale;
        }

        this._scaleRealX = cc.director.getWinSize().width/Constant.WIDTH;
        this._scaleRealY = cc.director.getWinSize().height/Constant.HEIGHT;

        this._layerColor = new cc.LayerColor(cc.BLACK);
        this.addChild(this._layerColor);
        this._layerColor.setVisible(false);
        this._layerColor.setOpacity(0);

        this._layerGUI = new cc.Layer();
        this._layerGUI.setLocalZOrder(999);
        this._layerGUI.setVisible(true);
        this.addChild(this._layerGUI);

        this._keyboardEvent = cc.EventListener.create({
            event:cc.EventListener.KEYBOARD,
            onKeyReleased:function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == 27){
                    event.getCurrentTarget().backKeyPress();
                }
            }
        });
        cc.eventManager.addListener(this._keyboardEvent, this);
    },

    onEnter: function(){
        cc.Layer.prototype.onEnter.call(this);

        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){return true;},
            onTouchMoved: function(touch,event){},
            onTouchEnded: function(touch,event){}
        });

        this.setContentSize(cc.winSize);
        this.setAnchorPoint(0.5,0.5);

        if(!this._hasInit)
        {
            this._hasInit = true;
            this.customizeGUI();
        }

        this.onEnterFinish();
        this.doEffect();
    },

    onExit : function () {
        cc.Layer.prototype.onExit.call(this);

        if(this._aaPopup && this._cachePopup)
        {
            this.retain();
        }
    },

    initWithJsonFile: function(json){
        this._layoutPath = json;
        var jsonLayout = ccs.load(json);
        this._layout = jsonLayout.node;
        this._layout.setContentSize(cc.director.getWinSize());
        ccui.Helper.doLayout(this._layout);
        this.addChild(this._layout);
        this.initGUI();
    },
    doEffect: function()
    {

    },

    initWithBinaryFile: function(json){
        cc.log("aaa");
        cc.log("LOAD JSON : " + json);

        var start = new Date().getTime();
        this._layoutPath = json;
        var jsonLayout = ccs.load(json);
        this._layout = jsonLayout.node;
        this._layout.setContentSize(cc.director.getWinSize());
        if(cc.sys.isNative)
            ccui.Helper.doLayout(this._layout);
        this.addChild(this._layout);

        var end = new Date().getTime();
        cc.log("## Time Load " + json + " : " + (end - start));

        this.initGUI();
        var end2 = new Date().getTime();
        cc.log("## Time Init " + json + " : " + (end2 - end));
    },

    setAsPopup : function (value,isCache) {
        this._aaPopup = value;
        this._cachePopup = isCache;

        if(value && this._layerGUI)
        {
            this._layerGUI.removeFromParent();
            this._layerGUI = null;
        }
    },

    customizeButton: function(name,tag,parent) {
        if(!this._layout)
            return;

        var button = null;
        if(parent)
        {
            button = this.getControl(name,parent);
        }
        else
        {
            button = this.getControl(name);
        }

        if(!button)
            return null;
        button.setPressedActionEnabled(true);
        button.setTag(tag);
        button.addTouchEventListener(this.onTouchEventHandler,this);

        return button;
    },
    
    customButton : function (name, tag, parent,action) {
        if(action === undefined)
            action = true;

        var btn = this.getControl(name,parent);
        if(!btn) return null;
        btn.setPressedActionEnabled(action);
        btn.setTag(tag);
        btn.addTouchEventListener(this.onTouchEventHandler,this);
        return btn;
    },

    setLabelText : function (text, control) {
        if(typeof  text === 'undefined') return;
        if(typeof  control === 'undefined') return;
        if(control == null) return;
        if(typeof  control.getString() === 'undefined') return;

        var str = control.getString();
        var l1 = str.length;
        var l2 = text.length;

        if(control.subText !== undefined)
        {
            l1 = control.subText;

            if(l2 <= l1)
            {
                control.setString(text);
            }
            else
            {
                control.setString(text.substring(0,l1-2) + "...");
            }
        }
        else if(control.wrapText !== undefined)
        {
            var s1 = control.width;
            var num = text.length;
            var str = "";
            var result = "";
            for(var i = 0 ; i < num ; i++)
            {
                str += text.charAt(i);
                result += text.charAt(i);
                control.setString(str);
                if(text.charAt(i) == " ")
                {
                    if(control.width > s1)
                    {
                        result += "\n";
                        str = "";
                    }
                }
            }
            control.setString(result);
        }
        else
        {
            control.setString(text);
        }
    },

    getControl : function (cName,parent) {
        var p = null;
        var sParent = "";
        if(typeof  parent === 'undefined')
        {
            p = this._layout;
            sParent = "layout";
        }
        else if(typeof parent === 'string')
        {
            p = ccui.Helper.seekWidgetByName(this._layout,parent);
            sParent = parent;
        }
        else
        {
            p = parent;
            sParent = "object";
        }

        if(p == null)
        {
            cc.log("###################### getControl error parent " + cName + "/" + sParent );
            return null;
        }
        var control = ccui.Helper.seekWidgetByName(p,cName);
        if(control == null)
        {
            cc.log("###################### getControl error control " + cName + "/" + sParent );
            return null;
        }
        this.analyzeCustomControl(control);
        return control;
    },

    processScaleControl : function (control,direct) {
        if(direct === undefined)
        {
            control.setScale(this._scale);
        }
        else if(direct == 1)
        {
            control.setScaleX(this._scale);
        }
        else
        {
            control.setScaleY(this._scale);
        }
    },

    analyzeCustomControl : function (control) {
        if(control.customData === undefined)
        {
            if(control.getTag() < 0) // scale theo ty le nho nhat
            {
                this.processScaleControl(control);
            }
            return;
        }

        var s = control.customData;

        if(s.indexOf("scale") > -1) // scale theo ty le nho nhat
        {
            if(s.indexOf("scaleX") > -1)
            {
                this.processScaleControl(control,1);
            }
            else if(s.indexOf("scaleY") > -1)
            {
                this.processScaleControl(control,0);
            }
            else
            {
                this.processScaleControl(control);
            }
        }

        if(s.indexOf("subText") > -1) // set text gioi han string
        {
            control["subText"] = control.getString().length;
        }

        if(s.indexOf("wrapText") > -1) // set text cat strign xuong dong
        {
            control["wrapText"] = control.getString().length;
        }
    },

    processListControl : function (name, num) {
        if(name === undefined || num === undefined) return;

        for(var i = 0 ; i < num ; i++)
        {
            this.getControl(name + i);
        }
    },

    setFog: function(bool,alpha){
        if(alpha === undefined) alpha = 150;
        this._layerColor.setVisible(true);
        cc.eventManager.addListener(this._listener,this);
        this._layerColor.runAction(cc.fadeTo(0.25,alpha));
    },

    enableFog : function() {
        this._fog = new cc.LayerColor(cc.BLACK);
        this._fog.setVisible(true);
        this.addChild(this._fog,-999);

        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){return true;},
            onTouchMoved: function(touch,event){},
            onTouchEnded: function(touch,event){}
        });

        cc.eventManager.addListener(this._listener,this);
        this._fog.runAction(cc.fadeTo(.25,150));
    },

    setDelayInit : function (time) {
        if(time === undefined)
            time = BCBaseLayer.TIME_APPEAR_GUI;
        if(time < BCBaseLayer.TIME_APPEAR_GUI)
            time = BCBaseLayer.TIME_APPEAR_GUI;

        this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(this.functionDelayInit,this)));
    },
    
    setShowHideAnimate : function (parent,customScale) {
        this._showHideAnimate = true;
        if(parent === undefined)
        {
            this._bgShowHideAnimate = this._layout;
        }
        else
        {
            this._bgShowHideAnimate = parent;
        }

        if(customScale === undefined)
        {
            customScale = false;
        }
        this._currentScaleBg = customScale?this._scale : 1;

        this._bgShowHideAnimate.setScale(0.75*this._currentScaleBg);
        this._bgShowHideAnimate.setOpacity(0);
        this._bgShowHideAnimate.runAction(cc.sequence(cc.spawn(new cc.EaseBackOut(cc.scaleTo(0.25,this._currentScaleBg)),cc.fadeIn(0.25)),cc.callFunc(this.finishAnimate,this)));

        if(this._layerColor)
        {
            this._layerColor.setVisible(true);
            this._layerColor.runAction(cc.fadeTo(0.25,150));
        }

        if(this._fog)
        {
            this._fog.setVisible(true);
            this._fog.runAction(cc.fadeTo(0.25,150));
        }
    },

    onClose : function () {
        if(this._layerColor && this._layerColor.isVisible())
            this._layerColor.runAction(cc.fadeTo(0.15,0));

        if(this._fog && this._fog.isVisible())
            this._fog.runAction(cc.fadeTo(0.15,0));

        if(this._showHideAnimate)
        {
            this._bgShowHideAnimate.setScale(this._currentScaleBg);
            this._bgShowHideAnimate.runAction(cc.spawn(cc.scaleTo(0.15,0.75),cc.fadeOut(0.15)));
            this.runAction(cc.sequence(cc.delayTime(0.15),cc.callFunc(this.onCloseDone.bind(this))));
        }
        else
        {
            this.onCloseDone();
        }
    },

    onCloseDone : function () {
        this.removeFromParent();
    },

    setBackEnable : function (enable) {
        this._enableBack = enable;
    },
    
    backKeyPress : function () {
        if(!this._enableBack) return;

        this.onBack();
    },

    checkGuiAvailable : function (tag,id) {
        if(tag === undefined) return false;
        var g = this.getChildByTag(tag);
        if(g !== undefined && g != null)
        {
            if(id === undefined) return true;
            if(g._id !== undefined && g._id == id) return true;
        }

        return false;
    },
    
    resetDefaultPosition : function (control) {
        if(control === undefined) return;

        try
        {
            if(control.defaultPos === undefined) control.defaultPos = control.getPosition();
            else control.setPosition(control.defaultPos);
        }
        catch(e)
        {

        }
    },

    /************ touch event handler *************/
    onTouchEventHandler: function(sender,type){
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                this.onButtonTouched(sender,sender.getTag());
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onButtonRelease(sender,sender.getTag());
                this.onButtonReleased(sender,sender.getTag());
                this.playSoundButton(sender.getTag());
                break;
        }
    },
    ////////////////////////////////////////////

    /******* functions need override  *******/
    customizeGUI: function(){
        /*    override meeeeeeeeee  */
    },

    onEnterFinish : function () {

    },

    onButtonRelease: function(button,id){
        /*    override meeeeeeeeee  */
    },
    onButtonReleased: function(button,id){
        /*    override meeeeeeeeee  */
    },

    onButtonTouched: function(button,id){
        /*    override meeeeeeeeee  */
    },

    onUpdateGUI: function(data){

    },

    initGUI : function () {

    },
    
    functionDelayInit : function () {

    },
    
    finishAnimate : function () {
    },
    
    onBack : function () {
        
    },

    playSoundButton: function(id){
        //if (gamedata.sound)
        //{
        //    cc.audioEngine.playEffect(lobby_sounds.click, false);
        //}
    }
    //////////////////////////////////////////////////////
});

/*
 * CREATE CONTROL
 */
BCBaseLayer.createLabelText = function (txt,color) {
    var ret = new ccui.Text();
    ret.setAnchorPoint(cc.p(0.5, 0.5));
    ret.setFontName("res/fonts/tahoma.ttf");
    ret.setFontSize(25);
    ret.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
    if(txt !== undefined) ret.setString(txt);
    //if(color !== undefined) ret.setColor(color);
    return ret;
};

BCBaseLayer.createEditBox = function (tf) {
    var ret = new cc.EditBox(tf.getContentSize(), new cc.Scale9Sprite());
    ret.setFontName(tf.getFontName());
    ret.setFontSize(tf.getFontSize());
    ret.setPlaceHolder(tf.getPlaceHolder());
    ret.setPlaceholderFontName(tf.getFontName());
    ret.setPlaceholderFontSize(tf.getFontSize());
    ret.setPosition(tf.getPosition());
    ret.setAnchorPoint(tf.getAnchorPoint());
    ret.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
    return ret;
};

BCBaseLayer.subLabelText = function (lb, str) {
    if(lb === undefined || lb == null) return;
    if(str === undefined || str == null) return;

    var lbStr = lb.getString();
    if("defaultString" in lb) lbStr = lb["defaultString"];

    var size = lbStr.length;
    if(str.length <= size)
    {
        lb.setString(str);
    }
    else
    {
        lb.setString(str.substring(0,size-2) + "...");
    }
};

BCBaseLayer.TIME_APPEAR_GUI = 0.35;

var RichLabelText = cc.Node.extend({

    ctor : function () {
        this._super();

        this.listText = [];
    },

    /**
     * Array RichText Object
     * Object :
     *  + text
     *  + color
     *  + font
     *  + size
     */
    setText : function (txts) {
        if(!txts) return;

        this.removeAllChildren();
        this.listText = [];

        for(var i = 0, size = txts.length ; i < size ; i++)
        {
            var info = txts[i];

            var lb = BCBaseLayer.createLabelText();
            if(info.font) lb.setFontName(info.font);
            if(info.size) lb.setFontSize(info.size);
            if(info.color) lb.setColor(info.color);
            if(info.text) lb.setString(info.text);
            lb.setAnchorPoint(cc.p(0,0));
            lb.textInfo = info;
            this.addChild(lb);
            this.listText.push(lb);
        }

        this.updatePosition();
    },

    updateText : function (idx, txt) {
        this.listText[idx].textInfo.text = txt;
        this.updatePosition();
    },

    updatePosition : function () {
        var nextWidth = 0;
        for(var i = 0, size = this.listText.length ; i < size ; i++)
        {
            var lb = this.listText[i];
            lb.setString(lb.textInfo.text);
            lb.setPositionX(nextWidth);

            nextWidth = lb.getContentSize().width + lb.getPositionX();
        }
    },

    getWidth : function () {
        var retVal = 0;
        for(var i = 0, size = this.listText.length ; i < size ; i++)
        {
            var lb = this.listText[i];
            retVal += lb.getContentSize().width;
        }

        return retVal;
    },

    getHeight : function () {
        var maxHeight = 0;
        for(var i = 0, size = this.listText.length ; i < size ; i++)
        {
            var lb = this.listText[i];
            if(maxHeight < lb.getContentSize().height)
                maxHeight = lb.getContentSize().height;
        }

        return maxHeight;
    }
});

