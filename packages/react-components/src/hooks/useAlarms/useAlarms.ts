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
  useLatestAlarmPropertyValues,
} from './hookHelpers';
import { useAlarmState } from './hookHelpers/useAlarmState/useAlarmState';
import { filterAlarmInputProperties } from './utils/filterAlarmInputProperties';

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
 */
function useAlarms<T>(options?: UseAlarmsOptions<T>): (T | AlarmData)[] {
  const {
    iotSiteWiseClient,
    iotEventsClient,
    requests,
    viewport,
    settings,
    transform,
  } = options ?? {};
  /**
   * Fetch alarm summaries based on the request
   * (e.g. all alarms for an asset or assetModel)
   */
  const assetAlarmData = useAlarmAssets({
    iotSiteWiseClient,
    requests,
  });

  /**
   * Fetch latest asset property values for alarms with a state property.
   * Data should be available for all alarms fetched for an asset.
   */
  const statePropertyAlarmData = useAlarmState({
    iotSiteWiseClient,
    alarms: assetAlarmData,
    viewport,
    ...settings,
  });

  /**
   * Fetch latest asset property values for alarms with a type property.
   * Data should be available for all alarms fetched for an asset.
   */
  const typePropertyAlarmData = useLatestAlarmPropertyValues({
    iotSiteWiseClient,
    alarmDataList: statePropertyAlarmData,
    alarmPropertyFieldName: 'type',
  });

  /**
   * Fetch latest asset property values for alarms with a source property.
   * Data should be available for all alarms fetched for an asset, where
   * the alarm type is "IOT_EVENTS".
   */
  const sourcePropertyAlarmData = useLatestAlarmPropertyValues({
    iotSiteWiseClient,
    alarmDataList: typePropertyAlarmData,
    alarmPropertyFieldName: 'source',
  });

  /**
   * Fetch IoT Events alarm models for each alarm
   * Only supported for alarms with type "IOT_EVENTS"
   * and data available for the source asset property.
   */
  const alarmModelAlarmData = useAlarmModels({
    iotEventsClient,
    alarmDataList: sourcePropertyAlarmData,
  });

  /**
   * For an input property request filter out alarms
   * with alarm models that don't match the request inputPropertyId.
   *
   * For all other requests find the inputProperty from
   * an alarm's alarm model.
   */
  const inputPropertiesAlarmData = useMemo(
    () => filterAlarmInputProperties(alarmModelAlarmData),
    [alarmModelAlarmData]
  );

  // Remove internal properties on AlarmDataInternal
  const alarmData: AlarmData[] = inputPropertiesAlarmData.map(
    ({
      request: _unusedRequest,
      properties: _unusedProperties,
      ...alarmData
    }) => ({
      ...alarmData,
    })
  );

  // Apply the transform callback if it exists, otherwise return the AlarmData
  return useMemo(
    () =>
      transform ? alarmData?.map(transform) : alarmData?.map(alarmDataIdentity),
    [transform, alarmData]
  );
}

export { useAlarms };
