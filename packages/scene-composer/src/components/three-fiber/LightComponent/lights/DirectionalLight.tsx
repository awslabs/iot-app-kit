import React, { forwardRef } from 'react';
import { Color } from 'three';

import { Component } from '../../../../models/SceneModels';

const DirectionalLight = forwardRef<THREE.Object3D, Component.IDirectionalLightSettings>(
  ({ color, intensity, castShadow }, ref) => {
    return (
      <directionalLight
        ref={ref}
        color={new Color(color)}
        intensity={intensity}
        castShadow={castShadow}
        // TODO: shadow camera, shadowmap and shadow bias greatly impacts the
        // shadow quality, we'll revisit how to best set these values in fine
        // tuning
        shadow-bias={0.0001}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-near={0.1}
        shadow-camera-far={1000}
        shadow-mapSize-height={1024 * 4}
        shadow-mapSize-width={1024 * 4}
      />
    );
  },
);

export default DirectionalLight;
