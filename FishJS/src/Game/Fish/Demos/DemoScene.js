/**
 * Created by admin on 10/27/18.
 */

var DemoScene = BCBaseLayer.extend({
    ctor: function()
    {
        this._super();
        this.gameScene = new GameLayerUI();
        this.addChild(this.gameScene);
        this.gameScene.setActionListener(this);

        fishLifeCycle = new FishLifeCycle();
        fishLifeCycle.gameScene = this.gameScene;
        fishLifeCycle.players = this.gameScene.players;

        fishLifeCycle.bets = [50,100,500,1000,5000];
        fishLifeCycle.myChair = fishLifeCycle.position = 0;
        fishLifeCycle.myBetIdx = 4;

        fishLifeCycle.myPlayer = fishLifeCycle.players[fishLifeCycle.myChair];
        fishLifeCycle.myPlayer.playerData.rawData = gameData.userData;
        fishLifeCycle.myPlayer.playerData.rawData["gold"] = MONEY_DEMO;
        fishLifeCycle.myPlayer.enable(true);
        fishLifeCycle.myPlayer.updateInfo();
        fishLifeCycle.myPlayer.setIsMyPlayer(true);
        fishLifeCycle.myPlayer.setGunBet(fishLifeCycle.bets[fishLifeCycle.myBetIdx])

        this.gameLogic = new GameLogicDemo();
        this.gameLogic.setListener(this);
        this.gameLogic.reset();
    },
    onEnter: function(){
        this._super();
        this.scheduleUpdate();
        this.gameScene.startMusic();
        // this.gameScene.playerScreen();
    },
    update: function(dt){
        var fishAdd = this.gameLogic.update(dt);
        if(fishAdd != null)
        {
            for(var i=0;i<fishAdd.length;i++)
            {
                this.gameScene.addFish(fishAdd[i].id,fishAdd[i].type,fishAdd[i].pathData.listPoints,fishAdd[i].pathData.totalTime,0);
            }
            //cc.log("length :" + fishAdd.length);
        }

    },
    onStateChange: function(state){
        cc.log(" state :" + state);

        this.gameScene.gameMgr.state = state;

        if(this.gameScene.gameMgr.state != BCGameManager.STATE_MATRIX_MAP)
            matranMap.paused = true;

        if(state == BCGameManager.STATE_NORMAL_MAP){
            this.gameLogic.reset();
            this.gameScene.stateToNormalMap();
        }
        else if(state == BCGameManager.STATE_MATRIX_MAP){
            this.gameScene.stateToMatrixMap();
            matranMap.start(0,this.gameLogic.gameMap.getMatranMap().getStartID());
        }
        else if(state == BCGameManager.STATE_PREPARE){
            this.gameScene.stateToPrepare(TIME_PREPARE);
        }
    },
    // for action
    onStartShoot: function(bet,x,y){
        fishLifeCycle.myPlayer.playerData.rawData["gold"] -= bet;
        fishLifeCycle.myPlayer.updateInfo();
    },
    onShootFish: function(bet,fish_id){
        var result = this.gameLogic.shoot(fish_id,bet);
        if(result && result.success)
        {
            var fish = this.gameScene.gameMgr.getFishByID(fish_id)
            if(fish)
            {
                var fishSp = fish.getNodeDisplay();
                fish.setNodeDisplay(null);


                this.gameScene.createEffectFishDie(fishSp,result.won_money,0,fish.fishType > 10);
                this.gameScene.gameMgr.destroyEntity(fish);

                fishLifeCycle.myPlayer.playerData.rawData["gold"] += result.won_money;
                fishLifeCycle.myPlayer.updateInfo();


                fishSound.playEffectFishDie(fish.id);
            }
        }
    }
})


var MapReader = cc.Class.extend({
    ctor: function(){
        this.jsonDataMapThuong = null;
        this.jsonDataMatrixMap = null;


        this.listFishMapThuong = {};
        this.listLineInMatrix = [];

        this.readConfigNormalMap()
        this.readConfigMatrixMap();
    },
    readConfigNormalMap : function(){
        this.jsonDataMapThuong = cc.loader.getRes("res/fishes_banthuong.json");
    },
    readConfigMatrixMap : function(){
        this.jsonDataMatrixMap = cc.loader.getRes("res/fishes_matran.json");

        var arr = this.jsonDataMapThuong["data"];
        for(var i=0;i<arr.length;i++){
            this.listFishMapThuong["" + arr[i]["type"]] = arr[i];
        }
    }

})

var pMapReaderInstance = null;
MapReader.getInstance = function(){
    if(pMapReaderInstance == null)
        pMapReaderInstance = new MapReader();
    return pMapReaderInstance;
}

var FishLineInMatrixDataReader = cc.Class.extend({
    ctor: function(){
        this.type = 0;
        this.name = "";
        this.so_luong = 0;
        this.time_start = 0;
        this.time_end = 0;
        this.time_xuat_hien = 0;
        this.time_delta = 0;


        this.path = null;
    }
})

var FishInMapDataReader = cc.Class.extend({
    ctor: function(){
        this.type = 0;
        this.name = "";
        this.ti_le_ban = [];
        this.ti_le_an = [];
        this.so_luong = [];
        this.paths = [];

        this.time_start = 0;
        this.time_end = 0;

        this.time_xuat_hien = 0;
    }
})

var FishRealData = cc.Class.extend({        // moi~ lan resetmap , thi realdata cua ca se dc tinh lai
    ctor: function(){
        this.type = 0;
        this.name = "";
        this.ti_le_ban = 10;            // phan tram
        this.ti_le_an = 1;
        this.so_luong = 2;

        this.time_start = 0;
        this.time_end = 0;

        this.time_xuat_hien = 0;
    }
})

var PathData = cc.Class.extend({
    ctor: function(){
        this.elapsedTime = 0;
        this.totalTime = 10;
        this.using_constant_vel = true;
        this.listPoints = [];
    }
})

var MAX_PATH = 14;
var PathReader = cc.Class.extend({
    ctor: function(){
        this.jsonDataPathNormals = cc.loader.getRes("res/Path_normals.json");
    },
    getNormalPath: function(id){
        var path_id = id;
        if(path_id < 1 )
            path_id = 1;
        else if(path_id > MAX_PATH)
            path_id = MAX_PATH;

        var obj = this.jsonDataPathNormals["P_N_"+path_id];
        var ret = new PathData();
        if(!obj["data"])
            return null;

        for(var i=0;i<obj["data"].length;i++){
            if(obj["data"][i]["r_1"] && obj["data"][i]["r_2"])
            {
                var x = Math.min(obj["data"][i]["r_1"]["x"],obj["data"][i]["r_2"]["x"]) + Math.abs(obj["data"][i]["r_1"]["x"]-obj["data"][i]["r_2"]["x"]) * Math.random();
                var y = Math.min(obj["data"][i]["r_1"]["y"],obj["data"][i]["r_2"]["y"]) + Math.abs(obj["data"][i]["r_1"]["y"]-obj["data"][i]["r_2"]["y"]) * Math.random();
                ret.listPoints.push(vec2(x,y))
            }
            else
            {
                ret.listPoints.push(vec2(obj["data"][i]["x"],obj["data"][i]["y"]));

            }
        }
        return ret;
    },
    getListPointAtPathID: function(id){
        var obj = this.jsonDataPathNormals["P_N_"+id];
        var ret = [];
        if(!obj["data"])
            return [];

        for(var i=0;i<obj["data"].length;i++){
            if(obj["data"][i]["r_1"] && obj["data"][i]["r_2"])
            {
                var x = Math.min(obj["data"][i]["r_1"]["x"],obj["data"][i]["r_2"]["x"]) + Math.abs(obj["data"][i]["r_1"]["x"]-obj["data"][i]["r_2"]["x"]) * Math.random();
                var y = Math.min(obj["data"][i]["r_1"]["y"],obj["data"][i]["r_2"]["y"]) + Math.abs(obj["data"][i]["r_1"]["y"]-obj["data"][i]["r_2"]["y"]) * Math.random();
                ret.push(vec2(x,y))
            }
            else
            {
                ret.push(vec2(obj["data"][i]["x"],obj["data"][i]["y"]));

            }
        }
        return ret;
    }
})

var pReaderInstance = null;
PathReader.getInstance = function(){
    if(pReaderInstance == null)
        pReaderInstance = new PathReader();
    return pReaderInstance;
}


// Logic for Demo


// for Matran ca'
var MatrixMap = cc.Class.extend({
    ctor: function(){
        this.listRemoved = {};
        this.listLineMatrix = [];

        this.startID = 0;
        this.total_fish = 0;


        var jsonMatrixReader = MapReader.getInstance().jsonDataMatrixMap;

        for(var i=0;i<jsonMatrixReader["data"].length;i++){
            var ll = new LineMatrix();
            ll.lineData = jsonMatrixReader["data"][i];
            this.total_fish += ll.lineData["so_luong"];
            ll.fishDataReader = MapReader.getInstance().listFishMapThuong[ll.lineData["fish_type"]];

            ll.fishRealData = new FishRealData();
            ll.fishRealData.type = ll.lineData["fish_type"];

            this.listLineMatrix.push(ll);
        }
    },
    setStartID: function(id){
        this.startID = id;
    },
    getStartID: function(){
        return this.startID;
    },
    getMapData: function(){
        return this.listLineMatrix;
    },
    resetMap: function(){
        this.listRemoved = [];
        for(var i=0;i<this.listLineMatrix.length;i++){
            var real = this.listLineMatrix[i].fishRealData;
            var reader = this.listLineMatrix[i].fishDataReader;

            real.ti_le_an = 1;
            if(reader.ti_le_an.length == 1)
            {
                real.ti_le_an = reader.ti_le_an[0];
            }
            else if(reader.ti_le_an.length > 1){
                real.ti_le_an = reader.ti_le_an[0] + (reader.ti_le_an[1] - reader.ti_le_an[0]) * Math.random();
            }

            real.ti_le_ban = 1;
            if(reader.ti_le_ban.length == 1)
            {
                real.ti_le_ban = reader.ti_le_ban[0];
            }
            else if(reader.ti_le_ban.length > 1){
                real.ti_le_ban = reader.ti_le_ban[0] + (reader.ti_le_ban[1] - reader.ti_le_ban[0]) * Math.random();
            }
        }
    },
    addFishToRemovedList: function(id) {
        if(!this.listRemoved[""+id])
            this.listRemoved[""+id] = {};
        else {
            cc.log(" fish :" + id +" da co trong list remove");
        }
    },
    // check xem con ca' nay con` ton tai hay da bi ban
    isFishAvaiable: function(fish_id) {
        if(this.listRemoved[""+(fish_id)] ) {      // da bi ban'
            return false;
        }
        return (fish_id >= this.startID && fish_id < (this.startID+this.total_fish));
    },

    getFishByID: function(id) {

        var count = this.startID;
        for(var i=0;i<this.listLineMatrix.length;i++){
            count += this.listLineMatrix[i].lineData.so_luong;
            if(count > id)
                return this.listLineMatrix[i].fishRealData;
        }
        return null;
    }
})

var LineMatrix = cc.Class.extend({
    ctor: function(){
        this.lineData = null;               // thong tin chi tiet cua Line
        this.fishRealData = null;           // thong tin chi tiet cua ca' trong Line
        this.fishDataReader = null;         // reader luu lai de tinh random

    }
})

// end matran ca'


var FishGenerator = cc.Class.extend({
    ctor: function(){

        this.type = -1;

        this.fishDataReader = null;
        this.fishDataReal = null;

        this.count_fish = 0;
        this.time_elapsed = 0;
        this.delta_time = 0;        // thoi gian ca tiep theo xuat hien

        this.MOC = 0;
    },
    calculateParam: function(){
        this.time_elapsed  = 0;
        if(this.fishDataReal.so_luong > 0)
        {
            this.delta_time = (this.fishDataReal.time_end - this.fishDataReal.time_start) / this.fishDataReal.so_luong;
        }
        this.MOC = this.fishDataReal.time_start + 0.5;
    },

    update: function(dt) {
        if(this.count_fish > this.fishDataReal.so_luong)
            return false;
        this.time_elapsed += dt;
        if(this.time_elapsed > this.MOC) {
            this.MOC += this.delta_time;
            this.count_fish++;
            return true;
        }
        else
            return false;
    }
})


var MapDemo = cc.Class.extend({
    ctor: function(){
        var jsonDataMapReader = MapReader.getInstance().jsonDataMapThuong;


        this.listFishGenerator = [];
        for(var i=0;i<jsonDataMapReader["data"].length;i++){
            var fGenerator = new FishGenerator();
            fGenerator.type = jsonDataMapReader["data"][i]["type"];
            fGenerator.fishDataReader = jsonDataMapReader["data"][i];
            fGenerator.fishDataReal = new FishRealData();

            this.listFishGenerator.push(fGenerator);
        }

        this.matrixMap = new MatrixMap();

        this.bossTypeDuocChon = 26;

    },
    resetMap: function(){
        for(var i=0;i<this.listFishGenerator.length;i++){
            this.listFishGenerator[i].count_fish = 0;
            this.listFishGenerator[i].time_elapsed = 0;

            var real = this.listFishGenerator[i].fishDataReal;
            var reader = this.listFishGenerator[i].fishDataReader;

            real.name = reader.name;
            real.time_start = reader.time_start;
            real.time_end = reader.time_end;
            real.time_xuat_hien = reader.time_xuat_hien;

            real.so_luong = 1;
            if(reader.so_luong.length == 1)
            {
                real.so_luong = reader.so_luong[0];
            }
            else if(reader.so_luong.length > 1){
                real.so_luong = reader.so_luong[0] + Math.floor((reader.so_luong[1] - reader.so_luong[0]) * Math.random());
            }

            real.ti_le_an = 1;
            if(reader.ti_le_an.length == 1)
            {
                real.ti_le_an = reader.ti_le_an[0];
            }
            else if(reader.ti_le_an.length > 1){
                real.ti_le_an = reader.ti_le_an[0] + (reader.ti_le_an[1] - reader.ti_le_an[0]) * Math.random();
            }

            real.ti_le_ban = 1;
            if(reader.ti_le_ban.length == 1)
            {
                real.ti_le_ban = reader.ti_le_ban[0];
            }
            else if(reader.ti_le_ban.length > 1){
                real.ti_le_ban = reader.ti_le_ban[0] + (reader.ti_le_ban[1] - reader.ti_le_ban[0]) * Math.random();
            }

            this.listFishGenerator[i].calculateParam();


        }
        this.matrixMap.resetMap();

        this.bossTypeDuocChon = 26 + Math.floor(Math.random() * 3);
        if(this.bossTypeDuocChon > 28)
            this.bossTypeDuocChon = 28;
    },
    /*get matran map*/

    getMatranMap: function(){
        return this.matrixMap;
    },
    /*Tao list fish trong normal map*/
    generateFish: function(dt) {
    var listFishGenerated = [];

        for(var i=0;i<this.listFishGenerator.length;i++){
            var fg = this.listFishGenerator[i];
            if(fg.type >= 26 && (fg.type != this.bossTypeDuocChon))
                continue;
            if(fg.update(dt)) {
                var f = new FishLogic();
                f.type = fg.type;

                f.pathData = this.createPathData(fg.fishDataReader,fg.fishDataReal, f.type >= 26);
                f.fishRealData = fg.fishDataReal;
                listFishGenerated.push(f);
            }
        }
    return listFishGenerated;
    },
    createPathData: function(fishDataReader,fishDataReal,isBoss){
        var size = fishDataReader["paths"].length;
        var rr = Math.floor(Math.random() * size);if(rr >= size)rr = size-1;
        if(!isBoss )      // neu ca ko phai boss 26 27 28 thi` moi~ path data chi co 1 curve,
       {
           var ret = PathReader.getInstance().getNormalPath(fishDataReader["paths"][rr]);
           ret.totalTime = fishDataReal.time_xuat_hien + 4;
           return ret;
       }
       else
       {
           var listPath = fishDataReader["paths_boss"][rr];
           var ret = new PathData();
           for(var i=0;i<listPath.length;i++){
               var points = PathReader.getInstance().getListPointAtPathID(listPath[i]);
               cc.log(JSON.stringify(points));
               for(var j=0;j<points.length;j++){
                   ret.listPoints.push(points[j]);
               }
           }
           ret.totalTime = fishDataReal.time_xuat_hien;
           return ret;
       }

    }

})

var FishLogic = cc.Class.extend({
    ctor: function(){
        this.id = -1;
        this.type = 0;
        this.pathData = null;
        this.fishRealData = null;
    }
})

var GameLogicDemo = cc.Class.extend({
    ctor: function(){
        this.gameMap = new MapDemo();
        this.need_removes = [];
        this.count_id = 0;
        this.time = 0;

        this.listFishes = {};       // current fish in map

        this.state = BCGameManager.STATE_NORMAL_MAP;


        this.listenner = null;
    },
    setListener: function(lis){
        this.listenner = lis;
    },
    update: function(dt) {

        if(this.state == BCGameManager.STATE_NORMAL_MAP) {
            this.time += dt;
            if(this.time >= TIME_NORMAL_MAP) {
                this.state = BCGameManager.STATE_PREPARE;
                this.time = 0;
                this.listFishes = [];
                if(this.listenner != null) {
                    this.listenner.onStateChange(this.state);
                }
            }
            else {
                return this.updateForNormalMap(dt);
            }

        }
        if(this.state == BCGameManager.STATE_PREPARE) {
            this.time += dt;
            if(this.time >= TIME_PREPARE) {
                this.state = BCGameManager.STATE_MATRIX_MAP;
                this.time = 0;

                this.gameMap.getMatranMap().setStartID(++this.count);
                if(this.listenner != null) {
                    this.listenner.onStateChange(this.state);
                }
            }
        }
        if(this.state == BCGameManager.STATE_MATRIX_MAP) {
            this.time += dt;
            if(this.time >= TIME_MATRAN_MAP) {
                this.state = BCGameManager.STATE_NORMAL_MAP;
                this.time = 0;
                if(this.listenner != null) {
                    this.listenner.onStateChange(this.state);        // luc nay se send thong tin cua ma tran ca' ve
                }
            }
            else {

            }
        }
        return null;
    },
    getCurrentFish: function() {
        var tmpListFish = [];
        for(var key in this.listFishes) {
            var ff = this.listFishes[key];
            tmpListFish.add(ff);
        }
        return tmpListFish;
    },

     updateForNormalMap: function(dt) {
        // iter cho list fish hien tai
        var need_removes = [];
        for(var entry in this.listFishes) {
            var ff = this.listFishes[entry];
            ff.pathData.elapsedTime += dt;

            if(ff.pathData.elapsedTime > ff.pathData.totalTime) {
                need_removes.push(entry);
            }
        }
        // remove fish da~ chay het time
        for(var i=0;i<need_removes.length;i++) {
            delete this.listFishes[need_removes[i]];
        }
        // add fish moi'
        var fss = this.gameMap.generateFish(dt);
        for(var i=0;i<fss.length;i++) {
            this.addFish(fss[i]);
        }
        return fss;
    },
    addFish: function(f) {
        if(this.listFishes[""+(this.count+1)]) {
            return;
        }
        f.id = ++this.count;
        this.listFishes[""+this.count] =  f;
    },

    getFish: function(id) {
        return this.listFishes[""+id];
    },

    removeFish: function(id) {
        if(this.listFishes[""+(id)]) {
            delete this.listFishes[""+(id)];
        }
    },


    shoot: function(id,bet) {
        var result = new ShootResult();
        if(this.state == BCGameManager.STATE_NORMAL_MAP) {
            var f = this.getFish(id);
            if(f) {
                result.success = this.shootTest(f.fishRealData.ti_le_ban / 100.0);
                //result.success = true;
                if(result.success) {
                    result.won_money = Math.floor(f.fishRealData.ti_le_an * bet);
                    this.removeFish(id);                                             // remove khoi list fish hien tai
                }
            }
            return result;
        }
        else if(this.state == BCGameManager.STATE_MATRIX_MAP) {
            result.success = true;
            result.won_money = 0;

            if(this.gameMap.getMatranMap().isFishAvaiable(id)) {
                var fishDat = this.gameMap.getMatranMap().getFishByID(id);
                result.success = this.shootTest(fishDat.ti_le_ban / 100.0);
                if(result.success) {
                    result.won_money = Math.floor( fishDat.ti_le_an * bet);
                    this.gameMap.getMatranMap().addFishToRemovedList(id);
                }
            }


            return result;
        }

    return null;

    },
    shootTest: function(percent) {
        var test = Math.random();
        return test <= percent * 2.0;
    //        return true;
    },


    reset: function(){
        this.count = 0;
        this.listFishes = {};
        this.gameMap.resetMap();             // gen lai Map thuong`
        this.state = BCGameManager.STATE_NORMAL_MAP;
    }
})


var ShootResult = cc.Class.extend({
    ctor: function(){
        this.success = false;
        this.won_money = 0;
    }
})
