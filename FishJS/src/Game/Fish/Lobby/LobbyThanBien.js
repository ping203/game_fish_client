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

        if(!cc.sys.isNative)
        {
            cc.loader.resPath = "http://35.240.162.131/mobile";
            //load resources
            cc.loader.load(g_resources_fishes,function(result, count, loadedCount){
                if(lobbyThanBien && lobbyThanBien.updatePercent)
                {
                    lobbyThanBien.updatePercent(Math.floor(loadedCount * 100 / count));
                }
            },function () {
                document.body.style.cursor= "url('http://35.240.162.131/res/pointer.png'), auto";
                startGame();
                cc.loader.resPath = "";
            });
        }
        else
            startGame();



    }
})

var startGame = function () {
    if(!_initGameTB)
    {
        box2D_init();
        fishData.load();
        matranMap.loadData();
        gameData.loadStorage();
        // ccs.load("res/GUI/GameLayer.json");
        initSharedWorker();
        _initGameTB = true;
    }

    lobbyThanBien.onOpenGameDone();

    var lobbyScene = new LobbyScene();
    lobbyScene.withLogin();
    bcSceneMgr.openWithScene(lobbyScene);
    //
    BCGameClient.getInstance().setListener(lobbyListenner);
    BCGameClient.getInstance().connect(SERVER_IP,SERVER_PORT);
}

var lobbyThanBien = null;
var old_resPath = "";
var _initGameTB = false;