#ifdef GL_ES
varying mediump vec2 v_texture_coord;
#else
varying vec2 v_texture_coord;
#endif

uniform vec4 u_color;
uniform float offset;
uniform float duration;
uniform vec3 u_ambientColor;
uniform sampler2D u_sampler0; 
uniform sampler2D u_sampler1;

void main(void)
{

   vec4 s1 = texture2D(u_sampler0, v_texture_coord);
   vec4 s2 = texture2D(u_sampler1, vec2(v_texture_coord.x- 2.0 * offset,v_texture_coord.y));
   //gl_FragColor = mix(s1, vec4(s2.r, s2.g, 1, 0.5),1);
    gl_FragColor = s1+s2;
    //gl_FragColor = mix(vec4(s1.r,s1.g,s1.b,1),vec4(s2.r,s2.g,s2.b,0.2),1) * u_color;
   //vec4 texcolor = texture2D(u_sampler0,v_texture_coord);
   //vec4 texcolor2 = texture2D(u_sampler1,vec2(v_texture_coord.x - 2.0 * offset,v_texture_coord.y ));

   //gl_FragColor += texcolor2 ;

    //if(texcolor.a!=0 && texcolor2.a!=0)
      // gl_FragColor += texcolor2;
   // else gl_FragColor += texcolor;
   // vec4 color = duration*vec4(1,1,1,1.0);

        //glBindTexture(GL_TEXTURE_2D,texcolor);
    //gl_FragColor = color;
    //blend two texture
    //gl_FragColor = u_color*texture2D(u_sampler0, vec2(v_texture_coord.x- 2.0 * offset,v_texture_coord.y)) * vec4(0.3,0.3,0.3,1)+texture2D(u_sampler1,vec2(v_texture_coord.x-offset,v_texture_coord.y)).r*color;
   //gl_FragColor += (u_color* texture2D(u_sampler1,vec2(v_texture_coord.x- 2.0 * offset,v_texture_coord.y)).r*color);
}