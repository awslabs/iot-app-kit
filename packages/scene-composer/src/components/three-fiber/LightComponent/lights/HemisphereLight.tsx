import React, { forwardRef } from 'react';
import { Color, HemisphereLight as HemisphereLightType } from 'three';

import { Component } from '../../../../models/SceneModels';

const HemisphereLight = forwardRef<HemisphereLightType, Component.IHemisphereLightSettings>(
  ({ color, groundColor, intensity }, ref) => {
    return (
      <hemisphereLight ref={ref} color={new Color(color)} groundColor={new Color(groundColor)} intensity={intensity} />
    );
  },
);

export default HemisphereLight;
