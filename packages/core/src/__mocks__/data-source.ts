import { toDataStreamId } from '../common/dataStreamId';
import type {
  DataSource,
  DataSourceRequest,
  DataStream,
  DataStreamQuery,
  RequestInformationAndRange,
} from '../data-module/types';

export type MockSiteWiseQuery = {
  assets: {
    assetId: string;
    properties: { refId?: string; propertyId: string }[];
  }[];
} & DataStreamQuery;

// A simple mock data source, which will always immediately return a successful response of your choosing.
export const createMockSiteWiseDataSource = (
  {
    dataStreams = [],
    onRequestData = () => {},
    meta,
  }: {
    dataStreams?: DataStream[];
    onRequestData?: (props: any) => void;
    meta?: DataStream['meta'];
  } = { dataStreams: [], onRequestData: () => {} }
): DataSource<MockSiteWiseQuery> => ({
  initiateRequest: vi.fn(
    (
      {
        query,
        request,
        onSuccess = () => {},
      }: DataSourceRequest<MockSiteWiseQuery>,
      requestInformations: RequestInformationAndRange[]
    ) => {
      query.assets.forEach(({ assetId, properties }) =>
        properties.forEach(({ propertyId }) => {
          const correspondingRequestInfo = requestInformations.find(
            ({ id }) => `${assetId}---${propertyId}` === id
          );
          if (correspondingRequestInfo) {
            onRequestData({ assetId, propertyId, request });
            onSuccess(
              dataStreams,
              correspondingRequestInfo,
              correspondingRequestInfo.start,
              correspondingRequestInfo.end
            );
          }
        })
      );
    }
  ),
  getRequestsFromQuery: ({ query }) =>
    Promise.resolve(
      query.assets
        .map(({ assetId, properties }) =>
          properties.map(({ propertyId, refId }) => ({
            id: toDataStreamId({ assetId, propertyId }),
            refId,
            resolution: '0',
            meta,
          }))
        )
        .flat()
    ),
});
