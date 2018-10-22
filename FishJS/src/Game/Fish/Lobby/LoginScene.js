/**
 * Created by admin on 10/22/18.
 */

var wsClient = null;

var LoginScene = BaseLayer.extend({
    ctor: function()
    {
        this._super();
        this.initWithBinaryFile("res/GUI/LoginLayer.json");
        wsClient = new WebsocketClient();
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
                wsClient.connect("192.168.0.105",8080,false,this);
                break;
            }
        }
    },
    onFinishConnect: function(success)
    {
        cc.log("connect successful!");
    }
})