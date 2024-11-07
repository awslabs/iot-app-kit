import { Fragment, type ForwardedRef, forwardRef } from 'react';
import {
  type Light as LightType,
  type DirectionalLight as DirectionalLightType,
  type PointLight as PointLightType,
  type AmbientLight as AmbientLightType,
  type HemisphereLight as HemisphereLightType,
} from 'three';

import { type Component } from '../../../models/SceneModels';
import { type ILightComponentInternal } from '../../../store';

import { AmbientLight, DirectionalLight, HemisphereLight, PointLight } from './lights';

const Light = forwardRef<LightType, ILightComponentInternal>(({ lightSettings, lightType }, ref) => {
  switch (lightType) {
    case 'Directional':
      return (
        <DirectionalLight
          ref={ref as ForwardedRef<DirectionalLightType>}
          {...(lightSettings as Component.IDirectionalLightSettings)}
        />
      );
    case 'Point':
      return (
        <PointLight ref={ref as ForwardedRef<PointLightType>} {...(lightSettings as Component.IPointLightSettings)} />
      );
    case 'Ambient':
      return (
        <AmbientLight
          ref={ref as ForwardedRef<AmbientLightType>}
          {...(lightSettings as Component.IAmbientLightSettings)}
        />
      );
    case 'Hemisphere':
      return (
        <HemisphereLight
          ref={ref as ForwardedRef<HemisphereLightType>}
          {...(lightSettings as Component.IHemisphereLightSettings)}
        />
      );
    default:
      return <Fragment></Fragment>;
  }
});

export default Light;
