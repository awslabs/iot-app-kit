import './global';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';

import { StrictMode } from 'react';
import router from './router';

import { Density, Mode, applyDensity, applyMode } from '@cloudscape-design/global-styles';
import '@cloudscape-design/global-styles/index.css';
import '@iot-app-kit/components/styles.css';

applyDensity(Density.Comfortable);
applyMode(Mode.Light);

const root = createRoot(document.getElementById('root')!);

// TODO: Bring back strict mode support. Currently an issue with the react-cytoscape wrapper that makes it incompatible with strict mode.
root.render(
  <StrictMode>
    <RouterProvider router={router} />
    {/*
    We only need 1 global webgl context for synchro-charts,
    also it needs to be placed to expand the whole viewport of the window
     */}
    {/* <WebglContext /> */}
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
