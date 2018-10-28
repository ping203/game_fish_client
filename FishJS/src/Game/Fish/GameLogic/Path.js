/**
 * Created by HOANGNGUYEN on 9/6/2018.
 */

var PathWeb = cc.Class.extend({
    ctor: function(duration)
    {
        this.duration = duration;
        this.curves = [];
        this.pointDatas = [];
        cc.log(duration)
    },
    addPathPoint: function(point)
    {
        var p = new Vector2(point.x,point.y);
        //cc.log(JSON.stringify(p))
        this.pointDatas.push(p);
    },
    calculate: function()
    {
        this.addPathData(this.pointDatas);
    },
    addPathData: function(datas)
    {
        this.datas = datas;
        if(datas.length < 2)
        {
            cc.log("ERROR : Path length need > 2");
        }
        else if(datas.length == 2)
        {
            var new_1 = new Vector2((datas[0].x + datas[1].x) / 3,(datas[0].y + datas[1].y) / 3);
            var new_2 = new Vector2((datas[0].x + datas[1].x) * 2 / 3,(datas[0].y + datas[1].y) * 2 / 3);

            datas.splice(1,0,new_2);
            datas.splice(1,0,new_1);

            var curve = new CubicBezierCurve(datas[0],datas[1],datas[2],datas[3]);
            curve.length = curve.getLength();
            this.curves.push(curve);
        }
        else if(datas.length < 4)
        {
            //cc.log("ERROR : Path length need == 2 or >= 4");
            var new_1 = new Vector2((datas[0].x + datas[1].x) / 3,(datas[0].y + datas[1].y) / 3);
            var new_2 = new Vector2((datas[0].x + datas[1].x) * 2 / 3,(datas[0].y + datas[1].y) * 2 / 3);

            datas.splice(1,0,new_2);
            datas.splice(1,0,new_1);

            var curve = new CubicBezierCurve(datas[0],datas[1],datas[2],datas[3]);
            curve.length = curve.getLength();
            this.curves.push(curve);
        }
        else
        {
            var count = 1;
            while((count + 2) < datas.length)
            {
                var curve = new CubicBezierCurve(datas[count-1],datas[count],datas[count+1],datas[count+2]);
                curve.length = curve.getLength();
                this.curves.push(curve);
                count += 3;
            }
        }

        this.total_length = this.getLength();
    },
    getLength: function()
    {
        var length = 0;
        for(var i = 0;i<this.curves.length;i++)
        {
            this.curves[i].length_start = length;
            length += this.curves[i].length;

        }
        return length;
    },
    getCurveFromPercentTimeLine: function(percent)
    {

        for(var i=0;i<this.curves.length;i++)
        {
            if(((this.curves[i].length + this.curves[i].length_start) / this.total_length) >= percent)
                return this.curves[i];
        }
        return this.curves[this.curves.length-1];
    },
    getPositionFromTime: function(time)
    {
        if(this.duration == 0)
        {
            return this.datas[this.datas.length-1];
        }
        var t = time / this.duration;
        if(t > 1) t = 1;

        var curve_choose = this.getCurveFromPercentTimeLine(t);
        var curve_duration = curve_choose.length * this.duration / this.total_length;


        var curve_start_time = curve_choose.length_start * this.duration / this.total_length;
        var curve_end_time = curve_duration + curve_start_time;

        var tt = 0;
        if(time > curve_end_time)
            tt = 1;
        else if(time <= curve_start_time)
            tt = 0;
        else
        {
            tt = (time - curve_start_time) / curve_duration;
        }

        return curve_choose.getPointAt(tt);
        //return Math.GetPoint2DOnBezierCurve(this.datas[0],this.datas[1],this.datas[2],this.datas[3],t);
    },
    getPositionAndAngleFromTime: function(time)     // position la cua screen pos, ko phair box2d pos
    {
        var ret = {};
        ret.position = this.getPositionFromTime(time);

        if(this.lastPosition == undefined)
        {
            ret.angle = 90;
        }
        else
        {
            ret.angle = this.rotationFromVel(vec2(ret.position.x - this.lastPosition.x,ret.position.y - this.lastPosition.y));
        }
        this.lastPosition = ret.position;
        return ret;
    },
    rotationFromVel : function(vel)
    {
        if(vel.y == 0)
        {
            return vel.x > 0?90:-90;
        }
        else if(vel.y > 0)
        {
            return Math.atan(vel.x / vel.y) * 180 / 3.14;
        }
        else
        {
            return Math.atan(vel.x / vel.y) * 180 / 3.14 + 180;
        }
    }
})

var PathEntity = cc.sys.isNative?engine.Path:PathWeb


