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
        this.customizeButton("btnChoiThu",0,panel_center);
        this.customizeButton("btnChoiNgay",1,panel_center);
        this.customizeButton("btnShop",2,panel_center);


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
                GameClient.getInstance().connect("192.168.0.127",8080);

                //GameClient.getInstance().connect("35.240.162.131",8080);
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