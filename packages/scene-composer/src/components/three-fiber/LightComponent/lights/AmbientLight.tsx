import { forwardRef } from 'react';
import { type AmbientLight as AmbientLightType, Color } from 'three';

import { type Component } from '../../../../models/SceneModels';

const AmbientLight = forwardRef<AmbientLightType, Component.IAmbientLightSettings>(({ intensity, color }, ref) => {
  return <ambientLight ref={ref} color={new Color(color)} intensity={intensity} />;
});

export default AmbientLight;
