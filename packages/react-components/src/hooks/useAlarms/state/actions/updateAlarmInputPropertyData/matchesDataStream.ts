import { DataStream } from '@iot-app-kit/core';
import { fromId } from '@iot-app-kit/source-iotsitewise';

export const matchesDatastream =
  ({ assetId, propertyId }: { assetId?: string; propertyId?: string }) =>
  ({ id }: DataStream) => {
    const propertyInfo = fromId(id);
    if (!('assetId' in propertyInfo)) return false;

    const { assetId: datastreamAssetId, propertyId: datastreamPropertyId } =
      propertyInfo;

    return datastreamAssetId === assetId && datastreamPropertyId === propertyId;
  };
