import React from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport, ThresholdSettings } from '@iot-app-kit/core';
import { useViewport } from '../../hooks/useViewport';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import { AxisSettings } from '../../common/chartTypes';
import Chart from '../chart';


export const BarChart = ({
  queries,
  thresholds = [],
  yMin,
  yMax,
  axis,
  viewport: passedInViewport,
  thresholdSettings,
  aggregationType,
  styles,
  ...rest
}: {
  queries: TimeSeriesDataQuery[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  yMin?: number;
  yMax?: number;
  thresholds?: Threshold[];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  aggregationType?: string;
  gestures?: boolean;
  significantDigits?: number;
}) => {
  const { viewport, group } = useViewport();
  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  return <Chart
    queries={queries}
    viewport={{ ...utilizedViewport, group }}
    size={{ width: 500, height: 500 }}
    {...rest} />
};
