/**
 * Created by HOANGNGUYEN on 7/20/2015.
 */

var BCBaseScene = cc.Scene.extend({

    ctor: function(){
        this._super();
    },

    onEnter : function () {
        cc.Scene.prototype.onEnter.call(this);
    },

    addChild: function(child,tag,oder){
        if(tag === undefined) tag = BCBaseScene.TAG_LAYER;
        if(oder === undefined) oder = BCBaseScene.TAG_LAYER;

        cc.Scene.prototype.addChild.call(this,child);
        child.setTag(tag);
        child.setLocalZOrder(oder);
        this.setContentSize(cc.winSize);
        this.setAnchorPoint(cc.p(0.5,0.5));
    },

    getMainLayer: function(){
        return this.getChildByTag(BCBaseScene.TAG_LAYER);
    },
    
    getLayerGUI : function () {
        return this.getChildByTag(BCBaseScene.TAG_GUI);
    }
});

BCBaseScene.TAG_LAYER = 101;
BCBaseScene.TAG_GUI = 102;

BCBaseScene.createWithLayer = function(layer){
    var scene = new BCBaseScene();
    scene.addChild(layer);
    return scene;
};

makeScene = function(layer){
    var scene = new BCBaseScene();
    scene.addChild(layer);
    return scene;
};