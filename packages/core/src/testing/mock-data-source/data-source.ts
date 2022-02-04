import { DataStreamId } from '@synchro-charts/core';
import { DataSource, DataStream, RequestInformation } from '../../data-module/types';
import { OnRequestData } from '../../data-module/data-cache/requestTypes';
import { SiteWiseLegacyDataStreamQuery } from './types';

/**
 * Legacy SiteWise data source
 *
 * A temporary bridge between IoT App Kit, and the existing SiteWise Monitor design.
 */
/** @deprecated */
export const createSiteWiseLegacyDataSource = (
  onRequestData: OnRequestData
): DataSource<SiteWiseLegacyDataStreamQuery> => ({
  name: 'site-wise',
  getRequestsFromQuery: ({ query: { dataStreamInfos } }): RequestInformation[] =>
    dataStreamInfos.map(({ id, resolution }) => ({ id, resolution })),
  initiateRequest: ({ query, request, onSuccess }, requestInformations) => {
    query.dataStreamInfos
      .filter((dataStreamInfo) => requestInformations.some((r) => r.id === dataStreamInfo.id))
      .forEach((info) => {
        onRequestData({
          request,
          resolution: info.resolution,
          onError: () => {},
          onSuccess: (id: DataStreamId, dataStream: DataStream) => {
            onSuccess([dataStream]);
          },
          dataStreamId: info.id,
        });
      });
  },
});
