/**
 * Created by admin on 10/27/18.
 */

var DemoScene = BaseLayer.extend({
    ctor: function()
    {
        this._super();
        this.gameScene = new GameLayerUI();
        this.addChild(this.gameScene);

        this.gameLogic = new GameLogicDemo();
        this.gameLogic.setListener(this);
        this.gameLogic.reset();
    },
    onEnter: function(){
        this._super();
        this.scheduleUpdate();
    },
    update: function(dt){
        var fishAdd = this.gameLogic.update(dt);

        for(var i=0;i<fishAdd.length;i++)
        {
            this.gameScene.addFish(fishAdd[i].id,fishAdd[i].type,fishAdd[i].pathData.listPoints,fishAdd[i].fishRealData.time_xuat_hien,0);
        }
        //cc.log("length :" + fishAdd.length);
    },
    onStateChange: function(state){
        cc.log(" state :" + state);
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
            if(fg.update(dt)) {
                var f = new FishLogic();
                f.type = fg.type;
                var size = fg.fishDataReader["paths"].length;
                var rr = Math.floor(Math.random() * size);if(rr >= size)rr = size-1;

                f.pathData  = PathReader.getInstance().getNormalPath(fg.fishDataReader["paths"][rr]);
                f.pathData.totalTime = fg.fishDataReal.time_xuat_hien + 4;
                f.fishRealData = fg.fishDataReal;
                listFishGenerated.push(f);
            }
        }
    return listFishGenerated;
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

        this.state = GameManager.STATE_NORMAL_MAP;


        this.listenner = null;
    },
    setListener: function(lis){
        this.listenner = lis;
    },
    update: function(dt) {

        if(this.state == GameManager.STATE_NORMAL_MAP) {
            this.time += dt;
            if(this.time >= TIME_NORMAL_MAP) {
                this.state = GameManager.STATE_PREPARE;
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
        if(this.state == GameManager.STATE_PREPARE) {
            this.time += dt;
            if(this.time >= TIME_PREPARE) {
                this.state = GameManager.STATE_MATRIX_MAP;
                this.time = 0;

                this.gameMap.getMatranMap().setStartID(++this.count);
                if(this.listenner != null) {
                    this.listenner.onStateChange(this.state);
                }
            }
        }
        if(this.state == GameManager.STATE_MATRIX_MAP) {
            this.time += dt;
            if(this.time >= TIME_MATRAN_MAP) {
                this.state = GameManager.STATE_NORMAL_MAP;
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
        if(this.listFishes[""+(this.count)]) {
            delete this.listFishes[""+(this.count)];
        }
    },


    shoot: function(id,bet) {
        var result = new ShootResult();
        if(this.state == GameManager.STATE_NORMAL_MAP) {
            var f = this.getFish(id);
            if(f) {
                result.success = this.shootTest(f.fishRealData.ti_le_ban / 100.0);
                if(result.success) {
                    result.won_money = Math.floor(f.fishRealData.ti_le_an * bet);
                    this.removeFish(id);                                             // remove khoi list fish hien tai
                }
            }
            return result;
        }
        else if(this.state == GameScene.STATE_MATRIX_MAP) {
            result.success = false;
            result.won_money = 0;

            if(this.gameMap.getMatranMap().isFishAvaiable(id)) {
                var fishDat = this.gameMap.getMatranMap().getFishByID(id);
                result.success = true;
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
        return test <= percent;
    //        return true;
    },


    reset: function(){
        this.count = 0;
        this.listFishes = {};
        this.gameMap.resetMap();             // gen lai Map thuong`
        this.state = GameManager.STATE_NORMAL_MAP;
    }
})


var ShootResult = cc.Class.extend({
    ctor: function(){
        this.success = false;
        this.won_money = 0;
    }
})
