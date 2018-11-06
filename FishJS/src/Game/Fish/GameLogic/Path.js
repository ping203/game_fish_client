/**
 * Created by HOANGNGUYEN on 9/6/2018.
 */

var PathChangeCurveListener = cc.Class.extend({
    onNewCurve: function(curve){

    }
})

var PathWeb = cc.Class.extend({
    ctor: function(duration)
    {
        this.duration = duration;
        this.curves = [];
        this.pointDatas = [];
        this.total_length = 0;

        this._previousPos = new Vector2(0,0);
        this._currentPos = new Vector2(0,0);

        this._currentCurve = null;
        this.pathListener = null;
    },
    setPathListener: function(lis){
        this.pathListener = lis;
    },
    addPathPoint: function(point)
    {
        var p = new Vector2(point.x,point.y);
        this.pointDatas.push(p);
    },
    calculate: function()
    {
        var size = this.pointDatas.length;
        this.total_length = 0;
        if(size < 2)
            return;

        var count = 0;
        while(true)
        {
            if((count +3) < size)
            {
                var curve = new CubicBezierCurve(new Vector2(this.pointDatas[count].x,this.pointDatas[count].y),
                    new Vector2(this.pointDatas[count + 1].x,this.pointDatas[count + 1].y),
                    new Vector2(this.pointDatas[count + 2].x,this.pointDatas[count + 2].y),
                    new Vector2(this.pointDatas[count + 3].x,this.pointDatas[count + 3].y))
                curve.length_start = this.total_length;
                this.total_length += curve.getLength();
                this.curves.push(curve);
                count += 3;
            }
            else if((count +2) < size)
            {

                var curve = new QuadraticBezierCurve(new Vector2(this.pointDatas[count].x,this.pointDatas[count].y),
                    new Vector2(this.pointDatas[count + 1].x,this.pointDatas[count + 1].y),
                    new Vector2(this.pointDatas[count + 2].x,this.pointDatas[count + 2].y))
                curve.length_start = this.total_length;
                this.total_length += curve.getLength();
                this.curves.push(curve);
                count += 2;
            }
            else if((count +1) < size)
            {

                var curve = new LineCurve(new Vector2(this.pointDatas[count].x,this.pointDatas[count].y),
                    new Vector2(this.pointDatas[count + 1].x,this.pointDatas[count + 1].y))
                curve.length_start = this.total_length;
                this.total_length += curve.getLength();
                this.curves.push(curve);
                count += 2;
            }
            else
                break;
        }

    },
    getLength: function()
    {
        if(this.total_length > 0)
            return this.total_length;
        this.calculate();
        return this.total_length;
    },
    getCurveFromPercentTimeLine: function(percent)
    {

        for(var i=0;i<this.curves.length;i++)
        {
            if(((this.curves[i].getLength() + this.curves[i].length_start) / this.total_length) >= percent)
                return this.curves[i];
        }
        return this.curves[this.curves.length-1];
    },
    getPositionFromTime: function(time)
    {
        if(this.duration == 0 || this.total_length == 0)
        {
            return this.pointDatas[this.pointDatas.length-1];
        }
        this._previousPos.set(this._currentPos.x,this._currentPos.y);
        var t = time / this.duration;
        if(t > 1) t = 1;

        var curve_choose = this.getCurveFromPercentTimeLine(t);
        if(this.pathListener && (this._currentCurve !== curve_choose))
        {
            this.pathListener.onNewCurve(curve_choose);
            this._currentCurve = curve_choose;
        }
        var curve_duration = curve_choose.getLength() * this.duration / this.total_length;

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

        var ret = curve_choose.getPointAt(tt);
        this._currentPos.set(ret.x,ret.y);
        return ret;
    },
    getCurrentAngle: function()
    {
        return this.rotationFromVel(vec2(this._currentPos.x - this._previousPos.x,this._currentPos.y-this._previousPos.y));
    },
    getCurrentAngleRad: function()
    {
        return this.rotationFromVelRad(vec2(this._currentPos.x - this._previousPos.x,this._currentPos.y-this._previousPos.y));
    },
    rotationFromVel : function(vel)
    {
        if(Math.abs(vel.y) <  0.000001)
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
    },
    rotationFromVelRad : function(vel)
    {
        if(Math.abs(vel.y) <  0.000001)
        {
            return vel.x > 0?Math.PI/2:-Math.PI/2;
        }
        else if(vel.y > 0)
        {
            return Math.atan(vel.x / vel.y) ;
        }
        else
        {
            return Math.atan(vel.x / vel.y) +Math.PI;
        }
    }
})

var PathEntity = cc.sys.isNative?engine.Path:PathWeb


