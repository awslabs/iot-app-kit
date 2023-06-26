import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport, ThresholdSettings } from '@iot-app-kit/core';
import { DataStream } from '@iot-app-kit/charts-core';
import type { EChartsType } from 'echarts';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { AxisSettings } from '../../common/chartTypes';
import { DEFAULT_ECHART_OPTIONS } from './eChartsConstants';
import { init, getInstanceByDom } from 'echarts';
import { dataStreamsToEChartSeries, updatePositions, getToolTipGraphic, GraphicInternal } from './eChartsUtlis';

export interface BaseEChartsProps {
  queries: TimeSeriesDataQuery[];
  chartType: 'line' | 'bar' | 'scatter';
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  yMin?: number;
  yMax?: number;
  thresholds?: Threshold[];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  aggregationType?: string;
  gestures?: boolean;
  size?: { width: number; height: number };
}

export const BaseECharts = ({
  queries,
  yMin,
  yMax,
  axis,
  viewport: passedInViewport,
  styles,
  chartType,
  size,
}: BaseEChartsProps) => {
  const chartRef = useRef(null);
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
    },
    styles,
  });
  const optionRef = useRef({
    ...DEFAULT_ECHART_OPTIONS,
  });
  const tooltipAddMode = useRef(false);
  const series = useMemo(
    () => dataStreamsToEChartSeries(dataStreams as DataStream[], chartType),
    [dataStreams, chartType]
  );

  useEffect(() => {
    let chart: EChartsType;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
    }
    return () => {
      chart?.dispose();
    };
  }, []);

  useEffect(() => {
    let chart: EChartsType | undefined;
    if (chartRef.current !== null) {
      chart = getInstanceByDom(chartRef?.current);
      chart?.resize({ width: size?.width, height: size?.height });
    }
  }, [size]);

  useEffect(() => {
    let chart;
    optionRef.current = {
      ...optionRef.current,
      xAxis: { ...optionRef.current.xAxis, show: axis?.showX ?? true },
      yAxis: {
        ...optionRef.current.yAxis,
        show: axis?.showY ?? true,
        min: yMin,
        max: yMax,
      },
    };
    if (chartRef.current !== null) {
      chart = getInstanceByDom(chartRef.current);
      chart?.setOption(optionRef.current);
    }
  }, [yMin, yMax, axis, chartType]);

  useEffect(() => {
    let chart;
    if (chartRef.current !== null) {
      chart = getInstanceByDom(chartRef.current);
      optionRef.current = {
        ...optionRef.current,
        graphic: updatePositions(optionRef.current, series, chart),
        title: {
          text: series.length === 0 ? `${chartType} chart - no data present` : `${chartType} chart`,
        },
        series,
      };

      chart?.setOption(optionRef.current);
    }
  }, [series]);

  useEffect(() => {
    let chart: EChartsType | undefined;
    if (chartRef.current !== null) {
      chart = getInstanceByDom(chartRef.current);
      chart?.on('click', (e) => {
        if (tooltipAddMode.current) {
          const length = (optionRef.current.graphic as GraphicInternal[])?.length ?? 0;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          optionRef.current?.graphic?.push(getToolTipGraphic(e, length, chart, size));
          chart?.setOption(optionRef.current);
          tooltipAddMode.current = !tooltipAddMode.current;
        }
      });

      chart?.getZr().on('dblclick', () => {
        tooltipAddMode.current = !tooltipAddMode.current;
      });

      // TODO : hover mode is broken because of this. i.e cannot show the default tooltip automatically, user, has to click on the graph
      chart?.getZr().on('mousemove', () => {
        if (tooltipAddMode.current) {
          chart?.getZr().setCursorStyle('crosshair');
        } else {
          chart?.getZr().setCursorStyle('auto');
        }
      });
    }

    return () => {
      if (chartRef.current !== null) {
        chart?.off('click');
        chart?.getZr().off('dblclick');
        chart?.getZr().off('mousemove');
      }
    };
  }, [chartRef, optionRef.current, tooltipAddMode.current]);

  return <div ref={chartRef} style={{ width: size?.width, height: size?.height }} />;
};
