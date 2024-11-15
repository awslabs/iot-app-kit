import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import type { AlarmData } from '../types';
import { toTimestamp } from '../../../utils/time';
import { bisector } from 'd3-array';
import { type Viewport } from '../../../queries';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { alarmValueFilterer } from './alarmValueFilterer';

const assetPropertyValueTime = (assetPropertyValue: AssetPropertyValue) =>
  toTimestamp(assetPropertyValue.timestamp);

const compareAssetPropertyValues = (
  a: AssetPropertyValue,
  b: AssetPropertyValue
) => {
  return assetPropertyValueTime(a) - assetPropertyValueTime(b);
};

const assetPropertyValuesBisector = bisector(assetPropertyValueTime);

const filterAssetPropertyValues = alarmValueFilterer(
  assetPropertyValuesBisector,
  assetPropertyValueTime
);

const uniqueSortAssetPropertyValues = (
  assetPropertyValues: AssetPropertyValue[]
) => {
  const uniqueMap = new Map<number, AssetPropertyValue>();
  assetPropertyValues.forEach((assetPropertyValue) => {
    const key = assetPropertyValueTime(assetPropertyValue);
    uniqueMap.set(key, assetPropertyValue);
  });
  return Array.from(uniqueMap.values()).sort(compareAssetPropertyValues);
};

const assetPropertyValuesAreEqual = (
  a?: AssetPropertyValue,
  b?: AssetPropertyValue
) => {
  return (a && assetPropertyValueTime(a)) === (b && assetPropertyValueTime(b));
};

const shouldUpdateAlarmStateData = (
  currentData: AssetPropertyValue[],
  updatedData: AssetPropertyValue[]
) => {
  return (
    currentData.length !== updatedData.length ||
    !assetPropertyValuesAreEqual(currentData.at(0), updatedData.at(0)) ||
    !assetPropertyValuesAreEqual(currentData.at(-1), updatedData.at(-1))
  );
};

const viewportAsInterval = (viewport: Viewport) => ({
  start: viewportStartDate(viewport),
  end: viewportEndDate(viewport),
});

export const updateAlarmStateData = (
  alarm: AlarmData,
  { data, viewport }: { data: AssetPropertyValue[]; viewport?: Viewport }
): AlarmData => {
  /**
   * If there is no state property the queries will
   * be disabled and data will be empty
   */
  if (!alarm.state) return alarm;

  const currentData = alarm.state.data;
  const updatedData = uniqueSortAssetPropertyValues([
    ...(currentData ?? []),
    ...data,
  ]);
  const filteredData = viewport
    ? filterAssetPropertyValues(updatedData, viewportAsInterval(viewport))
    : updatedData;

  if (
    currentData == null ||
    shouldUpdateAlarmStateData(currentData, filteredData)
  ) {
    alarm.state.data = filteredData;
  }

  return alarm;
};

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
    shouldUpdateAlarmStateData(currentData, staticData)
  ) {
    alarm.thresholds = staticData;
    return alarm;
  }

  const updatedData = uniqueSortAssetPropertyValues([...currentData, ...data]);
  const filteredData = viewport
    ? filterAssetPropertyValues(updatedData, viewportAsInterval(viewport))
    : updatedData;

  if (shouldUpdateAlarmStateData(currentData, filteredData)) {
    alarm.thresholds = filteredData;
  }

  return alarm;
};
