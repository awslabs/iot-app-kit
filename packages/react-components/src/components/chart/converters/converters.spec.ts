import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { ChartLegend } from '../types';
import { convertXAxis, convertYAxis } from './convertAxis';
import { convertDataPoint } from './convertDataPoint';
import { convertGrid } from './convertGrid';
import { convertLegend } from './convertLegend';
import { convertOptions } from './convertOptions';
import { convertSeriesAndYAxis } from './convertSeriesAndYAxis';
import { convertTooltip } from './convertTooltip';

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
  backgroundColor: 'white',
  position: 'top',
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

it('converts axis to eCharts axis', async () => {
  const convertedXAxis = convertXAxis(MOCK_AXIS);
  const convertedYAxis = convertYAxis(MOCK_AXIS);

  expect(convertedXAxis).toHaveProperty('show', true);
  expect(convertedXAxis).toHaveProperty('type', 'time');

  expect(convertedYAxis).toHaveProperty('type', 'value');
  expect(convertedYAxis).toHaveProperty('name', MOCK_AXIS.yAxisLabel);
  expect(convertedYAxis).toHaveProperty('show', true);
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
  expect(convertedGrid).toHaveProperty('containLabel', false);
});

it('converts legend to echarts legend', async () => {
  const convertedLegend = convertLegend(MOCK_LEGEND);

  expect(convertedLegend).toHaveProperty('show', true);
  expect(convertedLegend).toHaveProperty('orient', 'horizontal');
  expect(convertedLegend).toHaveProperty('backgroundColor', 'white');
});

it('converts chart options to echarts options', async () => {
  const convertedOptions = convertOptions({
    queries: [],
    seriesLength: 0,
    backgroundColor: 'white',
    axis: MOCK_AXIS,
    legend: MOCK_LEGEND,
    significantDigits: 2,
  });

  expect(convertedOptions).toHaveProperty('title.text', 'No data present');
  expect(convertedOptions).toHaveProperty('backgroundColor', 'white');
  expect(convertedOptions).toHaveProperty('xAxis[0].show', true);
  expect(convertedOptions).toHaveProperty('xAxis[0].type', 'time');
  expect(convertedOptions).toHaveProperty('grid.bottom', 50);
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
  const convertedSeriesAndYAxisFunc = convertSeriesAndYAxis({
    ...options,
    defaultVisualizationType: 'step-start',
    styleSettings: { refId: { color: 'red' } },
  });
  const result = convertedSeriesAndYAxisFunc({ ...options, data: [], id: 'refId' });

  expect(result.series.data).toBeEmpty();
  expect(result).toHaveProperty('series.itemStyle.color', '#688ae8');
  expect(result).toHaveProperty('series.step', 'start');
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
  const convertedSeriesAndYAxisFunc = convertSeriesAndYAxis({
    ...options,
    defaultVisualizationType: 'step-start',
    styleSettings: { 'abc-1': { color: 'red' } },
  });
  const result = convertedSeriesAndYAxisFunc({ ...options, data: [], id: 'abc-1' });

  expect(result.series.data).toBeEmpty();
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
  const convertedSeriesAndYAxisFunc = convertSeriesAndYAxis({
    ...options,
    styleSettings: { 'abc-1': { color: 'red' } },
  });
  const result = convertedSeriesAndYAxisFunc({ ...options, data: [], id: 'abc-1' });

  expect(result.series.data).toBeEmpty();
  expect(result.series.name).toBeUndefined();
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
