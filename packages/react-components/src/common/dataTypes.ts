import { StatusIconType } from './constants';
import type { DataPoint } from '@iot-app-kit/core';

/**
 * Types which represent the data and data streams.
 */

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
  noDataStreamsPresentSubHeader:
    "This widget doesn't have any properties or alarms.",
  noDataPresentHeader: 'No data',
  noDataPresentSubHeader: "There's no data to display for this time range.",
  liveModeOnly:
    'This visualization displays only live data. Choose a live time frame to display data in this visualization.',
  unsupportedDataTypeHeader: 'Unable to render your data',
  unsupportedDataTypeSubHeader:
    'This chart only supports the following DataType(s):',
  supportedTypes: 'Number, String, Boolean',
};

// Generic properties for single value display visualizations
export type WidgetSettings = {
  color?: string; // hex color string
  propertyPoint?: DataPoint;
  alarmPoint?: DataPoint;
  icon?: StatusIconType;
  unit?: string;
  error?: string;
  name?: string;
  detailedName?: string;
  aggregationType?: string;
  isLoading?: boolean;
  significantDigits?: number;
};
