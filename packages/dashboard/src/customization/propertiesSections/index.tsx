export { PropertiesPanel } from './propertiesPanel';

const BarChartFeatures = {
  aggregations: ['avg', 'count', 'max', 'min', 'sum', 'standard_deviation'],
  resolutions: ['1m', '15m', '1h', '1d'],
  axisSettings: true,
};

const XYPlotFeatures = {
  aggregations: ['avg', 'count', 'max', 'min', 'sum', 'standard_deviation'],
  resolutions: ['1m', '15m', '1h', '1d', '0'],
  axisSettings: true,
};

const KPIFeatures = {
  resolutions: ['0'],
};

const StatusTimelineFeatures = {
  resolutions: ['0'],
  axisSettings: true,
};

const StatusFeatures = {
  resolutions: ['0'],
};

const TableFeatures = {
  resolutions: ['0'],
};

const TextFeatures = {};
