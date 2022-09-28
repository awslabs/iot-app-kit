import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { fragment } from './meshBasic_frag.glsl';

interface IMotionIndicatorMeshMaterialProps {
  foregroundColor?: THREE.Color;
  backgroundColor?: THREE.Color;
  backgroundColorOpacity: number;
  texture: THREE.Texture;
}

const setShaderUniforms = (
  shaderRef: React.MutableRefObject<THREE.Shader | undefined>,
  foregroundColor?: THREE.Color,
  backgroundColor?: THREE.Color,
) => {
  if (shaderRef.current) {
    // TODO: update default color
    shaderRef.current.uniforms.backgroundColor = { value: backgroundColor ?? new THREE.Color('green') };
    shaderRef.current.uniforms.changeBackground = { value: !foregroundColor && !!backgroundColor };
  }
};

export const onBeforeCompile = (
  shaderRef: React.MutableRefObject<THREE.Shader | undefined>,
  foregroundColor?: THREE.Color,
  backgroundColor?: THREE.Color,
) => {
  if (!shaderRef.current) {
    return;
  }
  setShaderUniforms(shaderRef, foregroundColor, backgroundColor);

  // Set the fragment shader to be the local copy so that we know the line to be replaced exists.
  shaderRef.current.fragmentShader = fragment;

  // Inject variables from uniforms into the shader code.
  shaderRef.current.fragmentShader =
    `
    uniform bool changeBackground;
    uniform vec3 backgroundColor;
  ` + shaderRef.current.fragmentShader;

  // Append custom code to change background/foreground color
  shaderRef.current.fragmentShader = shaderRef.current.fragmentShader.replace(
    `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
    `
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    if (changeBackground) {
      // background needs to be transparent in the texture image.
      if (gl_FragColor.r > 0.5 || gl_FragColor.g > 0.5 || gl_FragColor.b > 0.5) {
        gl_FragColor.a = 1.0;
      } else {
        gl_FragColor.r = backgroundColor[0];
        gl_FragColor.g = backgroundColor[1];
        gl_FragColor.b = backgroundColor[2];
        gl_FragColor.a = opacity;
      }
    }
    `,
  );
};

export const MotionIndicatorMeshMaterial: React.FC<IMotionIndicatorMeshMaterialProps> = ({
  foregroundColor,
  backgroundColor,
  backgroundColorOpacity,
  texture,
}: IMotionIndicatorMeshMaterialProps) => {
  const shaderRef = useRef<THREE.Shader>();

  useEffect(() => {
    setShaderUniforms(shaderRef, foregroundColor, backgroundColor);
  }, [backgroundColor, foregroundColor]);

  return (
    <meshBasicMaterial
      attach='material'
      map={texture}
      color={foregroundColor || 'white'}
      side={THREE.DoubleSide}
      transparent={true}
      depthWrite={!foregroundColor} // disable when changing foreground color
      opacity={backgroundColor ? backgroundColorOpacity : 1}
      onBeforeCompile={(shader) => {
        shaderRef.current = shader;
        onBeforeCompile(shaderRef, foregroundColor, backgroundColor);
      }}
    />
  );
};
