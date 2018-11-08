/**
 * Created by HOANG on 10/5/2018.
 */
var audioEngine = cc.audioEngine;
var fishSound = fishSound || {};


fishSound.playMusicLobby = function()
{
    audioEngine.playMusic("res/sounds/lobby/bg_lobby.mp3",true);
}

fishSound.playMusicBackgroundGame = function(id)
{
    audioEngine.stopMusic(false);
    audioEngine.playMusic("res/sounds/game/bg_game_"+id+".mp3",true);
}

fishSound.playEffectShoot = function()
{
    audioEngine.playEffect("res/sounds/fish/sound_fire_01.mp3",false);
}

fishSound.playEffectFishHit = function()
{
    audioEngine.playEffect("res/sounds/fish/sound_hit_03.mp3",false);

}

fishSound.stopMusic = function(){
    audioEngine.stopMusic(false);
}

fishSound.playEffectFishDie = function(type)
{
    return;
    if(type > 16)
        type = 16;
    audioEngine.playEffect("res/sounds/fish/die/" +type + ".mp3",false);
}


// effect