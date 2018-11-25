/**
 * Created by HOANGNGUYEN on 9/6/2018.
 */

var FishData = cc.Class.extend({
    ctor: function()
    {
        this.model2DData = null;
    },
    load: function()
    {
        this.loadFishModel();
        //this.loadFishPath();
        this.loadMatrix();
        cc.spriteFrameCache.addSpriteFrames("res/fishData/fishes0.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/fishes1.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/fishes2.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/fishes3.plist");

        cc.spriteFrameCache.addSpriteFrames("res/fishData/effect/coin1.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/effect/spray.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/loading/loading.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/coin/coin0.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/coin/coin1.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/coin/xuxu.plist");
        cc.spriteFrameCache.addSpriteFrames("res/fishData/wave/wave_0.plist");


        cc.animationCache.addAnimations("res/fishData/anim/fish_01_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_02_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_03_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_04_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_05_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_06_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_07_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_08_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_09_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_10_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_11_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_12_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_13_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_14_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_15_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_16_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_17_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_18_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_19_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_20_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_21_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_22_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_23_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_24_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_25_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_26_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_27_swim.plist");
        cc.animationCache.addAnimations("res/fishData/anim/fish_28_swim.plist");

        cc.animationCache.addAnimations("res/fishData/wave/wave_move.plist");


    },
    loadFishModel: function()
    {
        this.data = cc.loader.getRes("res/Fish2D.json");

    },
    loadFishPath: function()
    {
        this.fishPathData = cc.loader.getRes("res/Path_normals.json");
    },
    loadMatrix: function()
    {
        this.matrixData = cc.loader.getRes("res/fishes_matran.json");
    }
})

var fishData = new FishData();