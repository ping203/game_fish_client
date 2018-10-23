#ifdef GL_ES
varying mediump vec2 TextureCoordOut;
varying mediump vec4 v_Color;
varying mediump vec3 v_Spec;

varying lowp vec4 v_FragPosLightSpace;
#else
varying vec2 TextureCoordOut;
varying vec4 v_Color;
varying vec3 v_Spec;
varying vec4 v_FragPosLightSpace;
#endif

varying vec3 v_FragPos;
varying vec3 v_normal;

uniform vec4 u_color;
uniform sampler2D u_specularTex;
uniform sampler2D u_shadowTex;
uniform int u_hasShadow;

uniform vec3 light_position;

float ShadowCalculation(vec4 fragPosLightSpace)
{
    // perform perspective divide
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // transform to [0,1] range
    projCoords = projCoords * 0.5 + 0.5;
    // get closest depth value from light's perspective (using [0,1] range fragPosLight as coords)
    float closestDepth = texture2D(u_shadowTex, projCoords.xy).r;
    // get depth of current fragment from light's perspective
    float currentDepth = projCoords.z;
    // calculate bias (based on depth map resolution and slope)
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(light_position - v_FragPos);
    float bias = max(0.05 * (1.0 - dot(normal, lightDir)), 0.005);
    // check whether current frag pos is in shadow
    float shadow = currentDepth - bias > closestDepth  ? 1.0 : 0.0;
    // PCF
    shadow = 0.0;
	float s = 1.0 / 1024.0;
    vec2 texelSize = vec2(s , s) ;
    for(int x = -1; x <= 1; ++x)
    {
        for(int y = -1; y <= 1; ++y)
        {
            float pcfDepth = texture2D(u_shadowTex, projCoords.xy + vec2(x, y) * texelSize).r;
            shadow += currentDepth - bias > pcfDepth  ? 1.0 : 0.0;
        }
    }
    shadow /= 9.0;

    // keep the shadow at 0.0 when outside the far_plane region of the light's frustum.
    if(projCoords.z > 1.0)
        shadow = 0.0;

    return shadow;
}


void main(void)
{
    //shadow cal
    float shadow = (u_hasShadow>0)? ShadowCalculation(v_FragPosLightSpace):0.0;

    vec3 objColor = texture2D(CC_Texture0, TextureCoordOut).rgb ;
    //vec3 specularColor = texture2D(u_specularTex, TextureCoordOut).rgb;

	gl_FragColor = ( vec4((1.0 - shadow) * objColor,1.0)  + vec4(v_Spec * 0.0,1))  * u_color;

}