import React, { forwardRef } from 'react';

import { Component } from '../../../models/SceneModels';
import { ILightComponentInternal } from '../../../store';

import * as Lights from './lights';

const Light = forwardRef<THREE.Object3D, ILightComponentInternal>(({ lightSettings, lightType }, ref) => {
  switch (lightType) {
    case 'Directional':
      return <Lights.DirectionalLight ref={ref} {...(lightSettings as Component.IDirectionalLightSettings)} />;
    case 'Point':
      return <Lights.PointLight ref={ref} {...(lightSettings as Component.IPointLightSettings)} />;
    case 'Ambient':
      return <Lights.AmbientLight ref={ref} {...(lightSettings as Component.IAmbientLightSettings)} />;
    case 'Hemisphere':
      return <Lights.HemisphereLight ref={ref} {...(lightSettings as Component.IHemisphereLightSettings)} />;
    default:
      return <React.Fragment></React.Fragment>;
  }
});

export default Light;
