import { toId } from './util/dataStreamId';
import type { AssetId, AssetPropertyId, PropertyAlias } from './types';
import type { DataStream, DataPoint } from '@iot-app-kit/core';

export const dataStreamFromSiteWise = ({
  dataPoints = [],
  resolution = 0,
  ...propertyInfo
}:
  | {
      assetId: AssetId;
      propertyId: AssetPropertyId;
      dataPoints: DataPoint[];
      resolution?: number;
    }
  | {
      propertyAlias: PropertyAlias;
      dataPoints: DataPoint[];
      resolution?: number;
    }): DataStream => {
  const dataStream: DataStream = {
    id: toId(propertyInfo),
    data: resolution === 0 ? dataPoints : [],
    resolution,
  };

  if (resolution) {
    dataStream.aggregates = {
      [resolution]: dataPoints || [],
    };
  }

  return dataStream;
};
