/**
 * Created by admin on 10/25/18.
 */


var BCGameClientListener = cc.Class.extend({
    onReceived: function(cmd,pkg)
    {

    },
    onConnect: function(result){

    },
    onDisconnect: function(){

    }
})

var BCGameClient = cc.Class.extend({
    ctor: function()
    {
        this.listenner = null;
        this.wsClient = new BCWebsocketClient();

        this.connected = false;
    },
    setListener: function(lis)
    {
        this.listenner = lis;
    },
    connect: function(ip,port)
    {
        this.wsClient.connect(ip,port,IS_SSL,this);
    },
    disconnect: function () {
        this.wsClient.closeSocket();
    },
    onFinishConnect: function(result){
        this.connected = result;
        if(this.listenner)
            this.listenner.onConnect(result);


    },
    onDisconnected: function(){
        if(this.listenner)
            this.listenner.onDisconnect();
        this.connected = false;

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
        if(this.wsClient && this.connected)
            this.wsClient.send(pk.getData());
    }
})

var gameclient_instance = null;

BCGameClient.getInstance = function(){
    if(gameclient_instance == null)
        gameclient_instance = new BCGameClient();
    return gameclient_instance;
}