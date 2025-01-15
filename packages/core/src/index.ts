export * from './common/types';
export * from './data-module/data-cache/requestTypes';
export * from './data-module/types';

export { combineProviders } from './common/combineProviders';
export { isNumeric, round } from './common/number';

// Data utilities
export {
  getDataBeforeDate,
  getVisibleData,
  pointBisector,
} from './common/dataFilters';
export { toSiteWiseAssetProperty } from './common/dataStreamId';

// Viewport utilities
export { isDurationViewport, isHistoricalViewport } from './common/predicates';
export { parseDuration } from './common/time';
export { viewportEndDate, viewportStartDate } from './common/viewport';
export { viewportManager } from './viewportManager/viewportManager';

// Edge utilities
export { isEdgeModeEnabled, type EdgeMode } from './edge/types';

// Exposed but for internal usage only. Liable to change.
export { TimeSeriesDataModule } from './data-module/TimeSeriesDataModule';

export {
  COMPARISON_OPERATOR,
  DATA_TYPE,
  STATUS_ICON_TYPE,
  STREAM_TYPE,
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
export { getPlugin, registerPlugin } from './plugins/pluginsRegistry';

// Request functions
export type {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
  DescribeAlarmModel,
  DescribeAsset,
  DescribeAssetModel,
  ExecuteQuery,
  GetAssetPropertyValue,
  GetAssetPropertyValueHistory,
  ListAssetModelProperties,
  ListAssetModels,
  ListAssetProperties,
  ListAssets,
  ListAssociatedAssets,
  ListTimeSeries,
  PickRequestParameters,
  RequestFunction,
  RequestFunctions,
  RequestParameters,
  RequestResponse,
  RequestTimeout,
} from './requestFunctions';
