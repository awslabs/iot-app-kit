import React from 'react';
import { createRoot } from 'react-dom/client';
import KGSceneIntegration from './components';

import { Density, Mode, applyDensity, applyMode } from '@cloudscape-design/global-styles';
import '@cloudscape-design/global-styles/index.css';
import '@iot-app-kit/components/styles.css';

applyDensity(Density.Comfortable);
applyMode(Mode.Dark);

const root = createRoot(document.getElementById('root')!);

root.render(<KGSceneIntegration />);
