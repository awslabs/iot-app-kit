import { DataSource, DataSourceRequest, DataStream } from '@iot-app-kit/core';
import { SiteWiseDataStreamQuery } from '../time-series-data/types';
import { SITEWISE_DATA_SOURCE } from '../time-series-data';
import { toId } from '../time-series-data/util/dataStreamId';

// A simple mock data source, which will always immediately return a successful response of your choosing.
export const createMockSiteWiseDataSource = (
  {
    dataStreams = [],
    onRequestData = () => {},
  }: {
    dataStreams?: DataStream[];
    onRequestData?: (props: any) => void;
  } = { dataStreams: [], onRequestData: () => {} }
): DataSource<SiteWiseDataStreamQuery> => ({
  name: SITEWISE_DATA_SOURCE,
  initiateRequest: jest.fn(({ query, request, onSuccess = () => {} }: DataSourceRequest<SiteWiseDataStreamQuery>) => {
    query.assets.forEach(({ assetId, properties }) =>
      properties.forEach(({ propertyId }) => {
        onRequestData({ assetId, propertyId, request });
        onSuccess(dataStreams);
      })
    );
  }),
  getRequestsFromQuery: ({ query }) =>
    query.assets
      .map(({ assetId, properties }) =>
        properties.map(({ propertyId, refId }) => ({
          id: toId({ assetId, propertyId }),
          refId,
          resolution: 0,
        }))
      )
      .flat(),
});
