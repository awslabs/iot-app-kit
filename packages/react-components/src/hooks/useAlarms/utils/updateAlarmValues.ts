import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import type { AlarmData } from '../types';
import { Viewport } from '../../../queries';
import { shouldUpdateAssetPropertyValues } from '../state/actions/utils/shouldUpdateAssetPropertyValues';
import { filterAssetPropertyValues } from '../state/actions/utils/filterAssetPropertyValues';
import { viewportAsInterval } from '../state/actions/utils/viewportAsInterval';
import { uniqueSortAssetPropertyValues } from '../state/actions/utils/uniqueSortAssetPropertyValues';

export const updateAlarmThresholdData = (
  alarm: AlarmData,
  {
    data,
    staticData,
    viewport,
  }: {
    data: AssetPropertyValue[];
    staticData: AssetPropertyValue[];
    viewport?: Viewport;
  }
): AlarmData => {
  /**
   * If there is no models property the queries will
   * be disabled and data will be empty
   */
  if (!alarm.models) return alarm;

  const currentData = alarm.thresholds ?? [];

  /**
   * If there is a static threshold then that should be used as the alarm threshold
   **/
  if (
    staticData.length &&
    shouldUpdateAssetPropertyValues(currentData, staticData)
  ) {
    alarm.thresholds = staticData;
    return alarm;
  }

  const updatedData = uniqueSortAssetPropertyValues([...currentData, ...data]);
  const filteredData = viewport
    ? filterAssetPropertyValues(updatedData, viewportAsInterval(viewport))
    : updatedData;

  if (shouldUpdateAssetPropertyValues(currentData, filteredData)) {
    alarm.thresholds = filteredData;
  }

  return alarm;
};
