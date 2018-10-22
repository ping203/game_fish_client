
//precision mediump float;
//precision mediump int;


// Uniforms
uniform mat4 u_worldViewProjectionMatrix;           // Matrix to transform a position to clip space.


// Inputs
attribute vec4 a_position;                          // Vertex Position (x, y, z, w)
attribute vec2 a_texCoord;                          // Vertex Texture Coordinate (u, v)

// Outputs
varying vec2 v_texCoord;                            // Texture coordinate (u, v).




#ifdef MAXANIMLIGHT

// Inputs
attribute vec3 a_normal;                            // Vertex Normal (x, y, z)

// Outputs
varying vec4 v_animLight;

// Uniforms
//uniform vec4 u_animLightTexRotScale1;

#endif


#include "skinned_general.h"


#ifdef MAXANIMLIGHT
void applyAnimLight( vec3 worldPos )
{
	vec2 texCoordLight = vec2(worldPos.x, worldPos.z);	
	v_animLight.xy = texCoordLight*0.02;   
    //v_animLight.xy *= u_animLightTexRotScale1.x;
       
#ifdef SKINNING_JOINT_COUNT
    vec3 normal = getTangentSpaceVector(a_normal);
#else
	vec3 normal = a_normal;
#endif
	vec4 normalVector = normalize( CC_MVPMatrix * vec4(normal, 0.0) );
    
    v_animLight.z = normalVector.y*normalVector.y*normalVector.y;
	//v_animLight.w = u_animLightTexRotScale1.w;

}
#endif
	


void main()
{

    vec4 position = getPosition();
    gl_Position = CC_MVPMatrix * position;

    
    
#ifdef MAXANIMLIGHT
	
	
	applyAnimLight( position.xyz );
	
#endif
	
	
	// Pass on the texture coordinates to Fragment shader.
    v_texCoord = a_texCoord;
}
