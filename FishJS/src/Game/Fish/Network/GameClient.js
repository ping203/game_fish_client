/**
 * Created by admin on 10/25/18.
 */


var GameClientListener = cc.Class.extend({
    onReceived: function(cmd,pkg)
    {

    },
    onConnect: function(result){

    },
    onDisconnect: function(){

    }
})

var GameClient = cc.Class.extend({
    ctor: function()
    {
        this.listenner = null;
        this.wsClient = new WebsocketClient();
    },
    setListener: function(lis)
    {
        this.listenner = lis;
    },
    connect: function(ip,port)
    {
        this.wsClient.connect(ip,port,false,this);
    },
    onFinishConnect: function(result){
        if(this.listenner)
            this.listenner.onConnect(result);
    },
    onDisconnected: function(){
        if(this.listenner)
            this.listenner.onDisconnect();
    },
    onReceived: function(pkg){
        var pk = new CmdReceivedCommon(pkg);
        var cmd = pk.getCmdId();

        if(this.listenner)
        {
            this.listenner.onReceived(cmd,pkg);
        }
    },
    sendPacket: function(pk){
        this.wsClient.send(pk.getData());
    }
})

var gameclient_instance = null;

GameClient.getInstance = function(){
    if(gameclient_instance == null)
        gameclient_instance = new GameClient();
    return gameclient_instance;
}