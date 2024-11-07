import { toId } from './util/dataStreamId';
import type { AssetId, AssetPropertyId, PropertyAlias } from './types';
import type { DataStream, DataPoint } from '@iot-app-kit/core';
import { type AggregateType } from '@aws-sdk/client-iotsitewise';

export const dataStreamFromSiteWise = ({
  dataPoints = [],
  resolution = 0,
  aggregationType,
  ...propertyInfo
}:
  | {
      assetId: AssetId;
      propertyId: AssetPropertyId;
      dataPoints: DataPoint[];
      resolution?: number;
      aggregationType?: AggregateType;
    }
  | {
      propertyAlias: PropertyAlias;
      dataPoints: DataPoint[];
      resolution?: number;
      aggregationType?: AggregateType;
    }): DataStream => {
  return {
    id: toId(propertyInfo),
    aggregationType,
    data: dataPoints,
    resolution,
  };
};
