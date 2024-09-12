import { useMemo } from 'react';
import { SetRequired } from 'type-fest';
import {
  AlarmData,
  UseAlarmsOptions,
  UseAlarmOptionsWithoutTransform,
} from './types';
import { useAlarmAssets } from './hookHelpers';
import { useLatestAlarmPropertyValue } from './hookHelpers/useLatestAlarmPropertyValue';

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
  const { iotSiteWiseClient, requests, transform } = options ?? {};

  const assetAlarmData = useAlarmAssets({
    iotSiteWiseClient,
    requests,
  });

  const statePropertyAlarmData = useLatestAlarmPropertyValue({
    iotSiteWiseClient,
    alarmDataList: assetAlarmData,
    alarmPropertyFieldName: 'state',
  });

  const typePropertyAlarmData = useLatestAlarmPropertyValue({
    iotSiteWiseClient,
    alarmDataList: statePropertyAlarmData,
    alarmPropertyFieldName: 'type',
  });

  const sourcePropertyAlarmData = useLatestAlarmPropertyValue({
    iotSiteWiseClient,
    alarmDataList: typePropertyAlarmData,
    alarmPropertyFieldName: 'source',
  });

  return useMemo(
    () =>
      transform
        ? sourcePropertyAlarmData?.map(transform)
        : sourcePropertyAlarmData?.map(alarmDataIdentity),
    [transform, sourcePropertyAlarmData]
  );
}

export { useAlarms };
