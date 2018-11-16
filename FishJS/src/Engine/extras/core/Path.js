/**
 * Created by admin on 9/6/18.
 */

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 **/

var Path = CurvePath.extend({
    ctor: function(points)
    {
        this._super();
        this.type = 'Path';

        this.currentPoint = new Vector2();

        if ( points ) {

            this.setFromPoints( points );

        }
    },
    setFromPoints: function ( points ) {

        this.moveTo( points[ 0 ].x, points[ 0 ].y );

        for ( var i = 1, l = points.length; i < l; i ++ ) {

            this.lineTo( points[ i ].x, points[ i ].y );

        }

    },

    moveTo: function ( x, y ) {

        this.currentPoint.set( x, y ); // TODO consider referencing vectors instead of copying?

    },

    lineTo: function ( x, y ) {

        var curve = new LineCurve( this.currentPoint.clone(), new Vector2( x, y ) );
        this.curves.push( curve );

        this.currentPoint.set( x, y );

    },

    quadraticCurveTo: function ( aCPx, aCPy, aX, aY ) {

        var curve = new QuadraticBezierCurve(
            this.currentPoint.clone(),
            new Vector2( aCPx, aCPy ),
            new Vector2( aX, aY )
        );

        this.curves.push( curve );

        this.currentPoint.set( aX, aY );

    },

    bezierCurveTo: function ( aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ) {

        var curve = new CubicBezierCurve(
            this.currentPoint.clone(),
            new Vector2( aCP1x, aCP1y ),
            new Vector2( aCP2x, aCP2y ),
            new Vector2( aX, aY )
        );

        this.curves.push( curve );

        this.currentPoint.set( aX, aY );

    },

    splineThru: function ( pts /*Array of Vector*/ ) {

        var npts = [ this.currentPoint.clone() ].concat( pts );

        var curve = new SplineCurve( npts );
        this.curves.push( curve );

        this.currentPoint.copy( pts[ pts.length - 1 ] );

    },

    arc: function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

        var x0 = this.currentPoint.x;
        var y0 = this.currentPoint.y;

        this.absarc( aX + x0, aY + y0, aRadius,
            aStartAngle, aEndAngle, aClockwise );

    },

    absarc: function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

        this.absellipse( aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

    },

    ellipse: function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

        var x0 = this.currentPoint.x;
        var y0 = this.currentPoint.y;

        this.absellipse( aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );

    },

    absellipse: function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

        var curve = new EllipseCurve( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );

        if ( this.curves.length > 0 ) {

            // if a previous curve is present, attempt to join
            var firstPoint = curve.getPoint( 0 );

            if ( ! firstPoint.equals( this.currentPoint ) ) {

                this.lineTo( firstPoint.x, firstPoint.y );

            }

        }

        this.curves.push( curve );

        var lastPoint = curve.getPoint( 1 );
        this.currentPoint.copy( lastPoint );

    },

    copy: function ( source ) {

        CurvePath.prototype.copy.call( this, source );

        this.currentPoint.copy( source.currentPoint );

        return this;

    },

    toJSON: function () {

        var data = CurvePath.prototype.toJSON.call( this );

        data.currentPoint = this.currentPoint.toArray();

        return data;

    },

    fromJSON: function ( json ) {

        CurvePath.prototype.fromJSON.call( this, json );

        this.currentPoint.fromArray( json.currentPoint );

        return this;

    }

})



// Vec2

var Vector2 = cc.Class.extend({

    ctor: function(x,y)
    {
        this.x = x || 0;
        this.y = y || 0;
    },
    isVector2: true,

    set: function ( x, y ) {

        this.x = x;
        this.y = y;

        return this;

    },

    setScalar: function ( scalar ) {

        this.x = scalar;
        this.y = scalar;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            default: throw new Error( 'index is out of range: ' + index );

        }

        return this;

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    clone: function () {

        return new this.constructor( this.x, this.y );

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;

    },

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;

        return this;

    },

    subScalar: function ( s ) {

        this.x -= s;
        this.y -= s;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;

    },

    multiply: function ( v ) {

        this.x *= v.x;
        this.y *= v.y;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        this.x *= scalar;
        this.y *= scalar;

        return this;

    },

    divide: function ( v ) {

        this.x /= v.x;
        this.y /= v.y;

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    applyMatrix3: function ( m ) {

        var x = this.x, y = this.y;
        var e = m.elements;

        this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
        this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

        return this;

    },

    min: function ( v ) {

        this.x = Math.min( this.x, v.x );
        this.y = Math.min( this.y, v.y );

        return this;

    },

    max: function ( v ) {

        this.x = Math.max( this.x, v.x );
        this.y = Math.max( this.y, v.y );

        return this;

    },

    clamp: function ( min, max ) {

        // assumes min < max, componentwise

        this.x = Math.max( min.x, Math.min( max.x, this.x ) );
        this.y = Math.max( min.y, Math.min( max.y, this.y ) );

        return this;

    },

    clampScalar: function () {

        var min = new Vector2();
        var max = new Vector2();

        return function clampScalar( minVal, maxVal ) {

            min.set( minVal, minVal );
            max.set( maxVal, maxVal );

            return this.clamp( min, max );

        };

    },

    clampLength: function ( min, max ) {

        var length = this.length();

        return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

    },

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y;

    },

    cross: function ( v ) {

        return this.x * v.y - this.y * v.x;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    },

    manhattanLength: function () {

        return Math.abs( this.x ) + Math.abs( this.y );

    },

    normalize: function () {

        return this.divideScalar( this.length() || 1 );

    },

    angle: function () {

        // computes the angle in radians with respect to the positive x-axis

        var angle = Math.atan2( this.y, this.x );

        if ( angle < 0 ) angle += 2 * Math.PI;

        return angle;

    },

    distanceTo: function ( v ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    },

    distanceToSquared: function ( v ) {

        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;

    },

    manhattanDistanceTo: function ( v ) {

        return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

    },

    setLength: function ( length ) {

        return this.normalize().multiplyScalar( length );

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;

        return this;

    },

    lerpVectors: function ( v1, v2, alpha ) {

        return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) );

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        this.x = array[ offset ];
        this.y = array[ offset + 1 ];

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;

        return array;

    },

    fromBufferAttribute: function ( attribute, index, offset ) {

        if ( offset !== undefined ) {

            console.warn( 'THREE.Vector2: offset has been removed from .fromBufferAttribute().' );

        }

        this.x = attribute.getX( index );
        this.y = attribute.getY( index );

        return this;

    },

    rotateAround: function ( center, angle ) {

        var c = Math.cos( angle ), s = Math.sin( angle );

        var x = this.x - center.x;
        var y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;

    }

});