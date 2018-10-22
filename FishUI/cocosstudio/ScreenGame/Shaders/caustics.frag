#ifdef GL_ES
varying mediump vec2 TextureCoordOut;
#else
varying vec2 TextureCoordOut;
#endif
varying vec3 v_normal;
uniform vec4 u_color;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform float offsetX;
uniform float offsetY;

void main(void)
{
    vec3 light_direction = vec3(0.0,1.0,1.0);
    vec3 light_color = vec3(1.0,1.0,1.0);
    float diffuse_factor = dot(v_normal, light_direction);
    vec4 diffuse_color = texture2D(u_sampler1, vec2(TextureCoordOut.x-offsetX, TextureCoordOut.y - offsetY));

    if (diffuse_factor > 0.95)      diffuse_factor=1.0;
    else if (diffuse_factor > 0.65) diffuse_factor = 0.7;
    else if (diffuse_factor > 0.50) diffuse_factor = 0.3;
    else                       diffuse_factor = 0.0;

    light_color = light_color *diffuse_factor;
    gl_FragColor = (texture2D(u_sampler0, TextureCoordOut) + ((texture2D(u_sampler0, TextureCoordOut) *vec4(light_color,1.0)) *diffuse_color))*u_color;
    //gl_FragColor = (texture2D(u_sampler0, TextureCoordOut) + ((texture2D(u_sampler0, TextureCoordOut)*vec4(0.2, 0.2, 0.2, 0.2) + vec4(light_color,1.0)*vec4(0.8, 0.8, 0.8, 0.8))* diffuse_color))*u_color;
}