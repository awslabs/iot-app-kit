import { DataStream, DataStreamId, Resolution } from '@synchro-charts/core';

export type DateInterval = { start: Date; end: Date };

export type RequestDataFn = ({ start, end }: DateInterval) => void;

export type Viewport =
  | DateInterval
  | { duration: number /* duration in milliseconds, omit for non-live view of data. */ };

/**
 * Request Information utilized by consumers of the widgets to connect the `data-provider` to their data source.
 */
export type RequestInfo = Viewport & {
  // when this is true, we only require the latest value to be returned when in a live view, and will return most recent when in a historical view.
  onlyFetchLatestValue: boolean;
  requestConfig?: RequestConfig;
};

export type OnRequestData = (opts: {
  request: RequestInfo;
  resolution: number; // milliseconds, 0 for raw data
  onError: (id: DataStreamId, resolution: Resolution, error: string) => void;
  onSuccess: (id: DataStreamId, data: DataStream, first: Date, last: Date) => void;
  dataStreamId: string;
}) => void;

export interface RequestConfig {
  fetchMostRecentBeforeStart: boolean;
}
