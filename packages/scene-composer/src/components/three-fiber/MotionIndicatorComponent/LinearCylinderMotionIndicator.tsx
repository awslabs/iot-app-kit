import { Cylinder } from '@react-three/drei/core/shapes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Component } from '../../../models/SceneModels';

import { useArrowTexture } from './helpers';
import { MotionIndicatorMeshMaterial } from './MotionIndicatorMeshMaterial';
import { MotionIndicatorProps } from './types';

export interface LinearCylinderMotionIndicatorProps extends MotionIndicatorProps {
  config: Component.ILinearCylinderMotionIndicatorConfig;
}

export const LinearCylinderMotionIndicator: React.FC<LinearCylinderMotionIndicatorProps> = (
  props: LinearCylinderMotionIndicatorProps,
) => {
  const geoRef = useRef<THREE.CylinderBufferGeometry>();
  const texture = useArrowTexture({
    scale: props.scale,
    numOfRepeatInY: props.config.numOfRepeatInY,
    speed: props.speed,
    shape: Component.MotionIndicatorShape.LinearCylinder,
    objRef: geoRef,
  });

  useEffect(() => {
    texture.current.rotation = 0.5 * Math.PI;

    geoRef.current?.rotateZ(-Math.PI / 2);
  }, []);

  return (
    // Initialize within a 1x1x1 box
    <Cylinder ref={geoRef} args={[0.5, 0.5, 1, 32, 1, true]}>
      <MotionIndicatorMeshMaterial
        backgroundColorOpacity={props.config.backgroundColorOpacity}
        foregroundColor={props.foregroundColor}
        backgroundColor={props.backgroundColor}
        texture={texture.current}
      />
    </Cylinder>
  );
};
