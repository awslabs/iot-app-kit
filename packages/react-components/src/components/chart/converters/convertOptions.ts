import { DataStream } from '@iot-app-kit/core';
import { ChartOptions } from '../types';
import { EChartsOption, SeriesOption, YAXisComponentOption } from 'echarts';
import { DEFAULT_DATA_ZOOM } from '../eChartsConstants';
import { convertLegend } from './convertLegend';
import { convertXAxis, convertYAxis } from './convertAxis';
import { convertGrid } from './convertGrid';
import { convertSeriesAndYAxis, reduceSeriesAndYAxis } from './convertSeriesAndYAxis';
import { convertTooltip } from './convertTooltip';
import { useMemo } from 'react';

type DataStreamOptions = {
  isLoading: boolean;
  hasError: boolean;
  dataStreams: DataStream[];
};
export const convertOptions = ({ dataStreams }: DataStreamOptions, options: ChartOptions): EChartsOption => {
  const { backgroundColor, axis, gestures, legend, significantDigits } = options;

  const defaultSeries: SeriesOption[] = [];
  const defaultYAxis: YAXisComponentOption[] = [convertYAxis(axis)];
  const { series, yAxis } = useMemo(
    () =>
      dataStreams
        .map(convertSeriesAndYAxis(options))
        .reduce(reduceSeriesAndYAxis, { series: defaultSeries, yAxis: defaultYAxis }),
    [dataStreams]
  );

  return {
    title: {
      text: series.length === 0 ? 'No data present' : '',
    },
    backgroundColor,
    series,
    yAxis,
    xAxis: [convertXAxis(axis)],
    grid: convertGrid(legend),
    dataZoom: gestures ? DEFAULT_DATA_ZOOM : undefined,
    legend: convertLegend(legend),
    tooltip: convertTooltip(significantDigits),
  };
};
