/**
 * Created by admin on 10/22/18.
 */

var wsClient = null;

var LoginScene = BaseLayer.extend({
    ctor: function()
    {
        this._super();
        this.initWithBinaryFile("res/GUI/LoginLayer.json");

        GameClient.getInstance().setListener(lobbyListenner);
    },
    initGUI: function()
    {
        this.customizeButton("btnLogin",1);
    },
    onButtonReleased: function(btn,id){
        switch (id)
        {
            case 1:
            {
                GameClient.getInstance().connect("192.168.1.20",8080);
                break;
            }
        }
    }
})