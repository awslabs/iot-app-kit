import {
  useEffect,
  useState,
  SyntheticEvent,
  useMemo,
  MutableRefObject,
} from 'react';
import type { ECharts } from 'echarts';
import {
  CHART_RESIZE_MAX_FACTOR,
  CHART_RESIZE_MIN_FACTOR,
} from '../../components/chart/eChartsConstants';
import { ResizeCallbackData } from 'react-resizable';
import { useMeasure } from 'react-use';
import { pxToPercent } from '../utils/pxToPercentage';
import { ChartOptions } from '../../components/chart/types';

export const getDecimalFromPercentage = (n: string): number => {
  if (!n.includes('%') || n === '') {
    return 0;
  }
  const convertStringToNumber = parseInt(n.split('%')[0]);

  return convertStringToNumber / 100;
};

export const getChartWidth = (
  width: number,
  staticWidth: number,
  isLegendVisible?: boolean,
  legendWidth?: string,
  isBottomAligned?: boolean
) => {
  if (!(isLegendVisible && legendWidth) || isBottomAligned) {
    return width - staticWidth;
  }

  return width * (1 - getDecimalFromPercentage(legendWidth)) - staticWidth;
};

export const getChartHeight = (
  height: number,
  isLegendVisible?: boolean,
  legendHeight?: string,
  isBottomAligned?: boolean
) => {
  if (!(isLegendVisible && legendHeight && isBottomAligned)) {
    return height;
  }

  return height * (1 - getDecimalFromPercentage(legendHeight));
};

export const getRightLegendWidth = (
  isLegendVisible: boolean,
  isBottomAligned: boolean,
  width: number,
  leftLegendWidth: number,
  chartWidth: number
) => {
  if (!isLegendVisible) {
    return 0;
  }
  return isBottomAligned ? width : width - leftLegendWidth - chartWidth;
};

export const getRightLegendHeight = (
  isLegendVisible: boolean,
  isBottomAligned: boolean,
  height: number,
  chartHeight: number
) => {
  if (!isLegendVisible) {
    return 0;
  }
  return isBottomAligned ? height - chartHeight : height;
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
  legend: ChartOptions['legend'],
  isBottomAligned: boolean,
  onChartOptionsChange?: (options: Pick<ChartOptions, 'legend'>) => void
) => {
  const { width, height } = size;
  const legendWidth = legend?.width;
  const legendHeight = legend?.height;
  const isLegendVisible = legend?.visible ?? false;

  const [leftLegendRef, { width: leftLegendWidth }] =
    useMeasure<HTMLDivElement>();

  const [chartWidth, setChartWidth] = useState(
    getChartWidth(
      width,
      leftLegendWidth,
      isLegendVisible,
      legendWidth,
      isBottomAligned
    )
  );
  const [chartHeight, setChartHeight] = useState(
    getChartHeight(height, isLegendVisible, legendHeight, isBottomAligned)
  );
  const rightLegendWidth = getRightLegendWidth(
    isLegendVisible,
    isBottomAligned,
    width,
    leftLegendWidth,
    chartWidth
  );
  const rightLegendHeight = getRightLegendHeight(
    isLegendVisible,
    isBottomAligned,
    height,
    chartHeight
  );

  const onResize = (_event: SyntheticEvent, data: ResizeCallbackData) => {
    _event.stopPropagation();

    if (isBottomAligned) {
      setChartHeight(data.size.height);
      onChartOptionsChange?.({
        legend: {
          ...legend,
          height: pxToPercent(height - data.size.height, height),
        },
      });
    } else {
      setChartWidth(data.size.width);
      onChartOptionsChange?.({
        legend: {
          ...legend,
          width: leftLegendWidth
            ? pxToPercent(width - data.size.width - leftLegendWidth, width)
            : pxToPercent(width - data.size.width, width),
        },
      });
    }
  };

  useEffect(() => {
    setChartWidth(
      getChartWidth(
        width,
        leftLegendWidth,
        isLegendVisible,
        legendWidth,
        isBottomAligned
      )
    );
  }, [width, leftLegendWidth, isLegendVisible, legendWidth, isBottomAligned]);

  useEffect(() => {
    setChartHeight(
      getChartHeight(height, isLegendVisible, legendHeight, isBottomAligned)
    );
  }, [height, isLegendVisible, legendHeight, isBottomAligned]);

  useEffect(() => {
    const chart = chartRef.current;
    chart?.resize({
      width: chartWidth,
      height: chartHeight,
    });
  }, [chartRef, chartHeight, chartWidth]);

  const minConstraints: [number, number] = useMemo(() => {
    return [width * CHART_RESIZE_MIN_FACTOR, height * CHART_RESIZE_MIN_FACTOR];
  }, [width, height]);

  const maxConstraints: [number, number] = useMemo(() => {
    return [width * CHART_RESIZE_MAX_FACTOR, height * CHART_RESIZE_MAX_FACTOR];
  }, [width, height]);

  return {
    chartWidth,
    chartHeight,
    leftLegendWidth,
    rightLegendWidth,
    rightLegendHeight,
    onResize,
    minConstraints,
    maxConstraints,
    leftLegendRef,
  };
};
