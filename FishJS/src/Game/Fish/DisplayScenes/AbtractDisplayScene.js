/**
 * Created by admin on 9/3/18.
 */

// Display Scene co the la 2D hoac 3D hoac ca 2

var cameraFlag = 2;

var AbtractDisplayScene = cc.Layer.extend({
    ctor: function()
    {
        this._super();
    },
})

var Display2DScene = AbtractDisplayScene.extend({
    ctor: function()
    {
        this._super();
    }
})

var Display3DScene = AbtractDisplayScene.extend({
    ctor: function()
    {
        this._super();

        return;

        this.mainCam = cc.Camera.createOrthographic(cc.winSize.width/8,cc.winSize.height/8,0.1,1000);
//        this.mainCam = cc.Camera.createPerspective(45,cc.winSize.width/cc.winSize.height,0.1,1000);
            this.mainCam.setPosition3D(vec3(0,100,0.00001));
        this.mainCam.lookAt(vec3(0,0,0));
        //this.mainCam.setDepth(4);
        this.mainCam.setCameraFlag(2);
        this.addChild(this.mainCam);

        this.setupLight();
        this.setupScene();
    },
    setupLight: function()
    {
        engine.GEnvironment.getInstance().setupLight(vec3(0,100,30),vec3(1.0,1.0,1.0),0.5,0.1);
        engine.GEnvironment.getInstance().setupCaustic("caustics.png");
    },
    setupScene: function()
    {
        var bg = new NodeBG();
        this.addChild(bg);
        //bg.setPosition3D(vec3(0,-20,0));
        bg.setRotation3D(vec3(-90,0,0));
          
          
                                                
    },
    createFish3D: function()
    {
        var fishPath = engine.GSprite3D.create("FishPath/Fish_Path1.c3b",false,false);
        fishPath.setCameraMask(2);
        this.addChild(fishPath);
        fishPath.setScale(.1);
        var anim = jsb.Animation3D.create("FishPath/Fish_Path1.c3b");
        var anim3D = jsb.Animate3D.create(anim);
        fishPath.runAction(cc.repeatForever(anim3D));
        fishPath.setPosition3D(vec3(-80,0,0))

        var fish = engine.GSprite3D.create("res/Fish3D/ca_duoi.c3b",false,true);
        fish.setCameraMask(cameraFlag);

        var anim = new jsb.Animation3D("res/Fish3D/ca_duoi.c3b");
        var anim3D = new jsb.Animate3D(anim);
        fish.runAction(cc.repeatForever(anim3D));

        fishPath.getAttachNode("Bone").addChild(fish);

        fish.camera = this.mainCam;
        fish.path = fishPath;

        return fish;
    }

})

var NodeBG = (cc.sys.isNative?jsb.Sprite3D:cc.Node).extend({
    ctor: function()
    {
        this._super();

        var sp_bg = new cc.Sprite("res/GUI/ScreenGame/Background/bg.jpg");
        sp_bg.setScale(.085);

        this.setCameraMask(cameraFlag);
        this.addChild(sp_bg);
        sp_bg.setCameraMask(2);


    }
})
