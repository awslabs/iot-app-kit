import { GetAssetPropertyValueHistoryCommand, IoTSiteWiseClient, TimeOrdering } from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId, SiteWiseDataStreamQuery } from '../types';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback, ErrorCallback, RequestInformationAndRange } from '../../../data-module/types';
import { isDefined } from '../../../common/predicates';
import { toDataStreamId } from '../util/dataStreamId';

const getHistoricalPropertyDataPointsForProperty = ({
  assetId,
  propertyId,
  start,
  end,
  maxResults,
  onSuccess,
  onError,
  nextToken: prevToken,
  client,
}: {
  assetId: AssetId;
  propertyId: AssetPropertyId;
  start: Date;
  end: Date;
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
  nextToken?: string;
}) => {
  return client
    .send(
      new GetAssetPropertyValueHistoryCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        maxResults,
        timeOrdering: TimeOrdering.DESCENDING,
        nextToken: prevToken,
      })
    )
    .then((response) => {
      if (response) {
        const { assetPropertyValueHistory, nextToken } = response;
        if (assetPropertyValueHistory) {
          /** Report the page of data to the data-module */
          const dataPoints = assetPropertyValueHistory
            .map((assetPropertyValue) => toDataPoint(assetPropertyValue))
            .filter(isDefined);

          onSuccess([dataStreamFromSiteWise({ assetId, propertyId, dataPoints })]);
        }

        if (nextToken) {
          getHistoricalPropertyDataPointsForProperty({
            assetId,
            propertyId,
            start,
            end,
            maxResults,
            onError,
            onSuccess,
            nextToken,
            client,
          });
        }
      }
    })
    .catch((err) => {
      const id = toDataStreamId({ assetId, propertyId });
      onError({ id, resolution: 0, error: err.message });
    });
};

export const getHistoricalPropertyDataPoints = async ({
  client,
  query,
  requestInformations,
  maxResults,
  onSuccess,
  onError,
}: {
  query: SiteWiseDataStreamQuery;
  requestInformations: RequestInformationAndRange[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
}) => {
  const dataStreamQueries = query.assets
    .map(({ assetId, properties }) => properties.map(({ propertyId }) => ({ assetId, propertyId })))
    .flat();

  const requests = requestInformations
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map(({ id, start, end }) => {
      const dataStreamsToRequest = dataStreamQueries.find(
        ({ assetId, propertyId }) => toDataStreamId({ assetId, propertyId }) === id
      );

      if (dataStreamsToRequest) {
        return getHistoricalPropertyDataPointsForProperty({
          client,
          assetId: dataStreamsToRequest.assetId,
          propertyId: dataStreamsToRequest.propertyId,
          start,
          end,
          maxResults,
          onSuccess,
          onError,
        });
      }
    });

  try {
    await Promise.all(requests);
  } catch (err) {
    // NOOP
  }
};
