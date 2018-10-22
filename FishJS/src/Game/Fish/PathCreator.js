/**
 * Created by admin on 9/6/18.
 */

var PathCreator = BaseLayer.extend({
    ctor: function () {
        this._super();
        this.initWithBinaryFile("res/GUI/CreatePathScene.json");
    },
    initGUI: function () {
        this.obj = {};
        this.count = 1;

        this.customizeButton("Add",1);
        this.customizeButton("Log",2);
        this.customizeButton("Print",3);
        this.customizeButton("Clear",4);
        this.customizeButton("Rand",5);




        var sp = this.createFishAnim(21);
        this.addChild(sp,10);
        sp.setPosition(400,400);
        sp.setScale(2);


        var shader = cc.GLProgram.createWithFilenames("shaders/ccShader_PositionTextureColor_noMVP.vert","shaders/ccShader_PositionTextureColor_noMVP.frag");
        cc.log(shader);

        //sp.setShaderProgram(shader);



        this.dataPaths = [];

        this.layerTest = new cc.Layer();
        this.addChild(this.layerTest,2);

        this.gameMgr = new GameManager(new Setting());
        this.gameMgr._displayLayer = this.layerTest;


        this.addPoint = true;
        this.count = 0;
        this.needRand = false;

    },
    addPath: function (datas) {
        this.obj["P_" + (this.count++)] = {};
        this.obj["P_" + (this.count-1)]["data"] = datas;
    },
    log: function () {
        cc.log(JSON.stringify(this.obj));
    },
    onEnter: function () {
        this._super();
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });

        cc.eventManager.addListener(this._listener, this);



        this.scheduleUpdate();
    },
    onTouchBegan: function (touch, event) {

        var pos = touch.getLocation();
        pos = this.convertToNodeSpace(pos);
        if(this.addPoint)
        {



            this.currentPoint = vec2(pos.x / PM_RATIO,pos.y / PM_RATIO);

            this.dataPaths.push(this.currentPoint);

            var hi = new cc.Sprite("res/HelloWorld.png");
            this.layerTest.addChild(hi);
            hi.setScale(.2);
            hi.setPosition(pos);

            this.count = 0;

            if(this.needRand)
                this.addPoint = false;
        }
        else
        {
            this.count++;
            if(this.count >=2)
                this.addPoint = true;


            var hi = new cc.Sprite("res/Fish3D/bach_tuoc_texture_low.png");
            this.layerTest.addChild(hi);
            hi.setScale(.2);
            hi.setPosition(pos);


            if(this.count == 1)
                this.currentPoint["r_1"] = vec2(pos.x / PM_RATIO,pos.y / PM_RATIO);
            else if(this.count == 2)
                this.currentPoint["r_2"] = vec2(pos.x / PM_RATIO,pos.y / PM_RATIO);

        }



        return true;
    },
    update: function(dt)
    {
        this.gameMgr.update(1/60);

    },
    onTouchMoved: function (touch, event) {

    },
    onTouchEnded: function (touch, event) {

    },
    runTest: function(pathData)
    {
        var path = new PathEntity(10);

        for(var i=0;i<pathData.length;i++)
        {
            if(pathData[i].r_1)
            {
                var vec1 = vec2(pathData[i].r_1.x *PM_RATIO,pathData[i].r_1.y *PM_RATIO);
                var vec2_ = vec2(pathData[i].r_2.x *PM_RATIO,pathData[i].r_2.y *PM_RATIO);

                path.addPathPoint(this.radomVec(vec1,vec2_));
            }
            else
            {
                path.addPathPoint(new Vector2(pathData[i].x * PM_RATIO,pathData[i].y * PM_RATIO));
            }

            //cc.log("add :" + JSON.stringify(pathData.data[i]))
        }
        path.calculate();

        this.sp = this.createFish2D(4);
        this.layerTest.addChild(this.sp);

        var fish = new Fish();
        fish.setNodeDisplay(this.sp);
        fish.startWithPath(path);

        this.gameMgr.createBodyForFish(fish,vec2(0.5,1));
    },
    onButtonReleased: function(btn,id)
    {

        switch (id)
        {
            case 1:
            {
                this.addPath(this.dataPaths);
                this.dataPaths = [];
                this.layerTest.removeAllChildrenWithCleanup();
                break;
            }
            case 2:     // test
            {

                this.runTest(this.dataPaths);

                break;
            }
            case 3:
            {
                this.log();
                break;
            }
            case 4: // clear
            {
                this.dataPaths = [];
                this.layerTest.removeAllChildrenWithCleanup();
                this.count;
                break;
            }
            case 5:
            {
                this.needRand = !this.needRand;
                cc.log("need random : " + this.needRand);
                break;
            }
        }
    },
    createFishAnim: function(type)
    {
        var node = new cc.Node();
        var sp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("fish_" +type +"_01.png"));
        var animation = cc.animationCache.getAnimation("fish_"+type+"_swim");
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));
        node.addChild(sp,0);
        sp.setPosition(20,20);

        sp.setColor(cc.color(0,0,0));
        sp.setOpacity(100);

        var sp2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("fish_" +type +"_01.png"));
        sp2.runAction(cc.repeatForever(cc.animate(animation)));

        node.addChild(sp2,1);

        return node;
    },
    createFish2D: function(type)
    {
        var obj = fishData.data["fish_X"+type];
        var sp = new cc.Sprite(obj["template_path"] +"00.png");

        var animation = new cc.Animation()
        for (var i = 1; i < obj["count"]; i++) {
            var frameName = obj["template_path"] + ((i < 10) ? ("0" + i) : i) + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.05);
        var action = cc.animate(animation);
        sp.runAction(cc.repeatForever(action));
        return sp;
    },
    radomVec: function(vec1,vec2)
    {
        var x = Math.min(vec1.x,vec2.x) + Math.random() * Math.abs(vec1.x - vec2.x);
        var y = Math.min(vec1.y,vec2.y) + Math.random() * Math.abs(vec1.y - vec2.y);

        return new Vector2(x,y);

    }
});