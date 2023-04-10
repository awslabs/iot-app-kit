import React, { FC } from 'react';
import { Scene, Loader } from 'three';
import { Environment as DreiEnvironment } from '@react-three/drei';

import NuetralHDR from '../../assets/hdri/Neutral_sm.hdr';
import DirectionalHDR from '../../assets/hdri/Directional_sm.hdr';
import ChromaticHDR from '../../assets/hdri/Chromatic_sm.hdr';

type Presets = {
  noPreset: string;
  neutral: string;
  directional: string;
  chromatic: string;
};

export const presets: Presets = {
  noPreset: '',
  neutral: NuetralHDR,
  directional: DirectionalHDR,
  chromatic: ChromaticHDR,
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
