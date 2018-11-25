/**
 * Created by admin on 10/22/18.
 */

var wsClient = null;

var BASE_URL = "http://130.211.249.69:8081/api?";

var LoginScene = BCBaseLayer.extend({
    ctor: function()
    {
        this._super();
        this.initWithBinaryFile("res/GUI/LoginLayer.json");

        BCGameClient.getInstance().setListener(lobbyListenner);



        this.nickName = "";
        this.accessToken = "";

    },
    initGUI: function()
    {
        this.customizeButton("btnLogin",1);

        this.lbUsername = this.getControl("username");
        this.lbPassword = this.getControl("password");

        this.lbUsername.setString( cc.sys.localStorage.getItem("username") || "");
        this.lbPassword.setString( cc.sys.localStorage.getItem("password") || "");



    },
    onButtonReleased: function(btn,id){
        switch (id)
        {
            case 1:
            {
                var username = this.lbUsername.getString();
                var password = this.lbPassword.getString();

                var url = this.urlLogin(username,MD5(password),"android");
                cc.log(url);

                this.httpRequest(url,this.parseResponseUrlLogin.bind(this));

                break;
            }
        }
    },

    httpRequest : function(url, callback){
        var request = cc.loader.getXMLHttpRequest();
        request.open("GET", url, true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        (request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //get status text
                var httpStatus = request.statusText;

                if (callback != null) {
                    callback.call(this,request.responseText);
                }
            }
        }.bind(this));
        request.send();
    },

    parseResponseUrlLogin: function(responseText){
        var jsonDat = JSON.parse(responseText);
        if (jsonDat["success"]) {
            this.accessToken = jsonDat["accessToken"];
            var sessionKey = jsonDat["sessionKey"];

            var sessionJsonData = JSON.parse(Base64.decode(sessionKey));
            this.nickName = sessionJsonData["nickname"];

            gameData.nickName = this.nickName;
            gameData.accessToken = this.accessToken;

            cc.sys.localStorage.setItem("username",this.lbUsername.getString());
            cc.sys.localStorage.setItem("password",this.lbPassword.getString());

            var lobbyScene = new LobbyScene();
            lobbyScene.withLogin();
            bcSceneMgr.openWithScene(lobbyScene);

            BCGameClient.getInstance().setListener(lobbyListenner);
            //BCGameClient.getInstance().connect("192.168.0.113",8080);
            BCGameClient.getInstance().connect("35.240.162.131",8080);

        }
    },


    urlLogin :function (username, password, platform) {
        return BASE_URL + "c=3&un=" + username + "&pw=" + password + "&pf=" + platform + "&at=" + "";
    },
    urlLoginAcccessToken :function (nickName, accessToken, platform) {
        //cc.log("platform :" + platform);
        return BASE_URL + "c=2&nn=" + nickName + "&at=" + accessToken + "&pf=" + platform;
    },
    callBackLogIn: function (response) {

        cc.log(response);

        var jsonData = JSON.parse(response);
        //cc.log("login : " + response);
        var success = jsonData["success"];
        var errorCode = jsonData["errorCode"];

        if (success) {
            if (this.isLoginAccessToken) {
                this.isLoginAccessToken = false;
            }
            userGameData.setItem("current_user_info_login", response);
            if (this.saveUserName != "")
                userGameData.setItem("current_username", this.saveUserName);
            ConfigProfile.save_password = this.tf_pass_tab.getString();
            var sessionKey = jsonData["sessionKey"];
            userInfo.accessToken = jsonData["accessToken"];
            var userData = JSON.parse(Jacob__Codec__Base64__decode(sessionKey));

            cc.log("respones: " + userData.toString());
            userInfo.userData = userData;
            if (userInfo.userData.avatar == null || userInfo.userData.avatar == "")
                userInfo.userData.avatar = "0";
            this.tf_user_name_tab.setString("");
            this.tf_pass_tab.setString("");
            this.lobby.loginSuccess();
            if (this.pTaoNhanVat) {
                this.pTaoNhanVat.removeFromParent(true);
                this.pTaoNhanVat = null;
            }
            if (this.pn_login_otp) {
                this.pn_login_otp.removeFromParent(true);
                this.pn_login_otp = null;
            }

            if (cc.sys.isNative) {
                lobby.isNewUser = false;
            } else {
                if(userInfo.userData.mobileSecure == 0)
                    lobby.isNewUser = true;
            }

        } else {
            userInfo.userData = null;
            if (this.isLoginAccessToken) {
                this.isLoginAccessToken = false;
            } else {
                switch (parseInt(errorCode)) {
                    case 1001:
                        gI.popUp.openPanel_Alert_Lobby("Mất kết nối máy chủ!");
                        break;
                    case 1005:
                        gI.popUp.openPanel_Alert_Lobby("Thông tin đăng nhập không hợp lệ!");
                        break;
                    case 1007:
                        gI.popUp.openPanel_Alert_Lobby("Thông tin đăng nhập không hợp lệ!");
                        break;
                    case 1109:
                        gI.popUp.openPanel_Alert_Lobby("Tài khoản đang bị khóa!");
                        break;
                    case 2001:
                        this.lobby.openUpdateNN();
                        break;
                    case 1012:
                        this.openPLoginOtp();
                        break;
                    case 1008:
                        gI.popUp.openPanel_Alert_Lobby("Mã xác thực không chính xác!");
                        break;
                    case 1021:
                        gI.popUp.openPanel_Alert_Lobby("Mã xác thực đã hết thời gian sử dụng!");
                        break;
                    case 1114:
                        gI.popUp.openPanel_Alert_Lobby("Hệ thống bảo trì vui lòng quay lại sau!");
                        break;
                    case 106:
                        gI.popUp.openPanel_Alert_Lobby("NickName không hợp lệ!");
                        break;
                    case 1010:
                        gI.popUp.openPanel_Alert_Lobby("NickName đã tồn tại!");
                        break;
                    case 1011:
                        gI.popUp.openPanel_Alert_Lobby("NickName không được trùng với UserName!");
                        break;
                    case 1013:
                        gI.popUp.openPanel_Alert_Lobby("Đã có NickName rồi!");
                        break;
                    case 116:
                        gI.popUp.openPanel_Alert_Lobby("Không chọn NickName nhạy cảm!");
                        break;
                    case 1014:
                        break;
                    case 1015:
                        break;
                    case 2002:
                        this.initChangePassword();
                        break;
                }

            }

        }
    }

})

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}





var MD5 = function (string) {


    function RotateLeft(lValue, iShiftBits) {

        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));

    }


    function AddUnsigned(lX,lY) {

        var lX4,lY4,lX8,lY8,lResult;

        lX8 = (lX & 0x80000000);

        lY8 = (lY & 0x80000000);

        lX4 = (lX & 0x40000000);

        lY4 = (lY & 0x40000000);

        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);

        if (lX4 & lY4) {

            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);

        }

        if (lX4 | lY4) {

            if (lResult & 0x40000000) {

                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);

            } else {

                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);

            }

        } else {

            return (lResult ^ lX8 ^ lY8);

        }

    }


    function F(x,y,z) { return (x & y) | ((~x) & z); }

    function G(x,y,z) { return (x & z) | (y & (~z)); }

    function H(x,y,z) { return (x ^ y ^ z); }

    function I(x,y,z) { return (y ^ (x | (~z))); }


    function FF(a,b,c,d,x,s,ac) {

        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);

    };


    function GG(a,b,c,d,x,s,ac) {

        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);

    };


    function HH(a,b,c,d,x,s,ac) {

        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);

    };


    function II(a,b,c,d,x,s,ac) {

        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);

    };


    function ConvertToWordArray(string) {

        var lWordCount;

        var lMessageLength = string.length;

        var lNumberOfWords_temp1=lMessageLength + 8;

        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;

        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;

        var lWordArray=Array(lNumberOfWords-1);

        var lBytePosition = 0;

        var lByteCount = 0;

        while ( lByteCount < lMessageLength ) {

            lWordCount = (lByteCount-(lByteCount % 4))/4;

            lBytePosition = (lByteCount % 4)*8;

            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));

            lByteCount++;

        }

        lWordCount = (lByteCount-(lByteCount % 4))/4;

        lBytePosition = (lByteCount % 4)*8;

        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);

        lWordArray[lNumberOfWords-2] = lMessageLength<<3;

        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;

        return lWordArray;

    };


    function WordToHex(lValue) {

        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;

        for (lCount = 0;lCount<=3;lCount++) {

            lByte = (lValue>>>(lCount*8)) & 255;

            WordToHexValue_temp = "0" + lByte.toString(16);

            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);

        }

        return WordToHexValue;

    };


    function Utf8Encode(string) {

        string = string.replace(/\r\n/g,"\n");

        var utftext = "";


        for (var n = 0; n < string.length; n++) {


            var c = string.charCodeAt(n);


            if (c < 128) {

                utftext += String.fromCharCode(c);

            }

            else if((c > 127) && (c < 2048)) {

                utftext += String.fromCharCode((c >> 6) | 192);

                utftext += String.fromCharCode((c & 63) | 128);

            }

            else {

                utftext += String.fromCharCode((c >> 12) | 224);

                utftext += String.fromCharCode(((c >> 6) & 63) | 128);

                utftext += String.fromCharCode((c & 63) | 128);

            }


        }


        return utftext;

    };


    var x=Array();

    var k,AA,BB,CC,DD,a,b,c,d;

    var S11=7, S12=12, S13=17, S14=22;

    var S21=5, S22=9 , S23=14, S24=20;

    var S31=4, S32=11, S33=16, S34=23;

    var S41=6, S42=10, S43=15, S44=21;


    string = Utf8Encode(string);


    x = ConvertToWordArray(string);


    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;


    for (k=0;k<x.length;k+=16) {

        AA=a; BB=b; CC=c; DD=d;

        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);

        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);

        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);

        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);

        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);

        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);

        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);

        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);

        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);

        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);

        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);

        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);

        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);

        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);

        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);

        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);

        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);

        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);

        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);

        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);

        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);

        d=GG(d,a,b,c,x[k+10],S22,0x2441453);

        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);

        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);

        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);

        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);

        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);

        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);

        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);

        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);

        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);

        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);

        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);

        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);

        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);

        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);

        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);

        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);

        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);

        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);

        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);

        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);

        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);

        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);

        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);

        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);

        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);

        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);

        a=II(a,b,c,d,x[k+0], S41,0xF4292244);

        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);

        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);

        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);

        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);

        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);

        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);

        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);

        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);

        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);

        c=II(c,d,a,b,x[k+6], S43,0xA3014314);

        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);

        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);

        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);

        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);

        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);

        a=AddUnsigned(a,AA);

        b=AddUnsigned(b,BB);

        c=AddUnsigned(c,CC);

        d=AddUnsigned(d,DD);

    }


    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);


    return temp.toLowerCase();
}