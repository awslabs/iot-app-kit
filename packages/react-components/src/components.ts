/* eslint-disable */
/* tslint:disable */
import { createReactComponent } from './stencil-generated';
import type { JSX } from '@iot-app-kit/components';

import { defineCustomElements } from '@iot-app-kit/components/loader';
import { defineCustomElements as defineSynchroChartsElements } from '@iot-app-kit/charts-core/dist/loader';
defineCustomElements();
defineSynchroChartsElements()

export const ResourceExplorer = /*@__PURE__*/createReactComponent<JSX.IotResourceExplorer, HTMLIotResourceExplorerElement>('iot-resource-explorer');
