import { DataPoint } from '@synchro-charts/core';
import { AssetId, AssetPropertyId } from './types';
import { toId } from './util/dataStreamId';
import { DataStream } from '@iot-app-kit/core';

export const dataStreamFromSiteWise = ({
  assetId,
  propertyId,
  dataPoints = [],
  resolution = 0,
}: {
  assetId: AssetId;
  propertyId: AssetPropertyId;
  dataPoints: DataPoint[];
  resolution?: number;
}): DataStream => {
  const dataStream: DataStream = {
    id: toId({ assetId, propertyId }),
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
