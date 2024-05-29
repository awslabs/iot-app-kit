import { bisector } from 'd3-array';
import { timeSeriesDataFilterer } from '../../useTimeSeriesData';
import { DataPoint } from '@iot-app-kit/charts-core';

export const assetPropertyValuePointMilliseconds = (point: DataPoint) => {
  return point.x;
};

export const assetPropertyValuesBisector = bisector((p: DataPoint) =>
  assetPropertyValuePointMilliseconds(p)
);

export const filterAssetPropertyValues = timeSeriesDataFilterer(
  assetPropertyValuesBisector,
  assetPropertyValuePointMilliseconds
);
