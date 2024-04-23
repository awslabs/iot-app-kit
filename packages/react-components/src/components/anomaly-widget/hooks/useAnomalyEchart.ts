import { Viewport } from '@iot-app-kit/core';
import { ConfigurationOptions, DataSetOptions } from './types';
import {
  convertDataset,
  convertLegend,
  convertSeries,
  convertTitle,
  convertTooltip,
} from '../converters';
import { AnomalyData } from '../../../data';
import { useEffect, useReducer } from 'react';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';
import { DEFAULT_ANOMALY_WIDGET_SETTINGS } from '../constants';
import { useZoomableECharts } from '../../../hooks/useECharts/useZoomableECharts';
import merge from 'lodash.merge';

type AnomalyChartOptionState = {
  title: ReturnType<typeof convertTitle>;
  series: ReturnType<typeof convertSeries>;
  legend: ReturnType<typeof convertLegend>;
  tooltip: ReturnType<typeof convertTooltip>;
  dataset: ReturnType<typeof convertDataset>;
  color: string[] | undefined;
};
type UpdateAnomalyChartAction =
  | { type: 'updateData'; data?: AnomalyData }
  | { type: 'updateConfiguration'; configuration: ConfigurationOptions };

const reducer = (
  state: AnomalyChartOptionState,
  action: UpdateAnomalyChartAction
): AnomalyChartOptionState => {
  if (action.type === 'updateData') {
    return {
      ...state,
      dataset: convertDataset(action.data),
    };
  } else if (action.type === 'updateConfiguration') {
    const { title, description, loading, decimalPlaces, tooltipSort } =
      action.configuration;
    return {
      ...state,
      title: convertTitle({ title }),
      series: convertSeries({ description }),
      legend: convertLegend({ loading }),
      tooltip: convertTooltip({ decimalPlaces, tooltipSort }),
      color: description?.color,
    };
  }
  return state;
};

const initialState = ({
  title,
  description,
  loading,
  decimalPlaces,
  tooltipSort,
  data,
}: AnomalyEChartOptions): Omit<AnomalyChartOptionState, 'chartRef'> => ({
  dataset: convertDataset(data),
  title: convertTitle({ title }),
  series: convertSeries({ description }),
  legend: convertLegend({ loading }),
  tooltip: convertTooltip({ decimalPlaces, tooltipSort }),
  color: description?.color,
});

export type AnomalyEChartOptions = {
  mode?: 'light' | 'dark';
  viewport?: Viewport;
} & ConfigurationOptions &
  DataSetOptions;

export const useAnomalyEchart = ({
  mode,
  ...options
}: AnomalyEChartOptions) => {
  const { viewport: passedInViewport, data } = options;
  const utilizedViewport = passedInViewport ?? options.description?.dataExtent;

  const initialEchartsState = initialState({ ...options });
  const [state, dispatch] = useReducer(reducer, initialEchartsState);

  const { ref, chartRef } = useZoomableECharts({
    theme: mode === 'dark' ? 'cloudscapeDarkTheme' : 'cloudscapeLightTheme',
    viewport: utilizedViewport,
  });

  useCustomCompareEffect(
    () => {
      dispatch({ type: 'updateData', data });
    },
    [data],
    isEqual
  );

  useCustomCompareEffect(
    () => {
      dispatch({ type: 'updateConfiguration', configuration: options });
    },
    [options],
    isEqual
  );

  useEffect(() => {
    const mergedOptions = merge({}, DEFAULT_ANOMALY_WIDGET_SETTINGS, state);
    chartRef.current?.setOption(mergedOptions);
  }, [chartRef, state, mode]);

  return {
    ref,
  };
};
