var BIT_IS_BINARY_INDEX = 7;
var BIT_IS_ENCRYPT_INDEX = 6;
var BIT_IS_COMPRESS_INDEX = 5;
var BIT_IS_BLUE_BOXED_INDEX = 4;
var BIT_IS_BIG_SIZE_INDEX = 3;
var BYTE_PACKET_SIZE_INDEX = 1;
var BIG_HEADER_SIZE = 5;
var NORMAL_HEADER_SIZE = 3;
var OutPacket = cc.Class.extend(
    {
        ctor: function () {
            this._controllerId = 1;
            this._cmdId = 0;
            this.reset();
        },
        setCmdId: function (cmdId) {
            this._cmdId = cmdId;
        },
        setControllerId: function (controllerId) {
            this._controllerId = controllerId;
        },
        initData: function (capacity) {
            this._data = new Uint8Array(capacity);
            this._capacity = capacity;
        },
        reset: function () {
            this._pos = 0;
            this._length = 0;
            this._isPackedHeader = false;
        },
        packHeader: function () {
            if (this._isPackedHeader) {
                return;
            }
            this._isPackedHeader = true;

            var header = PacketHeaderAnalyze.genHeader(false, false);
            this.putByte(header);
            this.putUnsignedShort(this._length);
            this.putByte(this._controllerId);
            this.putShort(this._cmdId);
        },
        putByte: function (b) {
            this._data[this._pos++] = b;
            this._length = this._pos;
            return this;
        },
        putByteArray: function (bytes) {
            this.putShort(bytes.length);
            this.putBytes(bytes);
            return this;
        },

        putBytes: function (bytes) {
            for (var i = 0; i < bytes.length; i++) {
                this.putByte(bytes[i]);
            }
            return this;
        },

        putShort: function (v) {
            this.putByte((v >> 8) & 0xFF);
            this.putByte((v >> 0) & 0xFF);
            return this;
        },
        putUnsignedShort: function (v) {
            this.putByte(v >> 8);
            this.putByte(v >> 0);
            return this;
        },
        putInt: function (v) {
            this.putByte((v >> 24) & 0xff);
            this.putByte((v >> 16) & 0xff);
            this.putByte((v >> 8) & 0xff);
            this.putByte((v >> 0) & 0xff);
            return this;
        },
        putLong: function (v) {
            if(v < 0) {
                cc.log("hahaha");
            }
            var data = [];
            for(var k=0; k< 8;k++) {
                data[k] = (v & (0xff));
                v = Math.floor(v/ 256);
            }

            for(var i = 7; i >= 0; i--) {
                this.putByte(data[i]);
            }
        },


        putDouble: function(v){
            this.putByte((v >> 24) & 0xff);
            this.putByte((v >> 16) & 0xff);
            this.putByte((v >> 8) & 0xff);
            this.putByte((v >> 0) & 0xff);
            this.putByte((v >> 24) & 0xff);
            this.putByte((v >> 16) & 0xff);
            this.putByte((v >> 8) & 0xff);
            this.putByte((v >> 0) & 0xff);
            return this;
        },

        putString: function (str) {
            //TODO: add this
            this.putByteArray(this._stringConvertToByteArray(str));
            return this;
        },
        updateUnsignedShortAtPos: function (v, pos) {
            this._data[pos] = v >> 8;
            this._data[pos + 1] = v >> 0;
        },
        updateSize: function () {
            this.updateUnsignedShortAtPos(this._length - 3, INDEX_SIZE_PACKET);
        },
        getData: function () {
            return this._data.slice(0, this._length);
        },
        _stringConvertToByteArray: function (strData) {
            if (strData == null)
                return null;
            var arrData = new Uint8Array(strData.length);
            for (var i = 0; i < strData.length; i++) {
                arrData[i] = strData.charCodeAt(i);
            }
            return arrData;
        },
        clean: function () {

        }
    });
var PacketHeaderAnalyze = {
    getDataSize: function (data) {
        var bigSize = this.isBigSize(data);
        if (bigSize)
            return this.getIntAt(data, BYTE_PACKET_SIZE_INDEX);
        else
            return this.getUnsignedShortAt(data, BYTE_PACKET_SIZE_INDEX);
    },
    getCmdIdFromData: function (data) {
        return this.getShortAt(data, 1);
    },
    isBigSize: function (data) {
        return this.getBit(data[0], BIT_IS_BIG_SIZE_INDEX);
    },
    isCompress: function (data) {
        return this.getBit(data[0], BIT_IS_COMPRESS_INDEX);
    },
    getValidSize: function (data) {
        var bigSize = this.isBigSize(data);
        var dataSize = 0;
        var addSize = 0;
        if (bigSize) {
            if (length < BIG_HEADER_SIZE)
                return -1;
            dataSize = this.getIntAt(data, BYTE_PACKET_SIZE_INDEX);
            addSize = BIG_HEADER_SIZE;
        }
        else {
            if (length < NORMAL_HEADER_SIZE)
                return -1;
            dataSize = this.getUnsignedShortAt(data, BYTE_PACKET_SIZE_INDEX);
            addSize = NORMAL_HEADER_SIZE;
        }
        return dataSize + addSize;
    },
    getBit: function (input, index) {
        var result = input & (1 << index);
        return (result != 0);
    },
    genHeader: function (bigSize, compress) {
        var header = 0;
        //set bit dau la binary hay ko
        header = this.setBit(header, 7, true);
        //bit 2: ko ma hoa
        header = this.setBit(header, 6, false);
        //bit 3: ko nen
        header = this.setBit(header, 5, compress);
        //bit 4: isBlueBoxed?
        header = this.setBit(header, 4, true);
        //bit 5: isBigSize?
        header = this.setBit(header, 3, bigSize);
        return header;
    },
    setBit: function (input, index, hasBit) {
        if (hasBit) {
            input |= 1 << index;
        } else {
            input &= ~(1 << index);
        }
        return input;
    },
    getIntAt: function (data, index) {
        return ((data[index] & 255) << 24) +
            ((data[index + 1] & 255) << 16) +
            ((data[index + 2] & 255) << 8) +
            ((data[index + 3] & 255) << 0);
    },
    getUnsignedShortAt: function (data, index) {
        var a = (data[index] & 255) << 8;
        var b = (data[index + 1] & 255) << 0;
        return a + b;
    },
    getShortAt: function (data, index) {
        return (data[index] << 8) + (data[index + 1] & 255);
    }
};
var OutPacketData = {
    _jData: "{}"
};
// var  CmdSendCommon = $.extend(true, OutPacketData, OutPacket);
// CmdSendCommon.extend = function (sub) {
//     return $.extend(true, sub, CmdSendCommon);
// }

var CmdSendCommon = OutPacket.extend({
    ctor: function(){
        this._super();
    }
})

