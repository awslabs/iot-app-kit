import { Cylinder } from '@react-three/drei';
import { useRef } from 'react';
import { type CylinderGeometry } from 'three';

import { Component } from '../../../models/SceneModels';

import { useArrowTexture } from './helpers';
import { MotionIndicatorMeshMaterial } from './MotionIndicatorMeshMaterial';
import { type MotionIndicatorProps } from './types';

export interface CircularCylinderMotionIndicatorProps extends MotionIndicatorProps {
  config: Component.ICircularCylinderMotionIndicatorConfig;
}

export const CircularCylinderMotionIndicator: React.FC<CircularCylinderMotionIndicatorProps> = (
  props: CircularCylinderMotionIndicatorProps,
) => {
  const geoRef = useRef<CylinderGeometry>();
  const texture = useArrowTexture({
    scale: props.scale,
    numOfRepeatInY: props.config.numOfRepeatInY,
    speed: props.speed,
    shape: Component.MotionIndicatorShape.CircularCylinder,
    objRef: geoRef,
  });

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
