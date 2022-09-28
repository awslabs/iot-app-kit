import React, { forwardRef } from 'react';
import { Color } from 'three';

import { Component } from '../../../../models/SceneModels';

const AmbientLight = forwardRef<THREE.Object3D, Component.IAmbientLightSettings>(({ intensity, color }, ref) => {
  return <ambientLight ref={ref} color={new Color(color)} intensity={intensity} />;
});

export default AmbientLight;
