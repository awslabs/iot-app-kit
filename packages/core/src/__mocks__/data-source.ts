import {
  DataSource,
  DataSourceRequest,
  DataStream,
  RequestInformationAndRange,
  SiteWiseDataStreamQuery,
} from '../data-module/types';
import { toDataStreamId } from '../common/dataStreamId';

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
  initiateRequest: jest.fn(
    (
      { query, request, onSuccess = () => {} }: DataSourceRequest<SiteWiseDataStreamQuery>,
      requestInformations: RequestInformationAndRange[]
    ) => {
      query.assets.forEach(({ assetId, properties }) =>
        properties.forEach(({ propertyId }) => {
          const correspondingRequestInfo = requestInformations.find(({ id }) => `${assetId}---${propertyId}` === id);
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
    Promise.resolve(query.assets
      .map(({ assetId, properties }) =>
        properties.map(({ propertyId, refId }) => ({
          id: toDataStreamId({ assetId, propertyId }),
          refId,
          resolution: '0',
        }))
      )
      .flat()),
});
