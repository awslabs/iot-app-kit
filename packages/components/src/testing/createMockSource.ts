// A simple mock data source, which will always immediately return a successful response of your choosing.
import { DataStream } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataSource, DataSourceRequest, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { toDataStreamId } from './dataStreamId';

const dataStreamIds = (query: SiteWiseDataStreamQuery) =>
  query.assets
    .map(({ assetId, properties }) => properties.map(({ propertyId }) => toDataStreamId({ assetId, propertyId })))
    .flat();

export const createMockSource = (dataStreams: DataStream[]): DataSource => ({
  name: 'test-mock',
  initiateRequest: ({ onSuccess }: DataSourceRequest<AnyDataStreamQuery>) => onSuccess(dataStreams),
  getRequestsFromQuery: ({ query }) =>
    dataStreams
      .filter(({ id }) => dataStreamIds(query).includes(id))
      .map(({ data, aggregates, ...dataStreamInfo }) => dataStreamInfo),
});
