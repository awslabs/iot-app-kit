import { Viewport } from '@iot-app-kit/core';
import { ConfigurationOptions, DataSetOptions } from './types';
import {
  convertDataset,
  convertGrid,
  convertLegend,
  convertSeries,
  convertTooltip,
  convertXAxis,
  convertYAxis,
} from '../converters';
import { AnomalyData } from '../../../data';
import { useEffect, useReducer } from 'react';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';
import { DEFAULT_ANOMALY_WIDGET_SETTINGS } from '../constants';
import { useZoomableECharts } from '../../../hooks/useECharts/useZoomableECharts';
import merge from 'lodash.merge';

type AnomalyChartOptionState = {
  series: ReturnType<typeof convertSeries>;
  legend: ReturnType<typeof convertLegend>;
  tooltip: ReturnType<typeof convertTooltip>;
  dataset: ReturnType<typeof convertDataset>;
  yAxis: ReturnType<typeof convertYAxis>;
  xAxis: ReturnType<typeof convertXAxis>;
  grid: ReturnType<typeof convertGrid>;
  color: string[] | undefined;
  replaceMerge: string[];
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
      replaceMerge: [],
    };
  } else if (action.type === 'updateConfiguration') {
    const {
      description,
      loading,
      decimalPlaces,
      tooltipSort,
      axis,
      showTimestamp,
    } = action.configuration;
    // series will be empty when loading is true
    // don't update until we have finished loading
    // to avoid flickering in the chart
    const series = loading ? state.series : convertSeries({ description });
    // use the replace strategy if the series has changed
    const replaceSeries = !loading && !isEqual(state.series, series);
    return {
      ...state,
      series,
      legend: convertLegend({ loading }),
      tooltip: convertTooltip({ decimalPlaces, tooltipSort }),
      yAxis: convertYAxis({ axis }),
      xAxis: convertXAxis({ axis }),
      grid: convertGrid({ axis, showTimestamp }),
      color: description?.color,
      replaceMerge: replaceSeries ? ['series'] : [],
    };
  }
  return state;
};

const initialState = ({
  description,
  loading,
  decimalPlaces,
  tooltipSort,
  data,
  axis,
  showTimestamp,
}: AnomalyEChartOptions): Omit<AnomalyChartOptionState, 'chartRef'> => ({
  dataset: convertDataset(data),
  series: convertSeries({ description }),
  legend: convertLegend({ loading }),
  tooltip: convertTooltip({ decimalPlaces, tooltipSort }),
  yAxis: convertYAxis({ axis }),
  xAxis: convertXAxis({ axis }),
  grid: convertGrid({ axis, showTimestamp }),
  color: description?.color,
  replaceMerge: [],
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
  const { viewport: passedInViewport, data, ...configuration } = options;
  const utilizedViewport = passedInViewport ?? options.description?.dataExtent;

  const initialEchartsState = initialState({ ...options });
  const [{ replaceMerge, ...echartOption }, dispatch] = useReducer(
    reducer,
    initialEchartsState
  );

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
      dispatch({ type: 'updateConfiguration', configuration });
    },
    [configuration],
    isEqual
  );

  useEffect(() => {
    const mergedOptions = merge(
      {},
      DEFAULT_ANOMALY_WIDGET_SETTINGS,
      echartOption
    );
    chartRef.current?.setOption(mergedOptions, { replaceMerge });
  }, [chartRef, echartOption, mode, replaceMerge]);

  return {
    ref,
  };
};
