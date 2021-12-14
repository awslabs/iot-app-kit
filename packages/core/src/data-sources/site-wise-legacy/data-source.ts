import { DataStream, DataStreamId } from '@synchro-charts/core';
import { DataSource, RequestInformation } from '../../data-module/types.d';
import { OnRequestData } from '../../data-module/data-cache/requestTypes';
import { SiteWiseLegacyDataStreamQuery } from './types.d';

/**
 * Legacy SiteWise data source
 *
 * A temporary bridge between IoT App Kit, and the existing SiteWise Monitor design.
 */
export const createSiteWiseLegacyDataSource = (
  onRequestData: OnRequestData
): DataSource<SiteWiseLegacyDataStreamQuery> => ({
  name: 'site-wise',
  getRequestsFromQuery: ({ query: { dataStreamInfos } }): RequestInformation[] =>
    dataStreamInfos.map(({ id, resolution }) => ({ id, resolution })),
  initiateRequest: ({ query, requestInfo, onSuccess }, requestInformations) => {
    query.dataStreamInfos
      .filter((dataStreamInfo) => requestInformations.some((r) => r.id === dataStreamInfo.id))
      .forEach((info) => {
        onRequestData({
          request: requestInfo,
          resolution: info.resolution,
          onError: () => {},
          onSuccess: (id: DataStreamId, data: DataStream) => {
            onSuccess([data]);
          },
          dataStreamId: info.id,
        });
      });
  },
});
