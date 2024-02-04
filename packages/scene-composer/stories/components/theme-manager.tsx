import { Mode, Density, applyDensity, applyMode } from '@awsui/global-styles';
import React, { FC, ReactNode, useEffect } from 'react';

import { setDebugMode } from '../../src/common/GlobalSettings';

export interface ThemeManagerProps {
  theme?: 'light' | 'dark';
  density?: string;
  children: ReactNode;
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
