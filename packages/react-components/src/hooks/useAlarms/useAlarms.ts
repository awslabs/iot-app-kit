import { useMemo } from 'react';
import type { SetRequired } from 'type-fest';
import type {
  AlarmData,
  UseAlarmsOptions,
  UseAlarmOptionsWithoutTransform,
} from './types';
import {
  useAlarmAssets,
  useAlarmModels,
  useAlarmState,
  useAlarmThreshold,
} from './hookHelpers';
import { useInputPropertyTimeSeriesData } from './hookHelpers/useInputPropertyTimeSeriesData/useInputPropertyTimeSeriesData';
import { useAlarmsState } from './state';
import { useAlarmSources } from './hookHelpers/useAlarmSources';
import { useAlarmTypes } from './hookHelpers/useAlarmTypes';

/**
 * Identify function that returns the input AlarmData.
 * Used when there is no useAlarms custom transform option.
 */
const alarmDataIdentity = (alarmData: AlarmData) => alarmData;

/**
 * useAlarms function with no transform callback provided in the options.
 * The default transform applied to AlarmData is the identity transfrom.
 */
function useAlarms(options?: UseAlarmOptionsWithoutTransform): AlarmData[];

/**
 * useAlarms function with transform provided in the options.
 *
 * The return type of the transform function is used to dictate the return type
 * of useAlarms hook. These are tied together by the generic T.
 *
 * options are required for this to apply.
 */
function useAlarms<T>(
  options: SetRequired<UseAlarmsOptions<T>, 'transform'>
): T[];

/**
 * useAlarms implementation which branches based on the 2 scenarios above.
 * If transform is defined, the output is T[], dictated by the second signature above.
 * If transform is undefined, the output is AlarmData[], dicatated by the first signature above.
 *
 * Given a list of AlarmRequests, fetch all available data for the alarms.
 *
 * @experimental Do not use in production
 */
function useAlarms<T>(options?: UseAlarmsOptions<T>): (T | AlarmData)[] {
  const {
    iotSiteWiseClient,
    iotEventsClient,
    timeSeriesData,
    requests,
    viewport,
    settings,
    inputPropertyTimeSeriesDataSettings,
    transform,
  } = options ?? {};

  const {
    state,
    alarmDatas,
    onSummarizeAlarms,
    onUpdateAlarmSourceData,
    onUpdateAlarmTypeData,
    onSummarizeAlarmModels,
    onUpdateAlarmInputPropertyData,
    onUpdateAlarmStateData,
    onUpdateAlarmThresholdData,
  } = useAlarmsState();
  /**
   * Fetch alarm summaries based on the request
   * (e.g. all alarms for an asset or assetModel)
   */
  useAlarmAssets({
    iotSiteWiseClient,
    requests,
    onSummarizeAlarms,
  });

  /**
   * Fetch latest asset property values for alarms with a type property.
   * Data should be available for all alarms fetched for an asset.
   */
  useAlarmTypes({
    iotSiteWiseClient,
    /**
     * alarm datas are populated by onSummarizeAlarms
     */
    requests: state.alarms.flatMap((alarm) =>
      alarm.alarmDatas.map((alarmData) => ({
        assetId: alarmData.assetId,
        type: alarmData.type,
      }))
    ),
    onUpdateAlarmTypeData,
  });

  /**
   * Fetch latest asset property values for alarms with a source property.
   * Data should be available for all alarms fetched for an asset, where
   * the alarm type is "IOT_EVENTS".
   */
  useAlarmSources({
    iotSiteWiseClient,
    /**
     * alarm datas are populated by onSummarizeAlarms
     */
    requests: state.alarms.flatMap((alarm) =>
      alarm.alarmDatas.map((alarmData) => ({
        assetId: alarmData.assetId,
        source: alarmData.source,
      }))
    ),
    onUpdateAlarmSourceData,
  });

  /**
   * Fetch IoT Events alarm models for each alarm
   * Only supported for alarms with type "IOT_EVENTS"
   * and data available for the source asset property.
   */
  useAlarmModels({
    iotEventsClient,
    onSummarizeAlarmModels,
    requests: state.alarms.flatMap((alarm) =>
      alarm.alarmDatas.map((alarmData) => ({
        source: alarmData.source,
      }))
    ),
  });

  useInputPropertyTimeSeriesData({
    requests: state.alarms.flatMap((alarm) =>
      alarm.alarmDatas.map((alarmData) => ({
        inputProperty: alarmData.inputProperty,
        assetId: alarmData.assetId,
      }))
    ),
    onUpdateAlarmInputPropertyData,
    timeSeriesData,
    viewport,
    ...settings,
    ...inputPropertyTimeSeriesDataSettings,
  });

  /**
   * Fetch latest asset property values for alarms with a state property.
   * Data should be available for all alarms fetched for an asset.
   */
  useAlarmState({
    requests: state.alarms.flatMap((alarm) =>
      alarm.alarmDatas.map((alarmData) => ({
        state: alarmData.state,
        assetId: alarmData.assetId,
      }))
    ),
    onUpdateAlarmStateData,
    iotSiteWiseClient,
    viewport,
    ...settings,
  });

  /**
   * Fetch alarm threshold values from the alarm model or from a
   * SiteWise asset property.
   */
  useAlarmThreshold({
    iotSiteWiseClient,
    onUpdateAlarmThresholdData,
    /**
     * Only request thresholds for alarms
     * that don't have static thresholds defined.
     * Static thresholds set on summarize alarm models
     */
    requests: state.alarms.flatMap((alarm) =>
      alarm.alarmDatas
        .filter((alarm) => (alarm.thresholds ?? []).length === 0)
        .map((alarmData) => ({
          assetId: alarmData.assetId,
          models: alarmData.models,
        }))
    ),
    viewport,
    ...settings,
    refreshRate: Infinity, // Only fetch thresholds once, require page refresh
  });

  // Apply the transform callback if it exists, otherwise return the AlarmData
  return useMemo(
    () =>
      transform
        ? alarmDatas?.map(transform)
        : alarmDatas?.map(alarmDataIdentity),
    [transform, alarmDatas]
  );
}

export { useAlarms };
