
precision mediump float;
precision mediump int;


// Uniforms
uniform vec3 u_ambientColor;                    // Ambient color
uniform sampler2D u_diffuseTexture;             // Diffuse texture.
uniform vec4 u_diffuseColor;// = vec4(1.0,1.0,1.0,1.0);            // Diffuse color/tint


// Inputs
varying vec2 v_texCoord;                        // Texture coordinate (u, v).



// Global variables
vec4 _baseColor;                                // Base color
vec3 _ambientColor;                             // Ambient Color





#ifdef MAXANIMLIGHT



uniform sampler2D u_lightTexture;     // Diffuse texture
//uniform vec4 u_animLightIntensity;// = vec4(1.0,0.0,0.0,0.0);

#ifdef OPENGL_ES
#ifdef GL_FRAGMENT_PRECISION_HIGH
varying highp vec4 v_animLight;             // Texture coordinate (u, v).
#else
varying vec4 v_animLight;             // Texture coordinate (u, v).
#endif
#else
varying vec4 v_animLight;             // Texture coordinate (u, v).
#endif

void applyAnimLight()
{
    vec2 uv = v_animLight.xy;
    vec4 lightcolor = texture2D(u_lightTexture, uv);
	vec3 light = lightcolor.rgb*4.0;
    //light *= u_animLightIntensity.x;
	_ambientColor.rgb += _ambientColor.rgb*light*max( 0.0, v_animLight.z );
	
}   
#endif

void main()
{
    // Fetch diffuse color from texture.
    _baseColor = texture2D(u_diffuseTexture, v_texCoord);
    // Ambient
    _ambientColor = _baseColor.rgb * u_ambientColor * u_diffuseColor.rgb;
	

    
    
	#ifdef MAXANIMLIGHT
	applyAnimLight();
	#endif
	


    // Light the pixel
    gl_FragColor.a = _baseColor.a;
    
    gl_FragColor.rgb = _ambientColor;
    

    
}
