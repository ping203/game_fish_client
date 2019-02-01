/**
 * Created by HOANG on 11/5/2018.
 */
    // Global data for Game


var UserData = cc.Class.extend({
    ctor: function(){
        this.userName = "";
        this.displayName = "";
        this.nickName ="";
        this.avatar = "";
        this.gold = 0;
        this.vinMoney = 0;
    }
})
var GameData = cc.Class.extend({
    ctor: function(){

        this.nickName = "";
        this.accessToken = "";

        this.userData = new UserData();
        this.config = new Object();

        this.enableMusic = true;
        this.enableSound = true;

        this.notifyData = [];
    },
    loadStorage: function () {
        var check = cc.sys.localStorage.getItem("music");
        if(check == null || check == "")
            this.enableMusic = true;
        else
            this.enableMusic = (parseInt(check) > 0);

        check = cc.sys.localStorage.getItem("sound");
        if(check == null || check == "")
            this.enableSound = true;
        else
            this.enableSound = (parseInt(check) > 0);
    },
    saveStorage: function () {
        cc.sys.localStorage.setItem("music",this.enableMusic?"1":"0");
        cc.sys.localStorage.setItem("sound",this.enableSound?"1":"0");

    },
    pushNotify: function (msg) {
        if(this.notifyData.length >= 10)
        {
            this.notifyData.splice(0,1);
        }
        this.notifyData.push(msg);
    }
})

var gameData = new GameData();