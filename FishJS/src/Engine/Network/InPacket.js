var INDEX_SIZE_PACKET = 1;
var InPacket = cc.Class.extend({
    ctor: function () {

    },
    init: function (pkg) {
        this._pos = 0;
        this._data = pkg;
        this._length = pkg.length;
        //this._controllerId = this.parseByte();
        this._cmdId = this.getShort();
        this._dataLength = this.getShort();
    },
    getCmdId: function () {
        return this._cmdId;
    },
    getControllerId: function () {
        return this._controllerId;
    },
    getError: function () {
        return this._error;
    },
    parseByte: function () {
        var b = this._data[this._pos++];
        return b;
    },
    getByte: function () {
        return this.parseByte();
    },
    getBool: function () {
        var b = this._data[this._pos++];
        return b > 0;
    },
    getBytes: function (size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(this.parseByte());
        }
        return bytes;
    },
    getShort: function () {
        if (this._pos + 2 > this._length) {
            return 0;
        }
        var v = ((this.parseByte() << 8) + (this.parseByte() & 255));
        if (v > 32767) {
            return (v - 65536);
        }
        return v;
    },
    getUnsignedShort: function () {
        var a = (this.parseByte() & 255) << 8;
        var b = (this.parseByte() & 255) << 0;
        return a + b;
    },
    getInt: function () {
        return ((this.parseByte() & 255) << 24) +
            ((this.parseByte() & 255) << 16) +
            ((this.parseByte() & 255) << 8) +
            ((this.parseByte() & 255) << 0);
    },
    byteArrayToLong: function (array) {
        var positive = true;
        var value = 0;
        if (array[0] == (255 & 0xff)) {
            positive = false;
        }
        if (positive) {
            for (var i = 0; i < 8; i++) {
                value = (value * 256) + array[i];
            }
        } else {
            //for ( var i = 0; i < 7; i++) {
            //    array[i] = (255 - array[i])& 0xff;
            //}
            //array[7] = (256-array[i]) & 0xff;
            //for ( var i = 0; i < 8; i++) {
            //    value = (value * 256) + array[i];
            //}
            //value = -value;
            value = 1;
            for (var i = 1; i <= 7; i++) {
                value = value * 256 - array[i];
            }
            value = -value;
        }
        return value;
    },

    getLong: function () {
        var data = [];
        for (var i = 0; i < 8; i++) {
            data[i] = this.parseByte();
        }
        return this.byteArrayToLong(data);
    },


    getDouble: function () {
        var buffer = new ArrayBuffer(8);
        var int8array = new Uint8Array(buffer);

        for (var i = 7; i >= 0; i--) {
            int8array[7 - i] = this.parseByte();
        }
        var dataview = new DataView(buffer);

        return dataview.getFloat64(0);

    },

    getCharArray: function () {
        var size = this.getUnsignedShort();
        return this.getBytes(size);
    },

    getString: function () {
        var out = this.getCharArray();
        var uintarray = new Uint8Array(out.length);
        for (var i = 0; i < out.length; i++) {
            uintarray[i] = parseInt(out[i], 10);
        }
        var encode = String.fromCharCode.apply(null, uintarray);
        var decode = decodeURIComponent(escape(encode));

        return decode;
    },
    clean: function () {

    }
});
var InPacketData = {
    _jData: "{}",
    ctor: function (pkg) {
        this.init(pkg);
    }
};
var CmdReceivedCommon = InPacket.extend({
    ctor: function(pkg){
        this._super();
        this.init(pkg);
    }
})



