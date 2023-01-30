import { StyleSettingsMap, Viewport } from '@iot-app-kit/core';

import { Annotations } from '../components/charts/common/types';
import { DataType, StreamType } from './dataConstants';

/**
 * Types which represent the data and data streams.
 */

export type Primitive = string | number | boolean;

export type ThresholdDataTypes = string | string[] | number | boolean;

export type Timestamp = number;

export type DataPoint<T extends Primitive = Primitive> = { x: Timestamp; y: T };

// An id associated to a data stream. used to relate streams to data stream infos, and streams to other streams.
export type DataStreamId = string;

// An association to a stream of a given type. Allows a semantic understanding of how different data streams are associated,
// to enable rich functionality within various SynchroChart widgets
//
// I.e. to express that a given property has an alarm associated with it, we would specify that the property, contains
// a stream association of type ALARM.
export type StreamAssociation = {
  id: DataStreamId;
  type: StreamType;
};

/**
 * Utilized for the `table` component, to map data-streams to cells.
 */
export type TableColumn = {
  header: string; // table header
  // The rows which make up this column, the first entry being the first index of the array.
  // If multiple columns are placed together with different number of rows, the rows 'below' the last row
  // on the 'shorter' columns will all just be empty cells.
  rows: (DataStreamId | undefined)[]; // undefined rows will be 'empty' grid cells
};

/**
 * Data Stream Info
 *
 * A view model representation of a data stream.
 * Is utilized to request and display data within widgets
 */
export interface DataStreamInfo {
  id: DataStreamId;
  resolution: number;
  name?: string;
  color?: string;
  dataType: DataType;
  unit?: string;
  detailedName?: string;
  streamType?: StreamType;
  associatedStreams?: StreamAssociation[];
}

/**
 * Minimal Size Configuration request for implementing a component
 */
export interface MinimalSizeConfig {
  width?: number; // Full width of widget, including margins
  height?: number; // Full height of widget, including margins
  // Margins, which are provided by default if left off by the widget.
  // Widgets should be designed not to require custom margins to be presented in an expected manner
  marginRight?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
}

/**
 * Size Configuration
 *
 * An internal model which widgets utilize internally,
 * after the default margins are set.
 */
export interface SizeConfig extends MinimalSizeConfig {
  width: number;
  height: number;
  marginRight: number;
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
}

export interface SizePositionConfig extends SizeConfig {
  x: number;
  y: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface MinimalViewportConfigBase {
  // The identifier for the viewport group which the widget will belong to. All widgets within a viewport group
  // will have their viewports 'synced' to the same value, i.e. if you pan on one chart, all charts within
  // the viewport group will view the same data.
  // Omitting the `group` results in the widget not being part of any viewport group.
  group?: string;

  yMin?: number;
  yMax?: number;

  // NOTE: Deprecated
  // A unique identifier of the updater of the viewport. Utilized to prevent widgets from re-applying updates they've already applied.
  lastUpdatedBy?: string;
}

export interface MinimalStaticViewport extends MinimalViewportConfigBase {
  start: Date | string;
  end: Date | string;
}

export interface MinimalLiveViewport extends MinimalViewportConfigBase {
  // include to specify that a widget is in live mode. in milliseconds.
  duration: number | string;
}

export type MinimalViewPortConfig = MinimalStaticViewport | MinimalLiveViewport;

/**
 * View Port
 *
 * The view port defines the domain and range of the data of which we would like to visualize/analyze.
 */
export type ViewPortConfig = MinimalViewPortConfig & {
  yMin: number;
  yMax: number;
};

export type ViewPort = MinimalViewPortConfig & {
  start: Date;
  end: Date;
  yMin: number;
  yMax: number;
  duration?: number;
};

/**
 * Alarms Configuration
 *
 * Configurations to the interoperation of alarm data.
 */
export type AlarmsConfig = {
  // Duration in MS of how long a data point is considered not stale.
  // The implication is this sets a max-duration of how a status is visualized on the status-timelinme.
  // No staleness defined implies never stale, i.e. a status-timeline 'bar' extends up to to next point, or to 'now', which ever comes first.
  expires?: number; // should be value such that x > = or x as `undefined`
};

/**
 * Base Config
 *
 * The base configuration of which all widgets must implement.
 * Widgets may however implement more than what is given in the base config.
 */
export interface BaseConfig {
  // A unique identifier to the widget
  widgetId: string;
  // The viewport in which the widget analyzes/visualizes data.
  viewport: MinimalViewPortConfig | ViewPortConfig;
  // Exact pixel dimensions of the widget
  size?: MinimalSizeConfig;
}

/**
 * Messages which can be customized. i.e. for internationalization, or business domain specific jargon.
 */
export type MessageOverrides = {
  /** value label utilized in some widgets */
  liveTimeFrameValueLabel?: string;
  historicalTimeFrameValueLabel?: string;
  /** no data streams present - msg displayed when there are no data streams present */
  noDataStreamsPresentHeader?: string;
  noDataStreamsPresentSubHeader?: string;
  /** no data present - msg displayed when no streams have any data */
  noDataPresentHeader?: string;
  noDataPresentSubHeader?: string;
  liveModeOnly?: string;
  /** unsupported data type - msg displayed when a dataStream has a invalid type */
  unsupportedDataTypeHeader?: string;
  unsupportedDataTypeSubHeader?: string;
  supportedTypes?: string;
};
export const DEFAULT_MESSAGE_OVERRIDES: Required<MessageOverrides> = {
  liveTimeFrameValueLabel: 'Value',
  historicalTimeFrameValueLabel: 'Value',
  noDataStreamsPresentHeader: 'No properties or alarms',
  noDataStreamsPresentSubHeader: "This widget doesn't have any properties or alarms.",
  noDataPresentHeader: 'No data',
  noDataPresentSubHeader: "There's no data to display for this time range.",
  liveModeOnly:
    'This visualization displays only live data. Choose a live time frame to display data in this visualization.',
  unsupportedDataTypeHeader: 'Unable to render your data',
  unsupportedDataTypeSubHeader: 'This chart only supports the following DataType(s):',
  supportedTypes: 'Number, String, Boolean',
};

/** SVG Constants */
export const STREAM_ICON_STROKE_LINECAP = 'round';
export const STREAM_ICON_STROKE_WIDTH = 3;
export const STREAM_ICON_PATH_COMMAND = 'M 2 2 H 15';
export const TREND_ICON_DASH_ARRAY = '1, 5';

/**
 * Data Stream
 *
 * Note that each data point represents an interval of data which has a time period of `resolution` milliseconds,
 *
 * An aggregation period of a `DataPoint` at time `t`, and `Resolution` `r` (a time duration),
 * is represented by the time interval `(t - r, t]`. i.e. the time interval `t - r` exclusive, to `t` inclusive.
 *
 * A `resolution` of `0` implies that there is no aggregation occurring, and that the data represents a single point in time,
 * of which has no duration.
 */
export interface DataStream<T extends Primitive = Primitive> extends DataStreamInfo {
  id: DataStreamId;

  // The short form name associated with the data stream
  name?: string;

  // Long form name, utilized in places with more real-estate
  detailedName?: string;

  // The color to represent the data when visualized
  color?: string;

  // The unit associated with the values contained within the data stream
  unit?: string;

  // Raw data (non-aggregated) for the stream
  data: DataPoint<T>[];

  // Collection of various aggregates available for the data stream
  aggregates?: {
    [resolution: number]: DataPoint<T>[] | undefined;
  };

  // Mechanism to associate some information about the data stream
  meta?: Record<string, string | number | boolean>;

  dataType: DataType;
  streamType?: StreamType;
  associatedStreams?: StreamAssociation[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  error?: string;
  resolution: number; // length of aggregation period in milliseconds. 0 implies no aggregations.
}

/**
 * Resolution
 *
 * Represents the number of milliseconds that each data point represents
 *
 * If I have a resolution of one minute, that means each data point represents an interval of one minutes worth of data.
 *
 * If I have a resolution of zero, that means the data is "raw data", or, each data point represents a
 * a single point in time (which is an interval of time with a duration of zero).
 */
export type Resolution = number;

export interface ProviderObserver<DataType> {
  next: (data: DataType) => void;
  error?: (error: any) => void;
}

export interface Provider<Result> {
  subscribe(observer: ProviderObserver<Result>): void;
  unsubscribe(): void;
}

export interface ProviderWithViewport<Result> extends Provider<Result> {
  updateViewport(viewport: MinimalViewPortConfig): void;
}

export type TimeSeriesData = {
  dataStreams: DataStream[];
  viewport: MinimalViewPortConfig;
  annotations: Annotations;
};

export interface TimeSeriesConnectorProps {
  annotations: Annotations;
  provider: ProviderWithViewport<TimeSeriesData[]>;
  renderFunc: (data: TimeSeriesData) => JSX.Element;
  initialViewport?: Viewport;
  styleSettings?: StyleSettingsMap;
  assignDefaultColors?: boolean;
}
