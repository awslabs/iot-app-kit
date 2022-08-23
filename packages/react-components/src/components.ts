/* eslint-disable */
/* tslint:disable */
import { createReactComponent } from './stencil-generated';

import type { JSX } from '@iot-app-kit/components';

const { defineCustomElements } = require('@iot-app-kit/components/loader');
defineCustomElements();


/**
 * Manually add each component that we would like to expose as part of the react-components library.
 * This will be the final API of this library.
 */
export const BarChart = /*@__PURE__*/createReactComponent<JSX.IotBarChart, HTMLIotBarChartElement>('iot-bar-chart');
export const Kpi = /*@__PURE__*/createReactComponent<JSX.IotKpi, HTMLIotKpiElement>('iot-kpi');
export const LineChart = /*@__PURE__*/createReactComponent<JSX.IotLineChart, HTMLIotLineChartElement>('iot-line-chart');
export const ResourceExplorer = /*@__PURE__*/createReactComponent<JSX.IotResourceExplorer, HTMLIotResourceExplorerElement>('iot-resource-explorer');
export const ScatterChart = /*@__PURE__*/createReactComponent<JSX.IotScatterChart, HTMLIotScatterChartElement>('iot-scatter-chart');
export const StatusGrid = /*@__PURE__*/createReactComponent<JSX.IotStatusGrid, HTMLIotStatusGridElement>('iot-status-grid');
export const StatusTimeline = /*@__PURE__*/createReactComponent<JSX.IotStatusTimeline, HTMLIotStatusTimelineElement>('iot-status-timeline');
export const Table = /*@__PURE__*/createReactComponent<JSX.IotTable, HTMLIotTableElement>('iot-table');
export const WebglContext = /*@__PURE__*/createReactComponent<JSX.IotWebglContext, HTMLIotWebglContextElement>('iot-webgl-context');
export const Dial = /*@__PURE__*/createReactComponent<JSX.IotDial, HTMLScDialElement>('sc-dial');
