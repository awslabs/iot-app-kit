export type DurationViewport = { duration: string | number; group?: string };
export type HistoricalViewport = { start: Date; end: Date; group?: string };

export type Viewport = DurationViewport | HistoricalViewport;

export interface DataRequest {
  viewport?: Viewport;
  settings?: TimeSeriesDataRequestSettings;
}

/**
 * Request Information utilized by consumers of the widget-instance to connect the `data-provider` to their data source.
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

export interface ResolutionMapping {
  [viewportDuration: number]: number | string;
}
