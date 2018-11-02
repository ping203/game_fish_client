/**
 * Created by HOANGNGUYEN on 9/6/2018.
 */

var Math = Math || {};

Math.GetPoint2DOnBezierCurve = function(p0,p1,p2,p3,t)
{
    var u = 1.0 - t;
    var t2 = t * t;
    var u2 = u * u;
    var u3 = u2 * u;
    var t3 = t2 * t;

    var xx = p0.x * u3 + p1.x * (3 * u2 * t) + p2.x * (3 * u * t2) + p3.x * t3;
    var yy = p0.y * u3 + p1.y * (3 * u2 * t) + p2.y * (3 * u * t2) + p3.y * t3;

    return vec2(xx,yy);
}

Math.RotationFromVel = function(vel)
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
    return 0;
}