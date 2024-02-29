import { renderHook, act } from '@testing-library/react-hooks';
import {
  useResizeableEChart,
  getChartHeight,
  getChartWidth,
  getRightLegendHeight,
  getRightLegendWidth,
  calculateAdjustedWidth,
  calculateAdjustedHight,
  getLegendHeight,
  getLegendWidth,
} from './useResizeableEChart';
import { ChartOptions } from '../../components/chart/types';
import { ResizeCallbackData } from 'react-resizable';
import { perToPx } from '../utils/pxConversion';

describe('useResizeableEChart', () => {
  describe('render chart when legend is not visible', () => {
    const chartRef = { current: null };
    const size = { width: 1000, height: 500 };
    const legend: ChartOptions['legend'] = {
      width: '30%',
      height: '30%',
      visible: false,
    };
    const onChartOptionsChange = jest.fn();
    const isBottomAligned = false;

    it('should set initial chart width and height correctly', () => {
      const { result } = renderHook(() =>
        useResizeableEChart(
          chartRef,
          size,
          legend,
          isBottomAligned,
          onChartOptionsChange
        )
      );

      expect(result.current.chartWidth).toBe(size.width);
      expect(result.current.chartHeight).toBe(size.height);
    });
  });

  describe('render chart when legend is visible and not bottom aligned', () => {
    const chartRef = { current: null };
    const size = { width: 1000, height: 500 };
    const legend: ChartOptions['legend'] = {
      width: '30%',
      height: '30%',
      visible: true,
    };
    const onChartOptionsChange = jest.fn();
    const isBottomAligned = false;

    it('should set initial chart width and height correctly', () => {
      const { result } = renderHook(() =>
        useResizeableEChart(
          chartRef,
          size,
          legend,
          isBottomAligned,
          onChartOptionsChange
        )
      );

      expect(result.current.chartWidth).toBe(700);
      expect(result.current.chartHeight).toBe(size.height);
    });

    it('should update chart width and call onChartOptionsChange when resizing horizontally', () => {
      const { result } = renderHook(() =>
        useResizeableEChart(
          chartRef,
          size,
          legend,
          isBottomAligned,
          onChartOptionsChange
        )
      );

      act(() => {
        const event = {
          stopPropagation: jest.fn(),
        } as unknown as React.SyntheticEvent;
        result.current.onResize(event, {
          size: { width: 800, height: 400 },
        } as unknown as ResizeCallbackData);
      });

      expect(result.current.chartWidth).toBe(800);
      expect(onChartOptionsChange).toHaveBeenCalledWith({
        legend: { ...legend, width: '20%' },
      });
    });
  });

  describe('render chart when legend is visible and bottom aligned', () => {
    const chartRef = { current: null };
    const size = { width: 1000, height: 500 };
    const legend: ChartOptions['legend'] = {
      width: '30%',
      height: '30%',
      visible: true,
    };
    const onChartOptionsChange = jest.fn();
    const isBottomAligned = true;

    it('should set initial chart width and height correctly when bottom aligned', () => {
      const { result } = renderHook(() =>
        useResizeableEChart(
          chartRef,
          size,
          legend,
          isBottomAligned,
          onChartOptionsChange
        )
      );

      expect(result.current.chartWidth).toBe(size.width);
      expect(result.current.chartHeight).toBe(350);
    });

    it('should update chart height and call onChartOptionsChange when resizing vertically', () => {
      const { result } = renderHook(() =>
        useResizeableEChart(
          chartRef,
          size,
          legend,
          isBottomAligned,
          onChartOptionsChange
        )
      );

      act(() => {
        const event = {
          stopPropagation: jest.fn(),
        } as unknown as React.SyntheticEvent;
        result.current.onResize(event, {
          size: { width: 800, height: 400 },
        } as unknown as ResizeCallbackData);
      });

      expect(result.current.chartWidth).toBe(size.width);
      expect(onChartOptionsChange).toHaveBeenCalledWith({
        legend: { ...legend, height: '20%' },
      });
    });
  });

  describe('render getChartWidth', () => {
    it('should return width - staticWidth when isLegendVisible and legendWidth are falsy or isBottomAligned is true', () => {
      expect(getChartWidth(100, 10)).toBe(90);
      expect(getChartWidth(200, 20, false, '', true)).toBe(180);
    });

    it('should return the calculated width based on the formula when isLegendVisible and legendWidth are truthy and isBottomAligned is falsy', () => {
      expect(getChartWidth(300, 30, true, '50%')).toBe(120);
      expect(getChartWidth(400, 40, true, '75%')).toBe(60);
    });
  });

  describe('render getChartHeight', () => {
    it('should return the original height if any of the optional arguments are missing', () => {
      const height = 100;
      const result = getChartHeight(height);
      expect(result).toEqual(height);
    });

    it('should return the calculated height if all optional arguments are provided', () => {
      const height = 100;
      const isLegendVisible = true;
      const legendHeight = '50%';
      const isBottomAligned = true;
      const expected =
        height * (1 - perToPx(parseInt(legendHeight.split('%')[0])));
      const result = getChartHeight(
        height,
        isLegendVisible,
        legendHeight,
        isBottomAligned
      );
      expect(result).toEqual(expected);
    });
  });

  describe('render getRightLegendWidth', () => {
    it('should return 0 when isLegendVisible is false', () => {
      const result = getRightLegendWidth(false, true, 100, 50, 200);
      expect(result).toEqual(0);
    });

    it('should return width when isBottomAligned is true', () => {
      const result = getRightLegendWidth(true, true, 100, 50, 200);
      expect(result).toEqual(100);
    });

    it('should return width - leftLegendWidth - chartWidth when isBottomAligned is false', () => {
      const result = getRightLegendWidth(true, false, 100, 20, 30);
      expect(result).toEqual(50);
    });
  });

  describe('render getRightLegendHeight', () => {
    it('should return 0 if legend is not visible', () => {
      const isLegendVisible = false;
      const isBottomAligned = true;
      const height = 100;
      const chartHeight = 50;

      const result = getRightLegendHeight(
        isLegendVisible,
        isBottomAligned,
        height,
        chartHeight
      );

      expect(result).toBe(0);
    });

    it('should return the height if legend is visible and bottom aligned', () => {
      const isLegendVisible = true;
      const isBottomAligned = true;
      const height = 100;
      const chartHeight = 50;

      const result = getRightLegendHeight(
        isLegendVisible,
        isBottomAligned,
        height,
        chartHeight
      );

      expect(result).toBe(height - chartHeight);
    });

    it('should return the height if legend is visible and not bottom aligned', () => {
      const isLegendVisible = true;
      const isBottomAligned = false;
      const height = 100;
      const chartHeight = 50;

      const result = getRightLegendHeight(
        isLegendVisible,
        isBottomAligned,
        height,
        chartHeight
      );

      expect(result).toBe(height);
    });
  });
});

describe('calculateAdjustedWidth', () => {
  it('should correctly adjust width when unit is percentage', () => {
    const result = calculateAdjustedWidth(100, 10, '%', 20);
    expect(result).toEqual(70);
  });

  it('should correctly adjust width when unit is neither percentage, rem, nor em', () => {
    const result = calculateAdjustedWidth(100, 10, 'px', 15);
    expect(result).toEqual(75);
  });
});

describe('calculateAdjustedHight', () => {
  it('should correctly adjust height when unit is percentage', () => {
    const result = calculateAdjustedHight(100, '%', 20);
    expect(result).toEqual(80);
  });

  it('should correctly adjust height when unit is neither percentage, rem, nor em', () => {
    const result = calculateAdjustedHight(100, 'px', 15);
    expect(result).toEqual(85);
  });
});

describe('getLegendHeight', () => {
  it('should return the correct legend height when unit type is percentage', () => {
    const result = getLegendHeight(100, 30, '%');
    expect(result).toEqual('70%');
  });

  it('should return the correct legend height when unit type is rem', () => {
    const result = getLegendHeight(100, 30, 'rem');
    expect(result).toEqual('4rem');
  });

  it('should return the correct legend height when unit type is neither percentage, rem, nor em', () => {
    const result = getLegendHeight(100, 30, 'px');
    expect(result).toEqual('70px');
  });
});

describe('getLegendWidth', () => {
  it('should return the correct legend width when unit type is percentage', () => {
    const result = getLegendWidth(100, 70, 10, '%');
    expect(result).toEqual('20%');
  });

  it('should return the correct legend width when unit type is rem', () => {
    const result = getLegendWidth(100, 70, 10, 'rem');
    expect(result).toEqual('1rem');
  });

  it('should return the correct legend width when unit type is neither percentage, rem, nor em', () => {
    const result = getLegendWidth(100, 70, 10, 'px');
    expect(result).toEqual('20px');
  });
});
