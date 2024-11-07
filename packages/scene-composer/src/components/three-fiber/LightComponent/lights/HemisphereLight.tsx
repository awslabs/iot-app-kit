import { forwardRef } from 'react';
import { Color, type HemisphereLight as HemisphereLightType } from 'three';

import { type Component } from '../../../../models/SceneModels';

const HemisphereLight = forwardRef<HemisphereLightType, Component.IHemisphereLightSettings>(
  ({ color, groundColor, intensity }, ref) => {
    return (
      <hemisphereLight ref={ref} color={new Color(color)} groundColor={new Color(groundColor)} intensity={intensity} />
    );
  },
);

export default HemisphereLight;
