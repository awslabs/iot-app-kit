import {
  BatchGetAssetPropertyValueHistoryCommand,
  BatchGetAssetPropertyValueHistoryErrorEntry,
  BatchGetAssetPropertyValueHistorySuccessEntry,
  IoTSiteWiseClient,
  TimeOrdering,
} from '@aws-sdk/client-iotsitewise';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import { toSiteWiseAssetProperty } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';
import { HistoricalPropertyParams } from './client';
import { createEntryBatches } from './batch';

type BatchHistoricalEntry = {
  requestInformation: RequestInformationAndRange;
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  requestStart: Date;
  requestEnd: Date;
};

type BatchEntryCallbackCache = {
  [key: string]: {
    onError: (entry: BatchGetAssetPropertyValueHistoryErrorEntry) => void;
    onSuccess: (entry: BatchGetAssetPropertyValueHistorySuccessEntry) => void;
  };
};

const batchGetHistoricalPropertyDataPointsForProperty = async ({
  client,
  entries,
  nextToken: prevToken,
}: {
  client: IoTSiteWiseClient;
  entries: BatchHistoricalEntry[];
  nextToken?: string;
}) => {
  // callback cache makes it convenient to capture request data in a closure.
  // the cache exposes methods that only require batch response entry as an argument.
  const callbackCache: BatchEntryCallbackCache = {};

  return Promise.all(
    createEntryBatches<BatchHistoricalEntry>(entries)
      .filter((batch) => batch.length > 0) // filter out empty batches
      .map(([batch, maxResults], requestIndex) =>
        client
          .send(
            new BatchGetAssetPropertyValueHistoryCommand({
              entries: batch.map((entry, entryIndex) => {
                const { requestInformation, onError, onSuccess, requestStart, requestEnd } = entry;
                const { id } = requestInformation;

                // use 2D array indices as entryIDs to guarantee uniqueness
                // entryId is used to map batch entries with the appropriate callback
                const entryId = String(`${requestIndex}-${entryIndex}`);

                // save request entry data in functional closure.
                callbackCache[entryId] = {
                  onError: ({ errorMessage: msg = 'batch error', errorCode: status }) => {
                    onError({
                      id,
                      resolution: 0,
                      error: { msg, status },
                    });
                  },
                  onSuccess: ({ assetPropertyValueHistory }) => {
                    if (assetPropertyValueHistory) {
                      onSuccess(
                        [
                          dataStreamFromSiteWise({
                            ...toSiteWiseAssetProperty(id),
                            dataPoints: assetPropertyValueHistory
                              .map((assetPropertyValue) => toDataPoint(assetPropertyValue))
                              .filter(isDefined),
                          }),
                        ],
                        requestInformation,
                        requestStart,
                        requestEnd
                      );
                    }
                  },
                };

                // BatchGetAssetPropertyValueHistoryEntry
                return {
                  ...toSiteWiseAssetProperty(requestInformation.id),
                  startDate: requestStart,
                  endDate: requestEnd,
                  entryId,
                  timeOrdering: TimeOrdering.DESCENDING,
                };
              }),
              maxResults,
              nextToken: prevToken,
            })
          )
          .then((response) => {
            const { errorEntries, successEntries, nextToken } = response;

            // execute the correct callback for each entry
            // empty entries and entries that don't exist in the cache are ignored.
            errorEntries?.forEach((entry) => entry.entryId && callbackCache[entry.entryId]?.onError(entry));
            successEntries?.forEach((entry) => entry.entryId && callbackCache[entry.entryId]?.onSuccess(entry));

            if (nextToken && requestIndex > 0 /* don't paginate on first batch */) {
              batchGetHistoricalPropertyDataPointsForProperty({
                entries: batch,
                nextToken,
                client,
              });
            }
          })
      )
  );
};

export const batchGetHistoricalPropertyDataPoints = async ({
  params,
  client,
}: {
  params: HistoricalPropertyParams[];
  client: IoTSiteWiseClient;
}) => {
  const entries: BatchHistoricalEntry[] = [];

  // fan out params into individual entries, handling fetchMostRecentBeforeStart
  params.forEach(({ requestInformations, maxResults, onSuccess, onError }) => {
    requestInformations
      .filter(({ resolution }) => resolution === '0')
      .forEach((requestInformation) => {
        const { fetchMostRecentBeforeStart, start, end } = requestInformation;

        entries.push({
          requestInformation,
          maxResults: fetchMostRecentBeforeStart ? 1 : maxResults,
          onSuccess,
          onError,
          requestStart: fetchMostRecentBeforeStart ? new Date(0, 0, 0) : start,
          requestEnd: fetchMostRecentBeforeStart ? start : end,
        });
      });
  });

  // sort entries to ensure earliest data is fetched first because batch API has a property limit
  entries.sort((a, b) => b.requestInformation.start.getTime() - a.requestInformation.start.getTime());

  if (entries.length > 0) {
    await batchGetHistoricalPropertyDataPointsForProperty({
      entries,
      client,
    });
  }
};
