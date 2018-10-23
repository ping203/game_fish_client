attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_blendWeight;
attribute vec4 a_blendIndex;
attribute vec3 a_tangent;
attribute vec3 a_binormal;
attribute vec2 a_texCoord;

const int SKINNING_JOINT_COUNT = 60;
// Uniforms
uniform vec4 u_matrixPalette[SKINNING_JOINT_COUNT * 3];

uniform mat4 u_MMatrix;
uniform mat4 u_LightMatrix;

uniform int u_hasSkin;
uniform int u_hasShadow;

uniform vec3 material_specular;
uniform float material_shininess;

uniform vec3 light_position;
uniform vec3 light_intensities;
uniform float light_ambient_coefficient;

uniform vec4 u_color;
uniform vec3 u_viewPosition;

uniform sampler2D u_specularTex;
uniform sampler2D u_shadowTex;



// Varyings
varying vec2 TextureCoordOut;
varying vec4 v_Color;
varying vec3 v_Spec;
varying vec4 v_FragPosLightSpace;
varying vec3 v_FragPos;
varying vec3 v_normal;

vec4 getPosition()
{
    float blendWeight = a_blendWeight[0];

    int matrixIndex = int (a_blendIndex[0]) * 3;
    vec4 matrixPalette1 = u_matrixPalette[matrixIndex] * blendWeight;
    vec4 matrixPalette2 = u_matrixPalette[matrixIndex + 1] * blendWeight;
    vec4 matrixPalette3 = u_matrixPalette[matrixIndex + 2] * blendWeight;
    
    
    blendWeight = a_blendWeight[1];
    if (blendWeight > 0.0)
    {
        matrixIndex = int(a_blendIndex[1]) * 3;
        matrixPalette1 += u_matrixPalette[matrixIndex] * blendWeight;
        matrixPalette2 += u_matrixPalette[matrixIndex + 1] * blendWeight;
        matrixPalette3 += u_matrixPalette[matrixIndex + 2] * blendWeight;
        
        blendWeight = a_blendWeight[2];
        if (blendWeight > 0.0)
        {
            matrixIndex = int(a_blendIndex[2]) * 3;
            matrixPalette1 += u_matrixPalette[matrixIndex] * blendWeight;
            matrixPalette2 += u_matrixPalette[matrixIndex + 1] * blendWeight;
            matrixPalette3 += u_matrixPalette[matrixIndex + 2] * blendWeight;
            
            blendWeight = a_blendWeight[3];
            if (blendWeight > 0.0)
            {
                matrixIndex = int(a_blendIndex[3]) * 3;
                matrixPalette1 += u_matrixPalette[matrixIndex] * blendWeight;
                matrixPalette2 += u_matrixPalette[matrixIndex + 1] * blendWeight;
                matrixPalette3 += u_matrixPalette[matrixIndex + 2] * blendWeight;
            }
        }
    }

    vec4 _skinnedPosition;
    vec4 position = vec4(a_position, 1.0);
    _skinnedPosition.x = dot(position, matrixPalette1);
    _skinnedPosition.y = dot(position, matrixPalette2);
    _skinnedPosition.z = dot(position, matrixPalette3);
    _skinnedPosition.w = position.w;
    
    return _skinnedPosition;
}


void main()
{
	vec4 position = u_hasSkin>0?getPosition():vec4(a_position,1);
	v_FragPos = vec3(CC_MVMatrix * position);
	vec3 normal_ = CC_NormalMatrix * a_normal;
	v_normal = normal_;

	gl_Position = CC_PMatrix * vec4(v_FragPos,1);

	TextureCoordOut = a_texCoord;
    TextureCoordOut.y = 1.0 - TextureCoordOut.y;

    //calculate light
    vec3 lightDir = normalize(light_position - v_FragPos);
    vec3 viewDir = normalize(u_viewPosition - v_FragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    vec3 norm = normalize(normal_);

    float distance = length(light_position - v_FragPos);
    float attenuation = 1.0 / (1.0 + 0.002 * distance + 0.0052 * distance * distance);

    //ambient
    vec3 ambient = light_ambient_coefficient * light_intensities ;

    // diffuse
    float diffCoefficient = max(dot(lightDir,norm),0.0);
    vec3 diffuse = diffCoefficient  * light_intensities * attenuation;

    //specular
    vec3 reflectDir = normalize(reflect(-lightDir,norm));
    float specCoefficient = pow(max(dot(norm,halfwayDir),0.0),material_shininess);
    v_Spec = specCoefficient * light_intensities  * material_specular * attenuation;

    // linear color
    v_Color = vec4(ambient + diffuse,1.0);

    v_FragPosLightSpace = u_LightMatrix * vec4(vec3(u_MMatrix * position),1.0);
}