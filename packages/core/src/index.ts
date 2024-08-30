export * from './data-module/data-cache/requestTypes';
export * from './data-module/types';
export * from './common/types';

export { combineProviders } from './common/combineProviders';
export { round } from './common/number';

// Data utilities
export {
  getVisibleData,
  getDataBeforeDate,
  pointBisector,
} from './common/dataFilters';
export { toSiteWiseAssetProperty } from './common/dataStreamId';

// Viewport utilities
export { parseDuration } from './common/time';
export { viewportManager } from './viewportManager/viewportManager';
export { isHistoricalViewport, isDurationViewport } from './common/predicates';
export { viewportEndDate, viewportStartDate } from './common/viewport';

// Edge utilities
export { isEdgeModeEnabled, type EdgeMode } from './edge/types';

// Exposed but for internal usage only. Liable to change.
export { TimeSeriesDataModule } from './data-module/TimeSeriesDataModule';

export {
  DATA_TYPE,
  STREAM_TYPE,
  COMPARISON_OPERATOR,
  STATUS_ICON_TYPE,
} from './common/constants';

export const NANO_SECOND_IN_MS = 1 / 1000000;
export const SECOND_IN_MS = 1000;
export const MINUTE_IN_MS = 60 * SECOND_IN_MS;
export const HOUR_IN_MS = 60 * MINUTE_IN_MS;
export const DAY_IN_MS = 24 * HOUR_IN_MS;

export type { Log, Logger } from './logger/logger.interface';
export type {
  Metric,
  MetricsRecorder,
} from './metricRecorder/metricsRecorder.interface';
export { registerPlugin, getPlugin } from './plugins/pluginsRegistry';

// Request functions
export type {
  PickRequestParameters,
  RequestFunction,
  RequestFunctions,
  RequestParameters,
  RequestResponse,
  RequestTimeout,
  GetAssetPropertyValue,
  BatchGetAssetPropertyValue,
  GetAssetPropertyValueHistory,
  BatchGetAssetPropertyValueHistory,
  ExecuteQuery,
  ListAssetModels,
  ListAssetModelProperties,
  ListAssets,
  ListAssociatedAssets,
  ListTimeSeries,
  ListAssetProperties,
  DescribeAsset,
  DescribeAssetModel,
  DescribeAlarmModel,
} from './requestFunctions/types';
