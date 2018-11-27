/**
 * Created by HOANG on 11/20/2018.
 */
var LobbyThanBien = cc.Layer.extend({
    ctor: function(vinPlayLayer,nickname,accessToken){
        this._super();
        lobbyThanBien = vinPlayLayer;

        this.nickName = nickname;
        this.accessToken = accessToken;

        gameData.nickName = this.nickName;
        gameData.accessToken = this.accessToken;

        old_resPath = cc.loader.resPath;

        cc.loader.resPath = "http://35.240.162.131";

        //load resources
        cc.loader.load(g_resources_fishes, function () {
            box2D_init();
            fishData.load();
            matranMap.loadData();
            gameData.loadStorage();
            ccs.load("res/GUI/GameLayer.json");

             var sys = cc.sys;
             if(!sys.isNative)
                document.body.style.cursor= "url('http://35.240.162.131/res/pointer.png'), auto";

            lobbyThanBien.onOpenGameDone();

            cc.loader.resPath = "";

            var lobbyScene = new LobbyScene();
            lobbyScene.withLogin();
            bcSceneMgr.openWithScene(lobbyScene);
            //
            BCGameClient.getInstance().setListener(lobbyListenner);
            BCGameClient.getInstance().connect(SERVER_IP,SERVER_PORT);

        });

    }
})

var lobbyThanBien = null;
var old_resPath = "";