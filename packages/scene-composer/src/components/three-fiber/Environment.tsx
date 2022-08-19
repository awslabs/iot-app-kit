import React, { FC } from 'react';
import { Scene, Loader } from 'three';
import { Environment as DreiEnvironment } from '@react-three/drei';

import NuetralHDR from '../../assets/hdri/Neutral_sm.hdr';
import DirectionalHDR from '../../assets/hdri/Directional_sm.hdr';
import ChromaticHDR from '../../assets/hdri/Chromatic_sm.hdr';

export const presets = {
  neutral: NuetralHDR as string,
  directional: DirectionalHDR as string,
  chromatic: ChromaticHDR as string,
};

interface EnvironmentProps {
  background?: boolean;
  files?: string | string[];
  preset: string;
  path?: string;
  scene?: Scene;
  extensions?: (loader: Loader) => void;
}

const Environment: FC<EnvironmentProps> = ({ preset, ...props }) => {
  return <DreiEnvironment files={presets[preset]} {...props} />;
};

export default Environment;
