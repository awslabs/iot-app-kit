import { DataStream, DataStreamId, MinimalViewPortConfig, Resolution } from '@synchro-charts/core';

export type DateInterval = { start: Date; end: Date };

export type Viewport =
  | DateInterval
  | { duration: number /* duration in milliseconds, omit for non-live view of data. */ };

/**
 * Request Information utilized by consumers of the widgets to connect the `data-provider` to their data source.
 */
export type Request = {
  viewport: MinimalViewPortConfig;
  // when this is true, we only require the latest value to be returned when in a live view, and will return most recent when in a historical view.
  onlyFetchLatestValue: boolean;
  // how long before waiting to check if another request should be initiated, in ms
  refreshRate?: number;
  requestConfig?: RequestConfig;
};

export type OnRequestData = (opts: {
  request: Request;
  resolution: number; // milliseconds, 0 for raw data
  onError: (id: DataStreamId, resolution: Resolution, error: string) => void;
  onSuccess: (id: DataStreamId, data: DataStream, first: Date, last: Date) => void;
  dataStreamId: string;
}) => void;

export type ResolutionMapping = {
  [viewportDuration: number]: number | string;
};

export type ResolutionConfig = ResolutionMapping | string;

export interface RequestConfig {
  fetchMostRecentBeforeStart?: boolean;
  requestBuffer?: number;
  fetchAggregatedData?: boolean;
  resolution?: ResolutionConfig;
}
