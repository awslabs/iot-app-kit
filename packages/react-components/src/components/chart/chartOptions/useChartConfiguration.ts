import {
  DataPoint,
  DataStream,
  Threshold,
  ThresholdValue,
} from '@iot-app-kit/core';
import {
  ChartRef,
  useGroupableEChart,
  useLoadableEChart,
} from '../../../hooks/useECharts';
import { ChartOptions } from '../types';
import { useXAxis } from './axes/xAxis';
import { useTooltip } from './convertTooltip';
import { useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import {
  DEFAULT_CHART_OPTION,
  PERFORMANCE_MODE_THRESHOLD,
} from '../eChartsConstants';
import { useSeriesAndYAxis } from './seriesAndYAxis/convertSeriesAndYAxis';

const useTitle = ({
  titleText,
  hasSeries,
}: {
  titleText?: string;
  hasSeries: boolean;
}) => {
  return useMemo(
    () => ({
      text: hasSeries ? titleText ?? '' : 'No data present',
    }),
    [hasSeries, titleText]
  );
};

const toDataStreamIdentifiers = (dataStreams: DataStream[]) =>
  dataStreams.map(({ id, name, color, refId }) => ({ id, name, color, refId }));

type ChartConfigurationOptions = Pick<
  ChartOptions,
  | 'axis'
  | 'titleText'
  | 'backgroundColor'
  | 'significantDigits'
  | 'legend'
  | 'id'
  | 'styleSettings'
  | 'defaultVisualizationType'
> & { group: string } & { isLoading: boolean } & {
  dataStreams: DataStream[];
} & { visibleData: DataPoint[] } & {
  thresholds: Threshold<ThresholdValue>[];
};

/**
 * Hook to set the chart visual configuration options
 * These include styling:
 * chart grid, x axis, y axis, datastreams, thresholds,
 * tooltip, zoom behavior, chart title,
 * background color, loading behavior
 */
export const useChartConfiguration = (
  chartRef: ChartRef,
  {
    group,
    isLoading,
    dataStreams,
    visibleData,
    id,
    titleText,
    axis,
    backgroundColor,
    significantDigits,
    styleSettings,
    thresholds,
    defaultVisualizationType,
  }: ChartConfigurationOptions
) => {
  /**
   * keeping local state for the datastream identification info so that we can control when this dependency
   * actually changes the styling of the chart. The dataStream reference is always new from useTimeSeries data so we
   * must create a new variable that does not change unless the identifying information about the widget
   * query has changed.
   */
  const [dataSteamIdentifiers, setDataStreamIdentifiers] = useState(
    toDataStreamIdentifiers(dataStreams)
  );
  useEffect(() => {
    const mappedDataStreams = toDataStreamIdentifiers(dataStreams);
    if (isEqual(mappedDataStreams, dataSteamIdentifiers)) return;
    setDataStreamIdentifiers(mappedDataStreams);
  }, [dataStreams, dataSteamIdentifiers]);

  const previousDataStreamIdentifiers = useRef(dataSteamIdentifiers);

  // apply group to echart instance
  useGroupableEChart(chartRef, group);

  // apply loading animation to echart instance
  useLoadableEChart(chartRef, isLoading);

  /*
   * Setup all of the static chart configuration options
   */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.setOption(DEFAULT_CHART_OPTION);
  }, [chartRef]);

  const performanceMode = useMemo(
    () => visibleData.length > PERFORMANCE_MODE_THRESHOLD,
    [visibleData.length]
  );

  const xAxis = useXAxis(axis);
  const tooltip = useTooltip(significantDigits);

  const { series, yAxis } = useSeriesAndYAxis(dataSteamIdentifiers, {
    styleSettings,
    defaultVisualizationType,
    significantDigits,
    axis,
    thresholds,
    performanceMode,
  });

  const title = useTitle({ hasSeries: series.length > 0, titleText });

  /*
   * Setup all of the changeable chart configuration options
   */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    /**
     * if the datastreams change update echarts using the replaceMerge stratgey
     * so that it is ensured that orphaned data points are removed.
     *
     * see setOption api for more information on settings
     * https://echarts.apache.org/en/api.html#echartsInstance.setOption
     *
     */
    const updateSettings = isEqual(
      previousDataStreamIdentifiers.current,
      dataSteamIdentifiers
    )
      ? undefined
      : { replaceMerge: ['series'] };
    previousDataStreamIdentifiers.current = dataSteamIdentifiers;

    chart.setOption(
      {
        appKitChartId: id,
        backgroundColor,
        xAxis,
        tooltip,
        title,
        series,
        yAxis,
      },
      {
        ...updateSettings,
      }
    );
  }, [
    chartRef,
    id,
    backgroundColor,
    xAxis,
    tooltip,
    title,
    series,
    yAxis,
    dataSteamIdentifiers,
  ]);

  return { series, yAxis };
};
