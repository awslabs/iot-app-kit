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
import {
  emToPx,
  perToPx,
  pxToEm,
  pxToPercent,
  pxToRem,
  remToPx,
} from '../utils/pxConversion';
import { ChartOptions } from '../../components/chart/types';
import { parseValueAndUnit } from '../utils/parseValueAndUnit';

export const calculateAdjustedWidth = (
  width: number,
  staticWidth: number,
  unit: string,
  value: number
): number => {
  switch (unit) {
    case '%':
      return width * (1 - perToPx(value)) - staticWidth;
    case 'rem':
      return width - staticWidth - remToPx(value);
    case 'em':
      return width - staticWidth - emToPx(value);
    default:
      return width - staticWidth - value;
  }
};

export const getChartWidth = (
  width: number,
  staticWidth: number,
  isLegendVisible?: boolean,
  legendWidth?: string,
  isBottomAligned?: boolean
): number => {
  if (!(isLegendVisible && legendWidth) || isBottomAligned) {
    return width - staticWidth;
  }

  const { value, unit } = parseValueAndUnit(legendWidth);
  return calculateAdjustedWidth(width, staticWidth, unit, value);
};

export const calculateAdjustedHight = (
  height: number,
  unit: string,
  value: number
) => {
  switch (unit) {
    case '%':
      return height * (1 - perToPx(value));
    case 'rem':
      return height - remToPx(value);
    case 'em':
      return height - emToPx(value);
    default:
      return height - value;
  }
};

export const getChartHeight = (
  height: number,
  isLegendVisible?: boolean,
  legendHeight?: string,
  isBottomAligned?: boolean
): number => {
  if (!(isLegendVisible && legendHeight && isBottomAligned)) {
    return height;
  }

  const { value, unit } = parseValueAndUnit(legendHeight);
  return calculateAdjustedHight(height, unit, value);
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

export const getLegendHeight = (
  height: number,
  chartHeight: number,
  unitType: string
) => {
  const size = height - chartHeight;

  switch (unitType) {
    case '%':
      return `${pxToPercent(size, height).toFixed(0)}%`;
    case 'rem':
      return `${pxToRem(size).toFixed(0)}rem`;
    case 'em':
      return `${pxToEm(size).toFixed(0)}em`;
    default:
      return `${size.toFixed(0)}px`;
  }
};

export const getLegendWidth = (
  width: number,
  chartWidth: number,
  leftLegendWidth: number,
  unitType: string
) => {
  const adjustedWidth = leftLegendWidth
    ? width - chartWidth - leftLegendWidth
    : width - chartWidth;

  switch (unitType) {
    case '%':
      return `${pxToPercent(adjustedWidth, width).toFixed(0)}%`;
    case 'rem':
      return `${pxToRem(adjustedWidth).toFixed(0)}rem`;
    case 'em':
      return `${pxToEm(adjustedWidth).toFixed(0)}em`;
    default:
      return `${adjustedWidth.toFixed(0)}px`;
  }
};

const getLegendStyleType = (type: string): string => {
  const styleTypes = ['%', 'rem', 'em', 'px']; // expected style types
  return styleTypes.find((styleType) => type.includes(styleType)) ?? 'px';
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
  const legendUnitType = useMemo(
    () => getLegendStyleType(legendWidth ?? '0px'),
    [legendWidth]
  );
  const isLegendVisible = legend?.visible ?? false;

  const [leftLegendRef, { width: leftLegendWidth }] =
    useMeasure<HTMLDivElement>();

  const [chartWidth, setChartWidth] = useState<number>(
    getChartWidth(
      width,
      leftLegendWidth,
      isLegendVisible,
      legendWidth,
      isBottomAligned
    )
  );
  const [chartHeight, setChartHeight] = useState<number>(
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
      setChartHeight(parseInt(data.size.height.toFixed(0)));
      onChartOptionsChange?.({
        legend: {
          ...legend,
          height: getLegendHeight(
            height,
            parseInt(data.size.height.toFixed(0)),
            legendUnitType
          ),
        },
      });
    } else {
      setChartWidth(parseInt(data.size.width.toFixed(0)));
      onChartOptionsChange?.({
        legend: {
          ...legend,
          width: getLegendWidth(
            width,
            leftLegendWidth,
            parseInt(data.size.width.toFixed(0)),
            legendUnitType
          ),
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
