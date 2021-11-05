import { DataPoint, DataStream, DataType } from '@synchro-charts/core';
import { AssetId, AssetPropertyId } from './types';
import { toDataStreamId } from './util/dataStreamId';

export const dataStreamFromSiteWise = ({
  assetId,
  propertyId,
  dataPoints,
}: {
  assetId: AssetId;
  propertyId: AssetPropertyId;
  dataPoints: DataPoint[] | undefined;
}): DataStream => ({
  name: toDataStreamId({ assetId, propertyId }),
  id: toDataStreamId({ assetId, propertyId }),
  data: dataPoints || [],
  resolution: 0,
  // TODO: Better support for various data types, will need to utilize associated asset information to infer.
  dataType: DataType.NUMBER,
});
