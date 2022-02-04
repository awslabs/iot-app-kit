// A simple mock data source, which will always immediately return a successful response of your choosing.
import {
  AnyDataStreamQuery,
  DataSource,
  DataSourceRequest,
  SiteWiseDataStreamQuery,
  DataStream,
} from '@iot-app-kit/core';
import { toDataStreamId, toSiteWiseAssetProperty } from './dataStreamId';

const dataStreamIds = (query: SiteWiseDataStreamQuery) =>
  query.assets
    .map(({ assetId, properties }) => properties.map(({ propertyId }) => toDataStreamId({ assetId, propertyId })))
    .flat();

const associatedProperty = (query: SiteWiseDataStreamQuery, dataStreamId: string) => {
  const { assetId, propertyId } = toSiteWiseAssetProperty(dataStreamId);
  const asset = query.assets.find((asset) => asset.assetId === assetId);
  return asset?.properties.find((property) => property.propertyId === propertyId);
};

export const createMockSource = (dataStreams: DataStream[]): DataSource => ({
  name: 'test-mock',
  initiateRequest: ({ onSuccess }: DataSourceRequest<AnyDataStreamQuery>) => onSuccess(dataStreams),
  getRequestsFromQuery: ({ query }) =>
    dataStreams
      .filter(({ id }) => dataStreamIds(query).includes(id))
      .map(({ data, aggregates, ...dataStreamInfo }) => ({
        ...dataStreamInfo,
      }))
      .map((dataStream) => {
        const property = associatedProperty(query, dataStream.id);
        return {
          ...dataStream,
          refId: property?.refId,
        };
      }),
});
