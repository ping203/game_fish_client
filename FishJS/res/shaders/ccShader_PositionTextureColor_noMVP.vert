
attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;

#ifdef GL_ES
varying lowp vec4 v_fragmentColor;
varying mediump vec2 v_texCoord;
varying lowp vec4 v_FragPos;
#else
varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
varying vec4 v_FragPos;
#endif

void main()
{
    gl_Position = CC_PMatrix * a_position;
    v_fragmentColor = a_color;
    v_texCoord = a_texCoord;
    v_FragPos = gl_Position;
}

