/**
 * Created by HOANGNGUYEN on 9/7/2018.
 */

var Map = cc.Class.extend({
    ctor: function()
    {

    }
})

var MatranMap = cc.Class.extend({
    ctor: function(){
        this.listLine = [];
        this.listener = null;
        this.elapsedTime = 0;
        this.paused = true;
    },
    loadData: function(){
        var jsonData = fishData.matrixData.data;
        cc.log(jsonData.length);
        for(var i=0;i<jsonData.length;i++)
        {
            var ll = new MatranMap.Line();
            ll.delay_time = jsonData[i].delay_time;
            ll.start_time = jsonData[i].start_time;
            ll.end_time = jsonData[i].end_time;
            ll.time_xuat_hien = jsonData[i].time_xuat_hien;
            ll.so_luong = jsonData[i].so_luong;
            ll.path = new PathEntity(ll.time_xuat_hien);
            ll.fish_type = jsonData[i].fish_type;
            ll.path = jsonData[i].path;
            ll.MOC = ll.start_time;

            this.listLine.push(ll);
        }
    },
    start: function(time,startID)
    {
        cc.log("ma tran map : time :" + time +"   startID :" + startID);
        this.elapsedTime = time;
        this.startID = startID;
        var tmp = startID;
        for(var i=0;i<this.listLine.length;i++)
        {
            this.listLine[i].startID = tmp;
            if(this.elapsedTime >= this.listLine[i].start_time && this.elapsedTime <= this.listLine[i].end_time)
            {
                this.listLine[i].MOC = Math.floor((this.elapsedTime - this.listLine[i].start_time) / this.listLine[i].delay_time) ;
            }
            else
            {
                this.listLine[i].MOC = this.listLine[i].start_time;
            }

            tmp+=this.listLine[i].so_luong;
        }
        this.paused = false;
        //cc.log(JSON.stringify(this));
    },
    update: function(dt)
    {
        if(this.paused)
            return;
        this.elapsedTime += dt;
        for(var i=0;i<this.listLine.length;i++)
        {
            var ll = this.listLine[i];
            if(this.elapsedTime < ll.start_time || this.elapsedTime > ll.end_time)
                continue;
            if(this.elapsedTime >= ll.MOC)
            {
                var id = Math.floor((ll.MOC - ll.start_time) / ll.delay_time) + ll.startID;
                if(this.listener)
                    this.listener.onCreateFish(id,ll.fish_type,ll.path);
                ll.MOC += ll.delay_time;
            }
        }
    }


})

MatranMap.Line = cc.Class.extend({
    ctor: function(){
        this.fish_type = 0;
        this.start_time = 0;
        this.end_time = 0;
        this.delay_time = 0;
        this.so_luong = 0;
        this.path = null;
        this.time_xuat_hien = 0;

        //
        this.MOC = 0 ;
        this.startID = 0;
    }
})

var matranMap = new MatranMap();