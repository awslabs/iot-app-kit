/* eslint-disable */
/* tslint:disable */
import { createReactComponent } from './stencil-generated';
import type { JSX } from '@iot-app-kit/components';

const { defineCustomElements } = require('@iot-app-kit/components/loader');
const { defineCustomElements: defineSynchroChartsElements } = require('@iot-app-kit/charts-core/dist/loader');
defineCustomElements();
defineSynchroChartsElements()

export const ResourceExplorer = /*@__PURE__*/createReactComponent<JSX.IotResourceExplorer, HTMLIotResourceExplorerElement>('iot-resource-explorer');
