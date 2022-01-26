import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { DataStream, DataType } from './data-module/types';
import { toSiteWiseAssetProperty } from './iotsitewise/time-series-data/util/dataStreamId';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise/dist-types/models/models_0';

const toDataType = (propertyDataType: PropertyDataType | string | undefined): DataType => {
  if (propertyDataType === 'STRING') {
    return 'STRING';
  }
  if (propertyDataType === 'BOOLEAN') {
    return 'BOOLEAN';
  }

  return 'NUMBER';
};

/**
 * Get completed data streams by merging together the data streams with the asset models.
 */
export const completeDataStreams = ({
  dataStreams,
  assetModels,
}: {
  dataStreams: DataStream[];
  assetModels: Record<string, DescribeAssetModelResponse>;
}): DataStream[] =>
  dataStreams.map((dataStream) => {
    const { assetId, propertyId } = toSiteWiseAssetProperty(dataStream.id);
    const assetModel = assetModels[assetId];

    if (assetModel == null || assetModel.assetModelProperties == null) {
      return dataStream;
    }

    const property = assetModel.assetModelProperties.find(({ id }) => id === propertyId);

    if (property == null) {
      return dataStream;
    }

    return {
      ...dataStream,
      name: property.name,
      unit: property.unit,
      dataType: toDataType(property.dataType),
    };
  });
