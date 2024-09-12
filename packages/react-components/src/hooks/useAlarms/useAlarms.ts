import { useMemo } from 'react';
import { SetRequired } from 'type-fest';
import {
  AlarmData,
  UseAlarmsOptions,
  UseAlarmOptionsWithoutTransform,
} from './types';
import {
  useAlarmAssets,
  useAlarmModels,
  useLatestAlarmPropertyValue,
} from './hookHelpers';
import { filterAlarmsMatchingInputProperties } from './utils/alarmModelUtils';

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
  const { iotSiteWiseClient, iotEventsClient, requests, transform } =
    options ?? {};
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
  const statePropertyAlarmData = useLatestAlarmPropertyValue({
    iotSiteWiseClient,
    alarmDataList: assetAlarmData,
    alarmPropertyFieldName: 'state',
  });

  /**
   * Fetch latest asset property values for alarms with a type property.
   * Data should be available for all alarms fetched for an asset.
   */
  const typePropertyAlarmData = useLatestAlarmPropertyValue({
    iotSiteWiseClient,
    alarmDataList: statePropertyAlarmData,
    alarmPropertyFieldName: 'type',
  });

  /**
   * Fetch latest asset property values for alarms with a source property.
   * Data should be available for all alarms fetched for an asset, where
   * the alarm type is "IOT_EVENTS".
   */
  const sourcePropertyAlarmData = useLatestAlarmPropertyValue({
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
   * If an inputProperty is in an AlarmRequest then all alarms for
   * the property's asset is fetched. After the IoT Events alarm models
   * are fetched for each alarm we can verify which alarm on the asset
   * is actually associated with an inputProperty.
   */
  const filterAlarmInputProperties = useMemo(
    () => filterAlarmsMatchingInputProperties(alarmModelAlarmData),
    [alarmModelAlarmData]
  );

  // Apply the transform callback if it exists, otherwise return the AlarmData
  return useMemo(
    () =>
      transform
        ? filterAlarmInputProperties?.map(transform)
        : filterAlarmInputProperties?.map(alarmDataIdentity),
    [transform, filterAlarmInputProperties]
  );
}

export { useAlarms };
