import { AggregateType } from '@aws-sdk/client-iotsitewise';
import type { DataStream, DataStreamId } from '../types';

export type DateInterval = { start: Date; end: Date };

export type DurationViewport = { duration: string | number; group?: string };
export type HistoricalViewport = { start: Date; end: Date; group?: string };

export type Viewport = DurationViewport | HistoricalViewport;

export type DataRequest = {
  viewport?: Viewport;
  settings?: TimeSeriesDataRequestSettings;
};
/**
 * Request Information utilized by consumers of the widgets to connect the `data-provider` to their data source.
 */
export interface TimeSeriesDataRequest extends DataRequest {
  viewport: Viewport;
}

export type ResolutionConfig = ResolutionMapping | string;

export interface TimeSeriesDataRequestSettings {
  // Higher buffer will lead to more off-viewport data to be requested.
  requestBuffer?: number;

  // refresh rate in milliseconds
  refreshRate?: number;

  resolution?: ResolutionConfig;

  // Specify what data intervals to request given a viewport
  fetchFromStartToEnd?: boolean;
  fetchMostRecentBeforeStart?: boolean;
  fetchMostRecentBeforeEnd?: boolean;
}

export type OnRequestData = (opts: {
  request: TimeSeriesDataRequest;
  resolution: number; // milliseconds, 0 for raw data
  onError: (
    dataStreamId: DataStreamId,
    resolution: number,
    error: string,
    aggregationType?: AggregateType
  ) => void;
  onSuccess: (
    dataStreamId: DataStreamId,
    dataStream: DataStream,
    first: Date,
    last: Date
  ) => void;
  dataStreamId: string;
}) => void;

export type ResolutionMapping = {
  [viewportDuration: number]: number | string;
};
