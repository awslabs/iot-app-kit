import { useEffect, useState, SyntheticEvent, useMemo, MutableRefObject } from 'react';
import type { ECharts } from 'echarts';
import {
  CHART_RESIZE_INITIAL_FACTOR,
  CHART_RESIZE_MAX_FACTOR,
  CHART_RESIZE_MIN_FACTOR,
} from '../../components/chart/eChartsConstants';
import { ResizeCallbackData } from 'react-resizable';
import { useMeasure } from 'react-use';

const getChartWidth = (width: number, staticWidth: number, rightLegend?: boolean) => {
  if (!rightLegend) {
    return width - staticWidth;
  }
  return width * CHART_RESIZE_INITIAL_FACTOR - staticWidth;
};

const getChartHeight = (height: number, rightLegend?: boolean) => {
  if (!rightLegend) {
    return height;
  }
  return height * CHART_RESIZE_INITIAL_FACTOR;
};

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
  size: { width: number; height: number },
  rightLegend?: boolean,
  isBottomAligned?: boolean
) => {
  const { width, height } = size;
  const [leftLegendRef, { width: leftLegendWidth }] = useMeasure<HTMLDivElement>();
  const [chartWidth, setChartWidth] = useState(getChartWidth(width, leftLegendWidth));
  const [chartHeight, setChartHeight] = useState(getChartHeight(height));
  const rightLegendWidth = rightLegend ? width - leftLegendWidth - chartWidth : 0;
  const rightLegendHeight = rightLegend ? height - chartHeight : 0;

  const onResize = (_event: SyntheticEvent, data: ResizeCallbackData) => {
    _event.stopPropagation();

    if (!rightLegend) {
      isBottomAligned ? setChartHeight(height) : setChartWidth(width - leftLegendWidth);
    } else {
      isBottomAligned ? setChartHeight(data.size.height) : setChartWidth(data.size.width);
    }
  };

  useEffect(() => {
    setChartWidth(getChartWidth(width, leftLegendWidth, rightLegend));
  }, [width, leftLegendWidth, rightLegend]);

  useEffect(() => {
    setChartHeight(getChartHeight(height, rightLegend));
  }, [height, rightLegend]);

  useEffect(() => {
    const chart = chartRef.current;
    chart?.resize({ width: isBottomAligned ? width : chartWidth, height: isBottomAligned ? chartHeight : height });
  }, [chartRef, chartHeight, chartWidth, isBottomAligned, height, width]);

  const minConstraints: [number, number] = useMemo(() => {
    return [width * CHART_RESIZE_MIN_FACTOR, height * CHART_RESIZE_MIN_FACTOR];
  }, [width, height]);

  const maxConstraints: [number, number] = useMemo(() => {
    return [width * CHART_RESIZE_MAX_FACTOR, height * CHART_RESIZE_MAX_FACTOR];
  }, [width, height]);

  return {
    chartWidth: isBottomAligned ? width : chartWidth,
    chartHeight: isBottomAligned ? chartHeight : height,
    leftLegendWidth,
    rightLegendWidth: isBottomAligned ? width : rightLegendWidth,
    rightLegendHeight: isBottomAligned ? rightLegendHeight : height,
    onResize,
    minConstraints,
    maxConstraints,
    leftLegendRef,
  };
};
