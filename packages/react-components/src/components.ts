/* eslint-disable */
/* tslint:disable */
import { createReactComponent } from './stencil-generated';

import type { JSX } from '@iot-app-kit/components';

const { defineCustomElements } = require('@iot-app-kit/components/loader');
const { defineCustomElements: defineSynchroChartsElements } = require('@synchro-charts/core/dist/loader');
defineCustomElements();
defineSynchroChartsElements()


/**
 * Manually add each component that we would like to expose as part of the react-components library.
 * This will be the final API of this library.
 */
export const ResourceExplorer = /*@__PURE__*/createReactComponent<JSX.IotResourceExplorer, HTMLIotResourceExplorerElement>('iot-resource-explorer');
export const StatusTimeline = /*@__PURE__*/createReactComponent<JSX.IotStatusTimeline, HTMLIotStatusTimelineElement>('iot-status-timeline');
export const WebglContext = /*@__PURE__*/createReactComponent<JSX.IotWebglContext, HTMLIotWebglContextElement>('iot-webgl-context');

// To be deprecated
export const Kpi = /*@__PURE__*/createReactComponent<JSX.IotKpi, HTMLIotKpiElement>('iot-kpi');
export const StatusGrid = /*@__PURE__*/createReactComponent<JSX.IotStatusGrid, HTMLIotStatusGridElement>('iot-status-grid');
