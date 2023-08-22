import { useEffect, useState, SyntheticEvent, useMemo, MutableRefObject } from 'react';
import type { ECharts } from 'echarts';
import {
  CHART_RESIZE_INITIAL_FACTOR,
  CHART_RESIZE_MAX_FACTOR,
  CHART_RESIZE_MIN_FACTOR,
} from '../../components/chart/eChartsConstants';
import { ResizeCallbackData } from 'react-resizable';
import { useMeasure } from 'react-use';

const getChartWidth = (width: number) => width * CHART_RESIZE_INITIAL_FACTOR;

/**
 * hook to set up the size of an echarts instance within the base chart component
 * note: the chart sits along side a legend table which means that the
 * echart is actually smaller in width than the overall base chart component
 *
 * @param chartRef React ref to an initialized echarts object
 * @param size size of the chart
 * @returns
 *  - width: width of the component
 *  - height: height of the component
 *  - chartWidth: width of the chart minus the left legend
 *  - onResize: handler to react to resizing the chart size
 *  - minConstraints: min size of the chart within the component
 *  - maxConstraints: max size of the chart within the component
 */
export const useResizeableEChart = (
  chartRef: MutableRefObject<ECharts | null>,
  size: { width: number; height: number }
) => {
  const { width, height } = size;
  const [leftLegendRef, { width: leftLegendWidth }] = useMeasure<HTMLDivElement>();
  const [chartWidth, setWidth] = useState(getChartWidth(width - leftLegendWidth));

  const onResize = (_event: SyntheticEvent, data: ResizeCallbackData) => {
    setWidth(data.size.width);
  };

  useEffect(() => {
    setWidth(getChartWidth(width - leftLegendWidth));
  }, [leftLegendWidth]);

  useEffect(() => {
    setWidth(getChartWidth(width - leftLegendWidth));
  }, [width]);

  useEffect(() => {
    const chart = chartRef.current;
    chart?.resize({ width: chartWidth, height: height });
  }, [chartRef, width, height, chartWidth]);

  const minConstraints: [number, number] = useMemo(() => {
    return [width * CHART_RESIZE_MIN_FACTOR, height];
  }, [width, height]);

  const maxConstraints: [number, number] = useMemo(() => {
    return [width * CHART_RESIZE_MAX_FACTOR, height];
  }, [width, height]);

  return {
    width,
    height,
    chartWidth,
    leftLegendWidth,
    rightLegendWidth: width - leftLegendWidth - chartWidth,
    onResize,
    minConstraints,
    maxConstraints,
    leftLegendRef,
  };
};
