// A simple mock data source, which will always immediately return a successful response of your choosing.
import { DataStream } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataSource, DataSourceRequest } from '../../data-module';
import { SiteWiseDataStreamQuery } from '../../data-sources/site-wise/types';
import { toDataStreamId } from '../../data-sources/site-wise/util/dataStreamId';

const dataStreamIds = (query: SiteWiseDataStreamQuery) =>
  query.assets
    .map(({ assetId, propertyIds }) => propertyIds.map((propertyId) => toDataStreamId({ assetId, propertyId })))
    .flat();

export const createMockSource = (dataStreams: DataStream[]): DataSource => ({
  name: 'test-mock',
  initiateRequest: ({ onSuccess }: DataSourceRequest<AnyDataStreamQuery>) => onSuccess(dataStreams),
  getRequestsFromQuery: (query: SiteWiseDataStreamQuery) =>
    dataStreams
      .filter(({ id }) => dataStreamIds(query).includes(id))
      .map(({ data, aggregates, ...dataStreamInfo }) => dataStreamInfo),
});
