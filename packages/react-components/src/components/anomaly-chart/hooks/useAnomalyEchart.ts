import { type Viewport } from '@iot-app-kit/core';
import isEqual from 'lodash-es/isEqual';
import merge from 'lodash-es/merge';
import { useEffect, useReducer } from 'react';
import { useCustomCompareEffect } from 'react-use';
import {
  type AnomalyData,
  type UtilizedViewportType,
} from '@iot-app-kit/component-core';
import { useZoomableECharts } from '../../../hooks/useECharts/useZoomableECharts';
import { DEFAULT_ANOMALY_WIDGET_SETTINGS } from '../constants';
import {
  convertDataset,
  convertGrid,
  convertLegend,
  convertSeries,
  convertTooltip,
  convertXAxis,
  convertYAxis,
} from '../converters';
import { type ConfigurationOptions, type DataSetOptions } from './types';

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
  timeZone?: string;
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
      legend: convertLegend(),
      tooltip: convertTooltip({ decimalPlaces, tooltipSort }),
      yAxis: convertYAxis({ axis }),
      xAxis: convertXAxis({ axis, timeZone: state.timeZone }),
      grid: convertGrid({ axis, showTimestamp }),
      color: description?.color,
      replaceMerge: replaceSeries ? ['series'] : [],
    };
  }
  return state;
};

const initialState = ({
  description,
  decimalPlaces,
  tooltipSort,
  data,
  axis,
  showTimestamp,
  timeZone,
}: AnomalyEChartOptions): Omit<AnomalyChartOptionState, 'chartRef'> => {
  return {
    dataset: convertDataset(data),
    series: convertSeries({ description }),
    legend: convertLegend(),
    tooltip: convertTooltip({ decimalPlaces, tooltipSort }),
    yAxis: convertYAxis({ axis }),
    xAxis: convertXAxis({ axis, timeZone }),
    grid: convertGrid({ axis, showTimestamp }),
    color: description?.color,
    replaceMerge: [],
    timeZone,
  };
};

export type AnomalyEChartOptions = {
  mode?: 'light' | 'dark';
  viewport?: Viewport;
  viewportType: UtilizedViewportType;
  setViewport?: (viewport: Viewport, lastUpdatedBy?: string) => void;
  timeZone?: string;
} & ConfigurationOptions &
  DataSetOptions;

export const useAnomalyEchart = ({
  gestures = true,
  mode,
  timeZone,
  ...options
}: AnomalyEChartOptions) => {
  const {
    viewport: passedInViewport,
    setViewport,
    viewportType,
    data,
    ...configuration
  } = options;
  const utilizedViewport = passedInViewport ?? options.description?.dataExtent;

  const initialEchartsState = initialState({ ...options, timeZone });
  const [{ replaceMerge, ...echartOption }, dispatch] = useReducer(
    reducer,
    initialEchartsState
  );

  const { ref, chartRef, sizeRef } = useZoomableECharts({
    gestures,
    theme: mode === 'dark' ? 'cloudscapeDarkTheme' : 'cloudscapeLightTheme',
    viewport: utilizedViewport,
    setViewport,
    viewportType,
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
    sizeRef,
  };
};
