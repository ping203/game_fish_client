/**
 * Created by HOANGNGUYEN on 8/5/2015.
 */

var BCNativeBridge = function () {
}

BCNativeBridge.getRefer = function () {
    var refer = "";
    if (cc.sys.os == cc.sys.OS_ANDROID)
        refer = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getRefer", "()Ljava/lang/String;");
    return refer;
}

BCNativeBridge.openHotro = function (packagee, username) {
    cc.log("BCNativeBridge.openHotro " + packagee + "/" + username);

    if (cc.sys.os == cc.sys.OS_ANDROID)
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "openApp", "(Ljava/lang/String;Ljava/lang/String;)V", packagee, username);
}

BCNativeBridge.getDeviceID = function () {
    var ret = Config.DEVICE_ID_W32;

    if(Config.ENABLE_CHEAT) {
        if(CheatCenter.IS_FAKE_UID) {
            cc.log("_____________DEVICE__ID_CHEAT : " + CheatCenter.DEVICE_ID_FAKE);
            return CheatCenter.DEVICE_ID_FAKE;
        }
    }



    if (cc.sys.os == cc.sys.OS_ANDROID)
        ret = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getIMEI", "()Ljava/lang/String;");
    if (cc.sys.os == cc.sys.OS_IOS)
        ret = jsb.reflection.callStaticMethod("ObjCBridgle", "getIMEI");

    cc.log("_____________DEVICE__ID : " + ret);
    return ret;
}

BCNativeBridge.getDeviceModel = function () {
    var ret = "GameJS";
    if (cc.sys.os == cc.sys.OS_ANDROID)
        ret = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getPhoneModel", "()Ljava/lang/String;");
    if (cc.sys.os == cc.sys.OS_IOS)
        ret = jsb.reflection.callStaticMethod("ObjCBridgle", "getDeviceModel");
    cc.log("_____________DEVICE__MODEL : " + ret);
    return ret;
}

BCNativeBridge.getOsVersion = function () {
    var ret = "1.0";
    if (cc.sys.os == cc.sys.OS_ANDROID)
        ret = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getOsVersion", "()Ljava/lang/String;");
    else if (cc.sys.os == cc.sys.OS_IOS)
        ret = jsb.reflection.callStaticMethod("ObjCBridgle", "getOsVersion");
    cc.log("_____________OS__VERSION : " + ret);
    return ret;
}

BCNativeBridge.networkAvaiable = function () {
    var networkstatus = true;
    if (cc.sys.os == cc.sys.OS_ANDROID)
        networkstatus = jsb.reflection.callStaticMethod("gsn/zingplay/utils/NetworkUtility", "checkNetworkAvaiable", "()I") == 1;
    else if (cc.sys.os == cc.sys.OS_IOS) {
        var network = jsb.reflection.callStaticMethod("ObjCBridgle", "networkAvaiable");
        if (network === "NO") {
            networkstatus = false;
        }
    }
    return networkstatus;
}

BCNativeBridge.openWebView = function (url, https) {
    cc.log("BCNativeBridge.openWebView " + url);

    if (!https) {
        url = url.replace("https", "http");
    }
    cc.log(url);
    if (cc.sys.os == cc.sys.OS_ANDROID)
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "openURL", "(Ljava/lang/String;)V", url);
    if (cc.sys.os == cc.sys.OS_IOS)
        jsb.reflection.callStaticMethod("ObjCBridgle", "openURL:", url);
}

BCNativeBridge.openHTML = function (url) {
    cc.log("BCNativeBridge.openHTML " + url);
    if (cc.sys.os == cc.sys.OS_ANDROID)
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "openHTML", "(Ljava/lang/String;)V", url);
    else if (cc.sys.os == cc.sys.OS_IOS)
        jsb.reflection.callStaticMethod("ObjCBridgle", "openURL:", url);
    else
        BCNativeBridge.openURLNative(url);
}

BCNativeBridge.openURLNative = function (url) {
    cc.sys.openURL(url);
}

BCNativeBridge.sendSMS = function (phone, content) {
    cc.log("BCNativeBridge.sendSMS : " + phone + "/" + content);

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "sendMessage", "(Ljava/lang/String;Ljava/lang/String;)V", phone + "", content + "");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("ObjCBridgle", "sendSMS:message:",phone + "",content + "");
    }
}

BCNativeBridge.sendLogin = function (acountID, acountType, source) {
    
}

BCNativeBridge.sendLoginGSN = function (acountID, acountType, openID, zName) {
    if (cc.sys.os == cc.sys.OS_ANDROID)
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "sendLogin", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", acountID + "", acountType + "", openID + "", zName + "");
    else if (cc.sys.os == cc.sys.OS_IOS)
        jsb.reflection.callStaticMethod("ObjCBridgle", "sendLoginGSN:acountType:openID:zName:", acountID + "", acountType + "", openID + "", zName + "");
}

BCNativeBridge.sendLoginFailGSN = function (loginType,errorType,accountName,message) {
    if (cc.sys.os == cc.sys.OS_ANDROID)
    {
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "logLoginFail", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", loginType + "", errorType + "", accountName + "", message + "");
    }
    else if (cc.sys.os == cc.sys.OS_IOS)
    {

    }
}

BCNativeBridge.paymentZalo = function (user, uid, amount) {
    
}

BCNativeBridge.paymentZaloWallet = function (user, uid,itemId, amount) {

}

BCNativeBridge.vibrate = function () {
    if (!gamedata.vibrate) return;

    if (cc.sys.os == cc.sys.OS_ANDROID)
        jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "vibrate", "()V");
    else if (cc.sys.os == c.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("ObjCBridgle", "vibrate");
    }
}

BCNativeBridge.getVersionString = function () {
    var ret = "v";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        ret += jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getVersionString", "()Ljava/lang/String;");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        ret += jsb.reflection.callStaticMethod("ObjCBridgle", "getVersionString");
    }
    else {
        ret += "W32";
    }

    var jsVersion = cc.sys.localStorage.getItem(BCLocalizedString.config("KEY_JS_VERSION"));
    if(jsVersion === undefined || jsVersion == null || jsVersion == "") jsVersion = "0";

    ret += "." + gamedata.appVersion + "." + jsVersion;
    return ret;
}

BCNativeBridge.getVersionCode = function () {
    var ret = "";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        ret = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getVersionCode", "()Ljava/lang/String;");
    }
    else
    {
        ret = "1";
    }

    ret = parseInt(ret);
    if(isNaN(ret)) ret = 1;

    return ret;
}

BCNativeBridge.getTelephoneInfo = function () {
    var ret = "";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        cc.log("BCNativeBridge.getTelephoneInfo");
        ret = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getTelephoneInfo", "()Ljava/lang/String;");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        ret = jsb.reflection.callStaticMethod("ObjCBridgle", "getTelephoneInfo");
    }
    else {
        ret = 0;
    }
    return ret;
}

BCNativeBridge.openIAP = function (productIds) {
    cc.log("BCNativeBridge::openIAP " + productIds);

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("gsn/game/billing/GSNGoogleBilling", "openIAP", "(Ljava/lang/String;)V" , productIds + "");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("ObjCBridgle", "openIAP:" , productIds);
    }
}

BCNativeBridge.purchaseItem = function (itemId) {
    cc.log("BCNativeBridge::purchaseItem " + itemId);

    if(!itemId) return;

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("gsn/game/billing/GSNGoogleBilling", "purchase", "(Ljava/lang/String;)V",itemId + "");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("ObjCBridgle", "purchaseIAP:", itemId);
    }
}

BCNativeBridge.purchaseItemSuccess = function (data,signature) {
    cc.log("BCNativeBridge::purchaseItemSuccess ");

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        if(!data && !signature) return;
        jsb.reflection.callStaticMethod("gsn/game/billing/GSNGoogleBilling", "purchaseSuccess", "(Ljava/lang/String;Ljava/lang/String;)V",data + "",signature + "");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        if(!data) return;
        jsb.reflection.callStaticMethod("ObjCBridgle", "purchaseIAPSuccess:", data);
    }
}

BCNativeBridge.getPhoneNumber = function () {
    cc.log("BCNativeBridge::getPhoneNumber ");
    var ret = "";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        cc.log("BCNativeBridge.getPhoneNumber");
        ret = jsb.reflection.callStaticMethod("gsn/zingplay/utils/ZPJNI", "getPhoneNumber", "()Ljava/lang/String;");
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        //ret = jsb.reflection.callStaticMethod("ObjCBridgle", "getPhoneNumber");
    }
    else {
        ret = "";
    }
    return ret;
}