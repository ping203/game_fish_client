/**
 * Created by HOANG on 10/5/2018.
 */
var audioEngine = cc.audioEngine;
var fishSound = fishSound || {};


fishSound.playMusicLobby = function()
{
    audioEngine.playMusic("res/sounds/lobby/bg_lobby_1.mp3",true);
}

fishSound.playMusicBackgroundGame = function(id)
{
    audioEngine.stopMusic(false);
    audioEngine.playMusic("res/sounds/game/bg_game_"+id+".mp3",true);
}

fishSound.playEffectShoot = function()
{
    audioEngine.playEffect("res/sounds/game/fire1.mp3",false);
}

fishSound.playEffectCoin = function()
{
    audioEngine.playEffect("res/sounds/game/coin.mp3",false);

}

fishSound.playEffectBoom = function()
{
    audioEngine.playEffect("res/sounds/game/bom3.mp3",false);

}

fishSound.stopMusic = function(){
    audioEngine.stopMusic(false);
}

fishSound.playEffectFishDie = function(type)
{
}


// effect