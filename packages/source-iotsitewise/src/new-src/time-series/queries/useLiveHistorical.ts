import {
  paginateBatchGetAssetPropertyValue,
  paginateBatchGetAssetPropertyValueHistory,
  type BatchGetAssetPropertyValueHistoryCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { useQueries, useQuery } from '@tanstack/react-query';

import { REQUEST_INTERVALS_IN_MS } from '../constants';

import { useTimeSeriesEntriesStore } from '../store';

function sliceIntoChunks<T>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export function useLiveHistoricalData(props: { client: IoTSiteWiseClient; relativeEnd: number }) {
  const q = useQuery({
    refetchInterval: 3000,
    queryFn: async () => {
      // request the latest value for each entry
    },
  });

  const entries = useTimeSeriesEntriesStore((state) => state.entries);
  const liveHistoricalEntries = entries.filter((entry) => {
    return (
      entry.aggregateTypes == null ||
      entry.aggregateTypes.length === 0 ||
      entry.resolution == null ||
      entry.resolution === ''
    );
  });
  const liveHistoricalEntryChunks = sliceIntoChunks(liveHistoricalEntries, 16);

  const liveHistoricalChunksWithIntervals = liveHistoricalEntryChunks
    .map((chunk) => {
      return REQUEST_INTERVALS_IN_MS.map((requestInterval) => ({
        chunk,
        requestInterval,
      }));
    })
    .flat();

  const queries = useQueries({
    queries: liveHistoricalChunksWithIntervals.map(({ chunk, requestInterval }) => ({
      staleTime: requestInterval.refetchInterval, // dump the data on every request
      cacheTime: 0, // immediately garbage collect when stale
      enabled: chunk.length > 0,
      refetchInterval: requestInterval.refetchInterval,
      queryKey: [
        {
          scope: 'live historical value data streams',
          refetchInterval: requestInterval.refetchInterval,
          entries: chunk.map((entry) => entry.entryId),
        },
      ],
      queryFn: async () => {
        const now = Date.now();
        const startDateInSeconds = now - requestInterval.start;
        const endDateInSeconds = now - requestInterval.start;

        const entriesWithDates = chunk.map((query) => ({
          assetId: query.assetId,
          propertyId: query.propertyId,
          propertyAlias: query.propertyAlias,
          entryId: query.entryId,
          startDate: new Date(startDateInSeconds * 1000),
          endDate: new Date(endDateInSeconds * 1000),
        }));

        const paginator = paginateBatchGetAssetPropertyValueHistory(
          { client: props.client, pageSize: 20000 },
          { entries: entriesWithDates }
        );

        const historicalSuccessEntries: BatchGetAssetPropertyValueHistoryCommandOutput['successEntries'] = [];

        for await (const { successEntries = [] } of paginator) {
          historicalSuccessEntries.push(...successEntries);
        }

        return historicalSuccessEntries ?? [];
      },
    })),
  });

  const query1 = queries[0];
  const query2 = queries[1];
  const query3 = queries[2];

  const data1 = query1.data ?? [];
  const data2 = query2.data ?? [];
  const data3 = query3.data ?? [];

  return [...data1, ...data2, ...data3];
}
