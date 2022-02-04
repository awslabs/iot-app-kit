import { DataPoint } from '@synchro-charts/core';
import { AssetId, AssetPropertyId } from './types';
import { toDataStreamId } from './util/dataStreamId';
import { DataStream } from '../../data-module/types';

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
    id: toDataStreamId({ assetId, propertyId }),
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
