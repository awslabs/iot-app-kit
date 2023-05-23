import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';

import router from './router';

import {
  Density,
  Mode,
  applyDensity,
  applyMode,
} from '@cloudscape-design/global-styles';

import "@cloudscape-design/global-styles/index.css"
import '@iot-app-kit/components/styles.css';

applyDensity(Density.Comfortable);
applyMode(Mode.Dark);

const root = createRoot(document.getElementById('root')!);

// TODO: Bring back strict mode support. Currently an issue with the react-cytoscape wrapper that makes it incompatible with strict mode.
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
