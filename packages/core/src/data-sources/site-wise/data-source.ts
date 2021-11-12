import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { DataSource } from '../../data-module/types.d';
import { SiteWiseDataStreamQuery } from './types.d';
import { SiteWiseClient } from './client/client';
import { toDataStreamId } from './util/dataStreamId';
import { viewportEndDate, viewportStartDate } from '../../common/viewport';

export const SITEWISE_DATA_SOURCE = 'site-wise';

export const createDataSource = (siteWise: IoTSiteWiseClient): DataSource<SiteWiseDataStreamQuery> => {
  const client = new SiteWiseClient(siteWise);
  return {
    name: SITEWISE_DATA_SOURCE,
    initiateRequest: ({ query, requestInfo, onSuccess, onError }) => {
      if (requestInfo.onlyFetchLatestValue) {
        return client.getLatestPropertyDataPoint({ query, onSuccess, onError });
      }

      const start = viewportStartDate(requestInfo.viewport);
      const end = viewportEndDate(requestInfo.viewport);
      return client.getHistoricalPropertyDataPoints({ query, onSuccess, onError, start, end });
    },

    getRequestsFromQuery: (query: SiteWiseDataStreamQuery) =>
      query.assets.flatMap(({ assetId, propertyIds }) =>
        propertyIds.map((propertyId) => ({
          id: toDataStreamId({ assetId, propertyId }),
          // TODO: Don't always force all requests to be for raw data
          resolution: 0,
        }))
      ),
  };
};
