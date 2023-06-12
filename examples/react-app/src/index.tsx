import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { StrictMode } from 'react';
import Router from './router';

import { Density, Mode, applyDensity, applyMode } from '@cloudscape-design/global-styles';

import { API } from '@aws-amplify/api';
import { Auth } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import '@iot-app-kit/components/styles.css';

Amplify.configure(awsExports);
Amplify.register(Auth);
Amplify.register(API);

applyDensity(Density.Comfortable);
applyMode(Mode.Dark);

const root = createRoot(document.getElementById('root')!);

// TODO: Bring back strict mode support. Currently an issue with the react-cytoscape wrapper that makes it incompatible with strict mode.
root.render(
  <StrictMode>
    <Router />
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
