var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
var WebsocketClient = cc.Class.extend({
    ctor: function () {
        this.listener = null;
        this.ws = null;
        this.data = [];
    },
    getHandshakeRequest: function () {
        var obj = {};
        obj.c = 0;
        obj.a = 0;
        obj.p = {};
        obj.p["cl"] = "JavaScript";
        obj.p["api"] = "1.2.0";

        return JSON.stringify(obj);
    },
    handleHandshake: function () {
    },
    connect: function (host, port, isSsl, listenner) {
        console.log("create websocket client begin");
        this.ws = new WebSocket("ws" + (isSsl ? "s" : "") + "://" + host + ":" + port + "/websocket");
        this.listener = listenner;
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.onSocketConnect.bind(this);
        this.ws.onclose = this.onSocketClose.bind(this);
        this.ws.onmessage = this.onSocketData.bind(this);
        this.ws.onerror = this.onSocketError.bind(this);
        console.log("create websocket client end");
    },
    closeSocket: function () {
        this.ws.close();
    },
    onSocketConnect: function () {
        if (this.listener && this.listener.onFinishConnect) {
            this.listener.target = this;
            this.listener.onFinishConnect.call(this.listener, true);
        }
    },
    onSocketClose: function () {
        if (this.listener && this.listener.onDisconnected) {
            this.listener.target = this;
            this.listener.onDisconnected.call(this.listener);
        }
    },
    onSocketData: function (evt) {
        if (this.listener && this.listener.onReceived) {

            this.listener.onReceived.call(this.listener, new Uint8Array(evt.data,0));

        }
    },
    onSocketError: function () {
        if (this.listener && this.listener.onFinishConnect) {
            this.listener.target = this;
            this.listener.onFinishConnect.call(this.listener, false);
        }
    },

    send: function (packet) {
        cc.log("On send packet: " + packet.length);
        this.ws.send(packet);
    }
});