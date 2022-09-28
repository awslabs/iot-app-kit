/**
 * This code is the fragment shader of MeshBasicMaterial copied from
 * 'node_modules/three/src/renderers/shaders/ShaderLib/meshbasic_frag.glsl.js'.
 *
 * The commented #include lines are in the original file and isn't needed for motion indicator
 * use case for now. They are commented to reduce the issues from unused parameters during lib upgrading.
 *
 * Please keep this file sync with the original one and DO NOT change this file unless
 *   - the threeJS version is upgraded and is incompatible with this file,
 *   - more parameters are needed.
 */
export const fragment = /* glsl */ `
uniform vec3 diffuse;
uniform float opacity;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
// #include <dithering_pars_fragment>
// #include <color_pars_fragment>
#include <uv_pars_fragment>
// #include <uv2_pars_fragment>
#include <map_pars_fragment>
// #include <alphamap_pars_fragment>
// #include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
// #include <envmap_common_pars_fragment>
// #include <envmap_pars_fragment>
// #include <cube_uv_reflection_fragment>
// #include <fog_pars_fragment>
// #include <specularmap_pars_fragment>
// #include <logdepthbuf_pars_fragment>
// #include <clipping_planes_pars_fragment>

void main() {

	// #include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	// #include <logdepthbuf_fragment>
	#include <map_fragment>
	// #include <color_fragment>
	// #include <alphamap_fragment>
	// #include <alphatest_fragment>
	// #include <specularmap_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	// accumulation (baked indirect lighting only)
	#ifdef USE_LIGHTMAP
	
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;

	#else

		reflectedLight.indirectDiffuse += vec3( 1.0 );

	#endif

	// modulation
	// #include <aomap_fragment>

	reflectedLight.indirectDiffuse *= diffuseColor.rgb;

	vec3 outgoingLight = reflectedLight.indirectDiffuse;

	// #include <envmap_fragment>

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );

	// #include <tonemapping_fragment>
	// #include <encodings_fragment>
	// #include <fog_fragment>
	// #include <premultiplied_alpha_fragment>
	// #include <dithering_fragment>

}
`;
