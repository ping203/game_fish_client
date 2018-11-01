/**
 * Created by HOANG on 10/27/2018.
 */

var LobbyScene = BaseLayer.extend({
    ctor: function(){
        this._super();
        this.initWithBinaryFile("res/GUI/LobbyScene.json");
    },
    initGUI: function(){
        var panel_center = this.getControl("Panel_center");


        this.btnChoiThu = this.customizeButton("btnChoiThu",0,panel_center);
        this.btnChoiNgay = this.customizeButton("btnChoiNgay",1,panel_center);
        this.btnShop = this.customizeButton("btnShop",2,panel_center);

        var node_choingay = this.getControl("node_choingay",this.btnChoiNgay);
        var node_choithu = this.getControl("node_choithu",this.btnChoiThu);
        var node_shop = this.getControl("node_shop",this.btnShop);

        var top_center = this.getControl("Panel_top_center");
        var logo = new sp.SkeletonAnimation("res/GUI/Lobby/Anim/logo/skeleton.json","res/GUI/Lobby/Anim/logo/skeleton.atlas");
        logo.setAnimation(0,"animation",true);
        logo.setScale(.65);
        top_center.addChild(logo);


        var animChoiNgay =  new sp.SkeletonAnimation("res/GUI/Lobby/Anim/Chien_ngay/skeleton.json","res/GUI/Lobby/Anim/Chien_ngay/skeleton.atlas");
        animChoiNgay.setAnimation(0,"animation",true);
        animChoiNgay.setScale(.65);

        node_choingay.addChild(animChoiNgay);

        var animChoiThu=  new sp.SkeletonAnimation("res/GUI/Lobby/Anim/Choi_thu/skeleton.json","res/GUI/Lobby/Anim/Choi_thu/skeleton.atlas");
        animChoiThu.setAnimation(0,"animation",true);
        animChoiThu.setScale(.65);

        node_choithu.addChild(animChoiThu);

        var animShop=  new sp.SkeletonAnimation("res/GUI/Lobby/Anim/Shop/skeleton.json","res/GUI/Lobby/Anim/Shop/skeleton.atlas");
        animShop.setAnimation(0,"animation",true);
        animShop.setScale(.65);

        node_shop.addChild(animShop);

        var animLeft =  new sp.SkeletonAnimation("res/GUI/Lobby/Anim/Shop/skeleton.json","res/GUI/Lobby/Anim/Shop/skeleton.atlas");
        animLeft.setAnimation(0,"animation",true);
        animLeft.setScale(.65);

        var animCua =  new sp.SkeletonAnimation("res/GUI/Lobby/Anim/cua/skeleton.json","res/GUI/Lobby/Anim/cua/skeleton.atlas");
        animCua.setAnimation(0,"animation",true);
        animCua.setScale(.3);

        var panel_cua = this.getControl("panel_cua");
        panel_cua.addChild(animCua);

        animCua.flipped = true;

        var func = function(){
            this.flipped = !this.flipped;
            //this.setFlipX(this.flipped);
        }.bind(animCua)

        animCua.runAction(cc.sequence(cc.moveBy(30,cc.p(850,0)),cc.callFunc(func),cc.moveBy(30,cc.p(-850,0))).repeatForever());


        GameClient.getInstance().setListener(lobbyListenner);

    },
    onButtonReleased: function(btn,id){
        switch (id){
            case 0:{
                cc.director.runScene(makeScene(new DemoScene()));
                break;
            }
            case 1:{
                //GameClient.getInstance().connect("127.0.0.1",8080);
<<<<<<< HEAD
                //GameClient.getInstance().connect("192.168.0.127",8080);
=======
                GameClient.getInstance().connect("192.168.0.127",8080);
>>>>>>> parent of fa26709... ahi

                GameClient.getInstance().connect("35.240.162.131",8080);
                break;
            }
            case 2:{
                var spine = new sp.SkeletonAnimation("res/FX/laser_02.json","res/FX/laser_02.atlas");
                spine.setAnimation(0,"laser_02",true);
                spine.setPosition(300,300);
                this.addChild(spine);
                cc.log(spine);
                break;
            }
        }
    }
})