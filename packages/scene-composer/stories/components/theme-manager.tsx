import { Mode, Density, applyDensity, applyMode } from '@awsui/global-styles';
import React, { FC, useEffect } from 'react';

import { setDebugMode } from '../../src';

export interface ThemeManagerProps {
  theme?: 'light' | 'dark';
  density?: string;
}

const ThemeManager: FC<ThemeManagerProps> = ({ theme = Mode.Dark, density = Density.Comfortable, children }) => {
  useEffect(() => {
    applyDensity(density as Density);
  }, [density]);

  useEffect(() => {
    applyMode(theme as Mode);
  }, [theme]);

  useEffect(() => {
    setDebugMode();
  }, []);

  return <>{children}</>;
};

export default ThemeManager;
