import { useEffect, useReducer } from 'react';
import { Primitive } from '@iot-app-kit/core';
import { ChartRef } from '../../../hooks/useECharts';
import { GaugeConfigurationOptions } from '../types';
import { isEqual, merge } from 'lodash';
import { useCustomCompareEffect } from 'react-use';
import { convertSeries } from '../converters/convertSeries';
import { convertDataset } from '../converters/convertDataset';

type GaugeOptionState = {
  series: ReturnType<typeof convertSeries>;
  dataset: ReturnType<typeof convertDataset>;
  replaceMerge: string[];
  mergeOption?: { notMerge: boolean };
};

type UpdateGaugeAction =
  | { type: 'updateData'; value?: Primitive }
  | { type: 'updateConfiguration'; configuration: GaugeConfigurationOptions };

const initialState = (
  config: GaugeConfigurationOptions
): Omit<GaugeOptionState, 'chartRef'> => {
  const {
    settings,
    name,
    gaugeValue,
    unit,
    significantDigits,
    thresholds,
    isLoading,
    error,
  } = config;

  return {
    dataset: convertDataset(gaugeValue),
    series: convertSeries({
      name,
      unit,
      significantDigits,
      thresholds,
      settings,
      isLoading,
      error,
    }),
    replaceMerge: [],
  };
};

const reducer = (
  state: GaugeOptionState,
  action: UpdateGaugeAction
): GaugeOptionState => {
  if (action.type === 'updateData') {
    return {
      ...state,
      dataset: convertDataset(action.value),
      replaceMerge: [],
    };
  } else if (action.type === 'updateConfiguration') {
    const series = action.configuration.isLoading
      ? state.series
      : convertSeries(action.configuration);
    // use the replace strategy if the series has changed
    const replaceSeries =
      !action.configuration.isLoading && !isEqual(state.series, series);

    return {
      ...state,
      series,
      replaceMerge: replaceSeries ? ['series'] : [],
    };
  }
  return state;
};

export const useGaugeConfiguration = (
  chartRef: ChartRef,
  config: GaugeConfigurationOptions,
  mode?: string
) => {
  const {
    settings,
    gaugeValue,
    unit,
    significantDigits,
    thresholds,
    isLoading,
    error,
  } = config;

  const initialEchartsState = initialState(config);
  const [{ replaceMerge, ...echartOption }, dispatch] = useReducer(
    reducer,
    initialEchartsState
  );

  useEffect(() => {
    const mergedOptions = merge({}, {}, echartOption);
    chartRef.current?.setOption(mergedOptions, { replaceMerge });
  }, [chartRef, echartOption, mode, replaceMerge]);

  useEffect(() => {
    dispatch({ type: 'updateData', value: gaugeValue });
  }, [gaugeValue]);

  useCustomCompareEffect(
    () => {
      dispatch({
        type: 'updateConfiguration',
        configuration: {
          unit,
          significantDigits,
          thresholds,
          settings,
          isLoading,
          error,
        },
      });
    },
    [{ unit, significantDigits, thresholds, settings, isLoading, error }],
    isEqual
  );
};
