
var NotifyLayer = BCBaseLayer.extend({
    ctor: function () {
        this._super();

        this.initWithBinaryFile("res/GUI/NotifyLayer.json");
    },
    initGUI: function () {

        this.lbMessage = this.getControl("lbMessage");
        this.panel = this.getControl("Panel");
        this.panel.setVisible(false);


        var clipper = new cc.ClippingNode();
        clipper.tag = 0;
        clipper.width = this.panel.getContentSize().width;
        clipper.height = this.panel.getContentSize().height;
        clipper.anchorX = 0.5;
        clipper.anchorY = 0.5;
        clipper.setPosition(this.panel.getPosition());
        //clipper.runAction(cc.rotateBy(1, 45).repeatForever());
        this.addChild(clipper);

        var stencil = new cc.DrawNode();
        var rectangle = [cc.p(0, 0),cc.p(clipper.width, 0),
            cc.p(clipper.width, clipper.height),
            cc.p(0, clipper.height)];

        var white = cc.color(255, 255, 255, 255);
        stencil.drawPoly(rectangle, white, 1, white);
        clipper.stencil = stencil;


        this.lbMessage.retain();
        this.lbMessage.removeFromParent();
        this.lbMessage.x = clipper.width;
        this.lbMessage.y = clipper.height/2;

        clipper.addChild(this.lbMessage);

        this.clipper = clipper;


        this.isRunning = false;
        //gameData.pushNotify("Hello!In my game I have a very large game map. It is a ScrollView with content about 13 x device heights. The content node places inside of a Mask node with RECT clipping mode. I have noticed that my game map has very low fps, about 30.");
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
    },
    update: function (dt) {
        if(gameData.notifyData.length <= 0 || this.isRunning)
            return;

        var msg = gameData.notifyData[0] +"";
        gameData.notifyData.splice(0,1);
        this.lbMessage.setString(msg);
        var length = msg.length * 5 + this.clipper.width  ;
        var vel = 30;

        this.lbMessage.setPositionX( this.clipper.width );
        this.lbMessage.runAction(cc.sequence(cc.moveTo(length/vel,cc.p(-length,this.clipper.height/2)),cc.callFunc(function () {
            this.isRunning = false;

        }.bind(this))))
        this.isRunning = true;


    }

})

NotifyLayer.TAG = 1123;
NotifyLayer.ZORDER = 1000;
NotifyLayer.needNotify = function (msg,parent) {           // chi can su dung ham nay khi nhan goi tin la dc
    gameData.pushNotify(msg);
    gameData.pushNotify(msg);

    var main = bcSceneMgr.getMainLayer();
    if(parent)
        main = parent;
    var notify = main.getChildByTag(NotifyLayer.TAG);
    if(!notify)
    {
        notify = new NotifyLayer();
        main.addChild(notify,NotifyLayer.ZORDER,NotifyLayer.TAG);
    }

}