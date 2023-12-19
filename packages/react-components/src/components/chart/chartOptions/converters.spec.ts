import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { ChartLegend } from '../types';
import { convertYAxis } from './axes/yAxis';
import { convertDataPoint } from './convertDataPoint';
import { convertGrid } from './convertGrid';
import { convertLegend } from './convertLegend';
import { convertSeriesAndYAxis } from './seriesAndYAxis/convertSeriesAndYAxis';
import { convertTooltip } from './convertTooltip';
import { convertStyles } from './style/convertStyles';
import { convertThresholds } from './convertThresholds';
import { useConvertedOptions } from './convertOptions';
import { renderHook } from '@testing-library/react';

const MOCK_AXIS = {
  yAxisLabel: 'Y Value',
  yMin: 0,
  yMax: 100,
  showY: true,
  showX: true,
};
const MOCK_DATA_POINTS = [
  { x: 1630005300000, y: 100 },
  { x: 1634005300000, y: 50 },
  { x: 1630005300000, y: 100 },
  { x: 1634005300000, y: 50 },
];
const MOCK_LEGEND: ChartLegend = {
  visible: true,
  position: 'right',
  width: '30%',
  height: '30%',
  visibleContent: {
    unit: true,
    asset: true,
  },
};
const DATA_STREAM = { id: 'abc-1', data: [], resolution: 0, name: 'my-name' };
const VIEWPORT = { duration: '5m' };
const QUERIES = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

describe('testing converters', () => {
  it('converts axis to eCharts axis', async () => {
    [
      {
        yLabel: 'Y Value',
        yMin: 0,
        yMax: 100,
        showY: true,
        showX: true,
      },
      {
        yLabel: 'Y Value',
        yMin: 0,
        yMax: 100,
        showY: false,
        showX: false,
      },
      {
        yLabel: 'Y Value',
        yMin: 0,
        yMax: 100,
        showY: true,
        showX: false,
      },
      {
        yLabel: 'Y Value',
        yMin: 0,
        yMax: 100,
        showY: false,
        showX: true,
      },
    ].forEach((axis_values) => {
      const convertedYAxis = convertYAxis(axis_values);

      expect(convertedYAxis).toHaveProperty('type', 'value');
      expect(convertedYAxis).toHaveProperty('name', axis_values.yLabel);
      expect(convertedYAxis).toHaveProperty('show', axis_values.showY);
    });
  });

  it('converts data points to echarts data points', async () => {
    const convertedDataPoints = MOCK_DATA_POINTS.map(convertDataPoint);
    expect(convertedDataPoints).toStrictEqual([
      [1630005300000, 100],
      [1634005300000, 50],
      [1630005300000, 100],
      [1634005300000, 50],
    ]);
  });

  it('converts grid to echarts grid', async () => {
    const convertedGrid = convertGrid(MOCK_LEGEND);

    expect(convertedGrid).toHaveProperty('bottom', 50);
    expect(convertedGrid).toHaveProperty('top', 50);
    expect(convertedGrid).toHaveProperty('containLabel');
  });

  it('converts legend to echarts legend', async () => {
    const convertedLegend = convertLegend(MOCK_LEGEND);

    expect(convertedLegend).toHaveProperty('show', true);
    expect(convertedLegend).toHaveProperty('orient', 'horizontal');
  });

  it('converts chart options to echarts options', async () => {
    const { result } = renderHook(() =>
      useConvertedOptions({
        options: { backgroundColor: 'white', axis: MOCK_AXIS, legend: MOCK_LEGEND, significantDigits: 2 },
        series: [],
      })
    );

    expect(result.current).toHaveProperty('backgroundColor', 'white');
    expect(result.current).toHaveProperty('grid.bottom', 50);
  });
  it('converts empty series data to echarts data', async () => {
    const options = {
      resolution: 0,
      queries: [],
      seriesLength: 0,
      backgroundColor: 'white',
      axis: MOCK_AXIS,
      legend: MOCK_LEGEND,
      significantDigits: 2,
    };

    const chartOptions = {
      styleSettings: { 'abc-1': { color: 'red' } },
      defaultVisualizationType: 'step-middle',
    } as const;
    const datastream = { ...options, data: [], id: 'abc-1', refId: 'abc-1' };
    const styles = convertStyles(chartOptions)(datastream);
    const convertedSeriesAndYAxisFunc = convertSeriesAndYAxis(styles);
    const result = convertedSeriesAndYAxisFunc(datastream);

    expect(result.series.data).toBeArrayOfSize(0);
    expect(result).toHaveProperty('series.itemStyle.color', 'red');
    expect(result).toHaveProperty('series.step', 'middle');
  });

  it('converts non empty series data to echarts data', async () => {
    const options = {
      resolution: 0,
      queries: [QUERIES],
      seriesLength: 1,
      backgroundColor: 'white',
      axis: MOCK_AXIS,
      legend: MOCK_LEGEND,
      significantDigits: 2,
    };
    const chartOptions = {
      defaultVisualizationType: 'step-start',
      styleSettings: { 'abc-1': { color: 'red' } },
    } as const;
    const datastream = { ...options, data: [], id: 'abc-1' };
    const styles = convertStyles(chartOptions)(datastream);
    const convertedSeriesAndYAxisFunc = convertSeriesAndYAxis(styles);
    const result = convertedSeriesAndYAxisFunc(datastream);

    expect(result.series.data).toBeArrayOfSize(0);
    expect(result).toHaveProperty('series.data', []);
    expect(result).toHaveProperty('series.step', 'start');
  });

  it('converts non empty series data with no default vis type to echarts data', async () => {
    const options = {
      resolution: 0,
      queries: [QUERIES],
      seriesLength: 1,
      backgroundColor: 'white',
      axis: MOCK_AXIS,
      legend: MOCK_LEGEND,
      significantDigits: 2,
    };

    const chartOptions = {
      styleSettings: { 'abc-1': { color: 'red' } },
    } as const;
    const datastream = { ...options, data: [], id: 'abc-1' };
    const styles = convertStyles(chartOptions)(datastream);
    const convertedSeriesAndYAxisFunc = convertSeriesAndYAxis(styles);
    const result = convertedSeriesAndYAxisFunc(datastream);

    expect(result.series.data).toBeArrayOfSize(0);
    // series name should fallback to id if no name is present
    expect(result.series.name).toEqual('abc-1');
    expect(result).toHaveProperty('series.step', false);
  });

  it('converts tooltip', async () => {
    const convertedTooltip = convertTooltip(2);

    expect(convertedTooltip).toHaveProperty('trigger', 'axis');
    expect(convertedTooltip.valueFormatter).toBeFunction();

    const valueFormatter = convertedTooltip.valueFormatter;
    if (valueFormatter) expect(valueFormatter(300)).toBe('300');
  });

  it('converts tooltip with value array', async () => {
    const convertedTooltip = convertTooltip(2);

    expect(convertedTooltip).toHaveProperty('trigger', 'axis');
    expect(convertedTooltip.valueFormatter).toBeFunction();

    const valueFormatter = convertedTooltip.valueFormatter;
    if (valueFormatter) expect(valueFormatter([300, 10, 20000])).toBe('300, 10, 20000');
  });
});

it('converts thresholds to echarts markLine and markArea', async () => {
  const convertedThresholds = convertThresholds([
    {
      comparisonOperator: 'EQ',
      color: 'red',
      value: 10,
    },
    {
      comparisonOperator: 'CONTAINS',
      color: 'blue',
      value: 'SomeString',
    },
    {
      comparisonOperator: 'LTE',
      color: 'green',
      value: 15,
    },
    {
      comparisonOperator: 'GT',
      color: 'green',
      value: 5,
    },
  ]);

  expect(convertedThresholds).toHaveProperty('markLine.data[0].yAxis', 10);
  expect(convertedThresholds).toHaveProperty('markLine.data[1].yAxis', 15);
  expect(convertedThresholds).toHaveProperty('markLine.data[2].yAxis', 5);

  expect(convertedThresholds).toHaveProperty('markArea.data[0][0].yAxis', 10);
  expect(convertedThresholds).toHaveProperty('markArea.data[0][1].yAxis', 10);
  expect(convertedThresholds).toHaveProperty('markArea.data[1][0].yAxis', undefined);
  expect(convertedThresholds).toHaveProperty('markArea.data[1][1].yAxis', 15);
  expect(convertedThresholds).toHaveProperty('markArea.data[2][0].yAxis', 5);
  expect(convertedThresholds).toHaveProperty('markArea.data[2][1].yAxis', undefined);
});
