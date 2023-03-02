import React, { forwardRef } from 'react';
import { AmbientLight as AmbientLightType, Color } from 'three';

import { Component } from '../../../../models/SceneModels';

const AmbientLight = forwardRef<AmbientLightType, Component.IAmbientLightSettings>(({ intensity, color }, ref) => {
  return <ambientLight ref={ref} color={new Color(color)} intensity={intensity} />;
});

export default AmbientLight;
