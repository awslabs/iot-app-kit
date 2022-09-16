import { DataStreamId, MinimalViewPortConfig, Resolution } from '@synchro-charts/core';
import { DataStream } from '../types';

export type DateInterval = { start: Date; end: Date };

export type Viewport =
  | { start: Date; end: Date; yMin?: number; yMax?: number; group?: string }
  | { duration: string | number; yMin?: number; yMax?: number; group?: string };

/**
 * Request Information utilized by consumers of the widgets to connect the `data-provider` to their data source.
 */
export type TimeSeriesDataRequest = {
  viewport: MinimalViewPortConfig;
  settings?: TimeSeriesDataRequestSettings;
};

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
  onError: (dataStreamId: DataStreamId, resolution: Resolution, error: string) => void;
  onSuccess: (dataStreamId: DataStreamId, dataStream: DataStream, first: Date, last: Date) => void;
  dataStreamId: string;
}) => void;

export type ResolutionMapping = {
  [viewportDuration: number]: number | string;
};
