#ifdef GL_ES
varying mediump vec2 TextureCoordOut;
varying mediump vec3 v_diffuse;
varying mediump vec3 v_spec;

#else
varying vec2 TextureCoordOut;
varying vec3 v_diffuse;
varying vec3 v_spec;
#endif

uniform vec4 u_color;
uniform vec3 u_viewPosition;
uniform int u_hasShadow;

uniform sampler2D u_specularTex;
uniform sampler2D u_shadowTex;

float near = 0.1; 
float far  = 100.0; 

void main(void)
{
	vec3 objColor = texture2D(CC_Texture0, TextureCoordOut).rgb;

	vec3 diffuse = v_diffuse * objColor;
    vec3 specular = v_spec ;

	//shadow cal
	//float shadow = ShadowCalculation(v_FragPosLightSpace);

	// linear color
	vec3 linearColor = (diffuse + specular);

	gl_FragColor = vec4(linearColor,1) * u_color;

}