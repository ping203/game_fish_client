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

var BULLET_LIVE = 10;
var DELAY_SHOOT = 0.15;

var TIME_NORMAL_MAP = 120;
var TIME_PREPARE = 6.5;
var TIME_MATRAN_MAP = 120;

var MONEY_DEMO = 1000000;


// for api login standalone
var BASE_URL = "https://manvip.club/portal/api?";
BASE_URL = "https://cors-anywhere.herokuapp.com/http://manvip.club/portal/api?";
// BASE_URL = "http://130.211.249.69:8081/api?";

//cloudflare
var SERVER_IP = "ws-thanbien.api-core.net";      // server live CF
var SERVER_PORT = 2053;

// var SERVER_IP = "35.247.131.44";             // server live that
// var SERVER_PORT = 2053;

// var SERVER_IP = "35.240.162.131";               // server test
// var SERVER_PORT = 8080;


var IS_SSL = true;

// for web download resources
var RES_PATH = "https://thanbien.manvip.club/mobile";       // live for web
// var RES_PATH = "http://35.240.162.131/web";                    // host test for web

var FPS = 1;


var LOGIN_WEB = 0;
var LOGIN_ANDROID = 1;
var LOGIN_IOS = 2;


var vec2 = function(x, y){
    return cc.p(x, y);
};
var vec3 = cc.math.vec3;


// EXCHANGE ERROR CODE

EXCHANGE_ERROR_UNKNOWN = 1;
EXCHANGE_ERROR_SYSTEM = 2;
EXCHANGE_ERROR_TOKEN = 3;
EXCHANGE_ERROR_NOT_ENOUGH = 4;
EXCHANGE_ERROR_QUA_HAN_MUC = 5;
EXCHANGE_ERROR_FORBIDDEN = 6;
EXCHANGE_ERROR_INVALID_MONEY = 7;
EXCHANGE_ERROR_CAPTCHA = 8;
