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

        GameClient.getInstance().setListener(lobbyListenner);

    },
    onButtonReleased: function(btn,id){
        switch (id){
            case 0:{
                cc.director.runScene(makeScene(new DemoScene()));
                break;
            }
            case 1:{
                GameClient.getInstance().connect("192.168.0.107",8080);
                break;
            }
        }
    }
})