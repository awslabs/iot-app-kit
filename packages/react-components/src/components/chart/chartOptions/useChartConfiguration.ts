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
import { ChartDataQuality, ChartOptions, ChartStyleSettings } from '../types';
import { useXAxis } from './axes/xAxis';
import { useTooltip } from './tooltip/convertTooltip';
import { useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import {
  DEFAULT_CHART_OPTION,
  DEFAULT_DATA_ZOOM,
  PERFORMANCE_MODE_THRESHOLD,
} from '../eChartsConstants';
import { useSeriesAndYAxis } from './seriesAndYAxis/convertSeriesAndYAxis';
import { SeriesOption } from 'echarts';
import { GenericSeries } from '../../../echarts/types';

const toDataStreamIdentifiers = (dataStreams: DataStream[]) =>
  dataStreams.map(
    ({
      id,
      name,
      color,
      refId,
      dataType,
      detailedName,
      unit,
      data,
      assetName,
    }) => ({
      id,
      name,
      color,
      refId,
      dataType,
      detailedName,
      unit,
      latestValue: data.at(-1)?.y,
      assetName,
    })
  );

const toDataStreamMetaData = (
  datastreams: ReturnType<typeof toDataStreamIdentifiers>,
  series: SeriesOption[],
  styleSettings?: ChartStyleSettings
) => {
  return datastreams.map(
    ({
      id,
      name,
      color,
      dataType,
      refId,
      detailedName,
      unit,
      assetName,
      latestValue,
    }) => {
      const foundSeries = series.find(
        ({ id: seriesId }) => seriesId === id
      ) ?? { appKitColor: color };
      const colorUsed = (foundSeries as GenericSeries).appKitColor;

      const styledName =
        refId && styleSettings ? styleSettings[refId]?.name : undefined;

      return {
        id,
        name: styledName ?? name,
        refId,
        color: colorUsed,
        dataType,
        detailedName,
        unit,
        assetName,
        latestValue,
      };
    }
  );
};

type ChartConfigurationOptions = Pick<
  ChartOptions,
  | 'axis'
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
} & { chartWidth: number } & ChartDataQuality & {
    gestures: boolean;
  };

export type DataStreamMetaData = ReturnType<
  typeof useChartConfiguration
>['dataStreamMetaData'][number];

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
    axis,
    gestures,
    backgroundColor,
    significantDigits,
    styleSettings,
    thresholds,
    defaultVisualizationType,
    showBadDataIcons,
    showUncertainDataIcons,
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

  const [dataStreamMetaData, setDataStreamMetaData] = useState(
    toDataStreamMetaData(dataSteamIdentifiers, [], styleSettings)
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

  const { series, yAxis } = useSeriesAndYAxis(dataSteamIdentifiers, {
    styleSettings,
    defaultVisualizationType,
    significantDigits,
    axis,
    thresholds,
    performanceMode,
    showBadDataIcons,
    showUncertainDataIcons,
  });

  const tooltip = useTooltip({
    significantDigits,
    series,
    showBadDataIcons,
    showUncertainDataIcons,
  });

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

    setDataStreamMetaData(
      toDataStreamMetaData(dataSteamIdentifiers, series, styleSettings)
    );

    chart.setOption(
      {
        appKitChartId: id,
        appKitSignificantDigits: significantDigits,
        backgroundColor,
        xAxis,
        tooltip,
        series,
        yAxis,
        dataZoom: gestures ? DEFAULT_DATA_ZOOM : { disabled: true },
      },
      {
        ...updateSettings,
      }
    );
  }, [
    chartRef,
    id,
    backgroundColor,
    significantDigits,
    styleSettings,
    xAxis,
    tooltip,
    series,
    gestures,
    yAxis,
    dataSteamIdentifiers,
  ]);

  return { series, yAxis, dataStreamMetaData };
};
