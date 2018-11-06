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

    }
})

var gameData = new GameData();