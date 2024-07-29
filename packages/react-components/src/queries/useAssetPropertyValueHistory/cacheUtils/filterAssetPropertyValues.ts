import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { bisector } from 'd3-array';
import { timeSeriesDataFilterer } from '../../useTimeSeriesData';

export const assetPropertyValuePointMilliseconds = (
  point: AssetPropertyValue
) => {
  const secondsAsMilliseconds = (point.timestamp?.timeInSeconds ?? 0) * 1000;
  const nanosecondsAsMilliseconds = point.timestamp?.offsetInNanos
    ? point.timestamp?.offsetInNanos / 1000000
    : 0;
  return secondsAsMilliseconds + nanosecondsAsMilliseconds;
};

export const assetPropertyValueBisector = bisector((p: AssetPropertyValue) =>
  assetPropertyValuePointMilliseconds(p)
);

export const filterAssetPropertyValues = timeSeriesDataFilterer(
  assetPropertyValueBisector,
  assetPropertyValuePointMilliseconds
);
