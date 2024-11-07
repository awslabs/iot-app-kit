import {
  type AggregateType,
  type AssetModelProperty,
  type AssetProperty,
  type AssetPropertyValue,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import {
  type DescribeAlarmModelResponse,
  type IoTEventsClient,
} from '@aws-sdk/client-iot-events';

import type { DataStream, ResolutionConfig, Viewport } from '@iot-app-kit/core';
import { type AlarmDataQuery } from '@iot-app-kit/source-iotsitewise';

/**
 * Execution status of the alarms queries
 */
export type AlarmDataStatus = {
  isLoading: boolean; // will be true when fetching initial values for the alarm
  isRefetching: boolean; // will be true whenever subsequent api calls are being executed
  isSuccess: boolean;
  isError: boolean;
  error?: Error;
};

/**
 * The SiteWise property construct for the alarm state, type, and source
 * Reference the entire asset or assetModel property object and its data values
 */
export type AlarmProperty = {
  property: AssetProperty | AssetModelProperty;
  data?: AssetPropertyValue[];
};

/**
 * An alarm construct containing the collection of API responses from IoT SiteWise
 * and IoT Events that define an alarm.
 */
export type AlarmData = {
  /**
   * The asset model where a SiteWise alarm composite model is defined.
   */
  assetModelId?: string;

  /**
   * The asset where a SiteWise alarm is instantiated.
   * Not defined if alarm is requested for an asset model.
   */
  assetId?: string;

  /**
   * The input property or properties an alarm is constructed with.
   * Currently only a single input property is supported in a SiteWise and Events alarm.
   *
   * This is undefined if the SiteWise alarm type is "EXTERNAL".
   */
  inputProperty?: {
    property: AssetProperty | AssetModelProperty;
    dataStream?: DataStream;
  }[];

  /**
   * The id for the SiteWise alarm composite model.
   */
  compositeModelId?: string;

  /**
   * The name for the SiteWise alarm composite model.
   */
  compositeModelName?: string;

  /**
   * state | type | source
   *
   * These are the SiteWise alarm composite model properties and their values.
   * The data points are all TQV points and assumed to be
   * sorted in ascending order by Time.
   *
   * If an alarm is requested for an asset model the values will only be defined
   * if there is a default value for each property.
   *
   * Note: The state property is a complex data type.
   */
  state?: AlarmProperty;

  /**
   * The SiteWise alarm type ("IOT_EVENTS" | "EXTERNAL")
   */
  type?: AlarmProperty;

  /**
   * The Events alarm model source ARN. Only supported for "IOT_EVENTS" alarm type.
   */
  source?: AlarmProperty;

  /**
   * The list of alarm threshold values if modeled by a SiteWise asset property.
   * The threshold asset property is dependent on the Events alarm model definition
   * and can change in different model versions. The associated asset property
   * will not be reflected with the values here.
   */
  thresholds?: AssetPropertyValue[];

  /**
   * A list of version definitions for the IoT Events alarm model.
   *
   * It is possible to use the creationTime / lastUpdateTime
   * to associate an alarm state with a particular alarm model version.
   */
  models?: DescribeAlarmModelResponse[];

  /**
   * Execution status of the alarms queries
   */
  status: AlarmDataStatus;
};

/**
 * AlarmData with additional fields for internal processing
 */
export type AlarmDataInternal = {
  /**
   * The alarm request which spawned the alarm.
   */
  request?: AlarmRequest;

  /**
   * The list of asset or assetModel properties on the alarm's asset.
   * Used to assign a property object to the inputProperty field.
   */
  properties?: (AssetProperty | AssetModelProperty)[];
} & AlarmData;

/**
 * Request data for a single alarm by its composite model id.
 * Results in a 1 to 1 - request to alarm model.
 */
export type AlarmCompositeModelRequest = {
  assetId: string;
  assetCompositeModelId: string;
  inputPropertyId?: never;
  assetModelId?: never;
};

/**
 * Request data for all alarms that use an input asset property
 * as the input to the alarm.
 * Results in a 1 to many - request to alarm models.
 * Only supported for the "IOT_EVENTS" SiteWise alarm type.
 *
 * Note: Will only consider whether this
 * property is currently describing an alarm and not
 * an older version of an Events alarm model.
 */
export type AlarmInputPropertyRequest = {
  assetId: string;
  inputPropertyId: string;
  assetCompositeModelId?: never;
  assetModelId?: never;
};

/**
 * Request data for all alarms on an asset.
 * Results in a 1 to many - request to alarm models.
 */
export type AlarmAssetRequest = {
  assetId: string;
  inputPropertyId?: never;
  assetCompositeModelId?: never;
  assetModelId?: never;
};

/**
 * Request metadata for all alarms on an asset model.
 * Results in a 1 to many - request to alarm models.
 *
 * Note: only alarm composite model descriptions are available
 * on asset models. There is no data without an asset instance.
 */
export type AlarmAssetModelRequest = {
  assetModelId: string;
  assetId?: never;
  inputPropertyId?: never;
  assetCompositeModelId?: never;
};

export type AlarmRequest =
  | AlarmCompositeModelRequest
  | AlarmInputPropertyRequest
  | AlarmAssetRequest
  | AlarmAssetModelRequest;

/**
 * Settings for the useAlarms hook
 */
export interface UseAlarmsHookSettings {
  /**
   * Fetch all the input property time series data
   */
  fetchInputPropertyData?: boolean; // default false

  fetchThresholds?: boolean; // default false
  /**
   * Limit the GET apis to size one, fetching most recent before end of viewport.
   * Useful for KPI / Gauge / Table / etc.
   */
  fetchOnlyLatest?: boolean;
  /**
   * Time to refresh latest alarm data in milliseconds.
   * Related to the @iot-app-kit/core `QueryRequestSettings` type.
   */
  refreshRate?: number;
}

export interface UseAlarmsInputPropertyTimeSeriesDataSettings {
  aggregationType?: AggregateType;
  resolution?: string;
  resolutionConfig?: ResolutionConfig;
}

/**
 * useAlarms hook interface
 *
 * Given a list of AlarmRequests, fetch all available data for the alarms.
 *
 * The return type is generic and defined by the `transform` callback option.
 *
 * A default implementation of `transform` is provided, but it is flexible
 * for different alarm use cases.
 */
export interface UseAlarmsOptions<T = AlarmData> {
  iotSiteWiseClient?: IoTSiteWiseClient;

  iotEventsClient?: IoTEventsClient;

  timeSeriesData?: AlarmDataQuery['timeSeriesData'];

  requests?: AlarmRequest[];

  viewport?: Viewport;

  /**
   * Allow consumers to toggle off different pieces of information
   * so we don't overfetch and improve performance.
   */
  settings?: UseAlarmsHookSettings;

  /**
   * Allow consumers to specify settings for
   * fetching input property time series data
   */
  inputPropertyTimeSeriesDataSettings?: UseAlarmsInputPropertyTimeSeriesDataSettings;

  /**
   * Used to transform part of the data from the Events alarm model.
   * It only changes the return data type from the hook,
   * and does not modify how the data is stored internally.
   *
   * It will only run if the data changes or the reference
   * to the transform function changes.
   *
   * Note: The useAlarms implementation will have associated
   * utilities to perform useful or common transformations.
   * Some of these will include mapping an AssetPropertyValue
   * to a DataPoint, selecting the relevant alarm model version
   * by timestamp, mapping thresholds from alarm model
   * versions OR asset property values, etc.
   */
  transform?: (alarm: AlarmData) => T;
}

/**
 * useAlarms option type without a `transform` callback option.
 *
 * If no transform is provided the generic return type of useAlarms
 * is enforced to be AlarmData.
 */
export type UseAlarmOptionsWithoutTransform = UseAlarmsOptions & {
  transform?: never;
};
