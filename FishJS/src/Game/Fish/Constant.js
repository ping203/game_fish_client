/**
 * Created by admin on 9/3/18.
 */


var DESIGN_RESOLUTION_WIDTH = 1280;
var DESIGN_RESOLUTION_HEIGHT = 720;

var PM_RATIO = 32.0;

var MAX_PLAYER = 4;
var USER_STATUS_NO_LOGIN = 0;
var USER_STATUS_VIEW = 1;
var USER_STATUS_SIT = 2;
var USER_STATUS_READY = 3;
var USER_STATUS_PLAY = 4;

var DELAY_SHOOT = 0.15;

var TIME_NORMAL_MAP = 20;
var TIME_PREPARE = 6.5;
var TIME_MATRAN_MAP = 129;

var FPS = 1;


var box2D_init = function(){

}


var vec2 = function(x, y){
    return cc.p(x, y);
};
var vec3 = cc.math.vec3;
