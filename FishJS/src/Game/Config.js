/**
 * Created by Hunter on 5/25/2016.
 */
var Config = Config || {}


Config.SERVER_PRIVATE = "120.138.65.103";
Config.PORT = 452;

Config.DEBUG = true;
//Config.SERVER_LOCAL = "45.76.156.167";
Config.SERVER_LOCAL = "127.0.0.1";
Config.PORT_LOCAL = 444;

Config.SERVER_LIVE = "118.102.3.15";
Config.PORT_LIVE = 443;

Config.IS_DEV = true;
Config.DEV_LOCAL = true;

var log = function(obj)
{
    cc.log(JSON.stringify(obj));
}
var vec3 = cc.math.vec3;

