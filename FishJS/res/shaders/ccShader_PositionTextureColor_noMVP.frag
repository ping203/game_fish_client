
#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
varying vec4 v_FragPos;

float newPos(float xx)
{
    return xx + (xx - 0.5) * 0.0;
}

void main()
{
    vec2 tex_new = vec2(newPos(v_texCoord.x),newPos(v_texCoord.y));
    vec4 objColor = texture2D(CC_Texture0, tex_new);
    vec4 obj2 = texture2D(CC_Texture0, vec2(tex_new.x - 0.002,tex_new.y - 0.002));

    float alpha = 1.0 - objColor.w;
    vec4 ret = vec4(0.9 * obj2.w * alpha,0.9* obj2.w * alpha,0.9 * obj2.w * alpha,obj2.w * 0.75);

    gl_FragColor = v_fragmentColor * (objColor + ret) ;

}


