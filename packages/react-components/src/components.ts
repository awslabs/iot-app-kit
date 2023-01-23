/* eslint-disable */
/* tslint:disable */
import { createReactComponent } from './stencil-generated';
import makeViewportAware, { IViewportProps } from './enhancers/make-viewport-aware';

import type { JSX } from '@iot-app-kit/components';
import { HTMLStencilElement } from './stencil-generated/createComponent';

const { defineCustomElements } = require('@iot-app-kit/components/loader');
defineCustomElements();

function createViewportAwareReactComponent<ElementType, PropsType extends IViewportProps & HTMLStencilElement>(name: string) {
  return makeViewportAware<ElementType, PropsType>(createReactComponent<ElementType, PropsType>(name))
}


/**
 * Manually add each component that we would like to expose as part of the react-components library.
 * This will be the final API of this library.
 */
export const BarChart = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotBarChart, HTMLIotBarChartElement>('iot-bar-chart');
export const Kpi = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotKpi, HTMLIotKpiElement>('iot-kpi');
export const LineChart = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotLineChart, HTMLIotLineChartElement>('iot-line-chart');
export const ResourceExplorer = /*@__PURE__*/createReactComponent<JSX.IotResourceExplorer, HTMLIotResourceExplorerElement>('iot-resource-explorer');
export const ScatterChart = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotScatterChart, HTMLIotScatterChartElement>('iot-scatter-chart');
export const StatusGrid = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotStatusGrid, HTMLIotStatusGridElement>('iot-status-grid');
export const StatusTimeline = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotStatusTimeline, HTMLIotStatusTimelineElement>('iot-status-timeline');
export const Table = /*@__PURE__*/createViewportAwareReactComponent<JSX.IotTable, HTMLIotTableElement>('iot-table');
export const WebglContext = /*@__PURE__*/createReactComponent<JSX.IotWebglContext, HTMLIotWebglContextElement>('iot-webgl-context');
