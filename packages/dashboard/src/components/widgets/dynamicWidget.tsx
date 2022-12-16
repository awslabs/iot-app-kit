import React from 'react';
import { AssetQuery } from '@iot-app-kit/core';
import {
  Annotations,
  LabelsConfig,
  Trend,
  MovementConfig,
  ScaleConfig,
  LayoutConfig,
  Axis,
  LegendConfig,
  AlarmsConfig,
  MessageOverrides,
  MinimalSizeConfig,
  MinimalViewPortConfig,
} from '@synchro-charts/core';

import {
  BarChart,
  Kpi,
  LineChart,
  ScatterChart,
  StatusGrid,
  StatusTimeline,
  Table,
} from '@iot-app-kit/react-components';

import './dynamicWidget.css';
import { ComponentTag } from '../../types';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

// eslint-disable-next-line
const IconX = require('./iconx.svg') as string;

// eslint-disable-next-line
export const ComponentMap: { [key in ComponentTag]: any } = {
  'iot-bar-chart': BarChart,
  'iot-kpi': Kpi,
  'iot-line-chart': LineChart,
  'iot-scatter-chart': ScatterChart,
  'iot-status-grid': StatusGrid,
  'iot-status-timeline': StatusTimeline,
  'iot-table': Table,
};

export type DynamicWidgetProps = {
  componentTag: ComponentTag;
  widgetId: string;
  query?: SiteWiseQuery;
  assets: AssetQuery[];
  viewport: MinimalViewPortConfig;
  movement?: MovementConfig;
  scale?: ScaleConfig;
  layout?: LayoutConfig;
  legend?: LegendConfig;
  annotations?: Annotations;
  axis?: Axis.Options;
  messageOverrides?: MessageOverrides;
  size?: MinimalSizeConfig;
  trends?: Trend[];
  alarms?: AlarmsConfig;
  gestures?: boolean;
  labelsConfig?: LabelsConfig;
  readOnly?: boolean;
  isEditing?: boolean;
  invalidTagErrorHeader: string;
  invalidTagErrorSubheader: string;
};

const DynamicWidgetComponent: React.FC<DynamicWidgetProps> = ({
  componentTag,
  widgetId,
  query,
  assets,
  viewport,
  movement,
  scale,
  layout,
  legend,
  annotations,
  axis,
  messageOverrides,
  size,
  trends,
  alarms,
  gestures,
  labelsConfig,
  readOnly,
  isEditing,
  invalidTagErrorHeader,
  invalidTagErrorSubheader,
}) => {
  const Component = ComponentMap[componentTag];
  const componentIsRegistered = typeof Component !== 'undefined';

  const queries = query !== undefined ? [query.timeSeriesData({ assets })] : [];

  // eslint-disable-next-line
  const props: any = {
    widgetId: widgetId,
    queries,
    viewport: viewport,
    movement: movement,
    scale: scale,
    layout: layout,
    legend: legend,
    annotations: annotations,
    axis: axis,
    messageOverrides: messageOverrides,
    size: size,
    trends: trends,
    alarms: alarms,
    labelsConfig: labelsConfig,
    gestures: gestures,
    isEditing,
    readOnly,
  };

  return componentIsRegistered ? (
    React.createElement(Component, props)
  ) : (
    <div className="error-container">
      <img className="error-icon" src={IconX} alt="warning - widget failed" />
      <p className="error-container-text">{invalidTagErrorHeader}</p>
      <p className="error-container-text">{invalidTagErrorSubheader}</p>
    </div>
  );
};

export default DynamicWidgetComponent;
