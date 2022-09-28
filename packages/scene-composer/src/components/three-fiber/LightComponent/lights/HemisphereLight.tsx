import React, { forwardRef } from 'react';
import { Color } from 'three';

import { Component } from '../../../../models/SceneModels';

const HemisphereLight = forwardRef<THREE.Object3D, Component.IHemisphereLightSettings>(
  ({ color, groundColor, intensity }, ref) => {
    return (
      <hemisphereLight ref={ref} color={new Color(color)} groundColor={new Color(groundColor)} intensity={intensity} />
    );
  },
);

export default HemisphereLight;
