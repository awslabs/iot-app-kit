import React, { useRef } from 'react';
import * as THREE from 'three';

import { Component } from '../../../models/SceneModels';

import { MotionIndicatorProps } from './types';
import { useArrowTexture } from './helpers';
import { MotionIndicatorMeshMaterial } from './MotionIndicatorMeshMaterial';

export interface LinearPlaneMotionIndicatorProps extends MotionIndicatorProps {
  config: Component.ILinearPlaneMotionIndicatorConfig;
}

export const LinearPlaneMotionIndicator: React.FC<LinearPlaneMotionIndicatorProps> = (
  props: LinearPlaneMotionIndicatorProps,
) => {
  const meshRef = useRef(undefined);
  const texture = useArrowTexture({
    scale: props.scale,
    numOfRepeatInY: props.config.numOfRepeatInY,
    speed: props.speed,
    objRef: meshRef,
    shape: Component.MotionIndicatorShape.LinearPlane,
  });

  return (
    <mesh ref={meshRef} rotation={new THREE.Euler(-Math.PI / 2)}>
      <planeGeometry parameters={{ width: 1, height: 1, widthSegments: 1, heightSegments: 1 }} attach='geometry' />
      <MotionIndicatorMeshMaterial
        backgroundColorOpacity={props.config.backgroundColorOpacity}
        foregroundColor={props.foregroundColor}
        backgroundColor={props.backgroundColor}
        texture={texture.current}
      />
    </mesh>
  );
};
