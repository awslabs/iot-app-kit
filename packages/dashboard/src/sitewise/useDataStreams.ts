import {
  paginateBatchGetAssetPropertyAggregates,
  paginateBatchGetAssetPropertyValue,
  paginateBatchGetAssetPropertyValueHistory,
  type BatchGetAssetPropertyValueCommandOutput,
  type BatchGetAssetPropertyValueHistoryCommandOutput,
  type BatchGetAssetPropertyAggregatesCommandInput,
  type BatchGetAssetPropertyAggregatesCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTimeSeriesQueryEntries } from './initialize';

/*
# TODO:
- Live + beyond 20 minutes
*/

export interface DataStream {
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  aggregateTypes?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['aggregateTypes'];
  resolution?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['resolution'];
  onlyLatestValue?: boolean;
  entryId: string;
  range?: { startDate: Date; endDate: Date };
}

interface UseDataStreamsProps {
  dataStreams: DataStream[];
  client: IoTSiteWiseClient;
}

const requestIntervals = [
  { minAgeSeconds: 0, maxAgeSeconds: 72, refreshRate: 5000 },
  { minAgeSeconds: 73, maxAgeSeconds: 180, refreshRate: 30000 },
  { minAgeSeconds: 181, maxAgeSeconds: 1200, refreshRate: 300000 },
];

const chunkSize = 16;

function sliceIntoChunks<T>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

// singleton
export function useLiveDataStreams(props: UseDataStreamsProps) {
  const { liveAggregateEntryChunks, liveHistoricalEntryChunks } = useTimeSeriesQueryEntries();

  const queryClient = useQueryClient();

  const staticRangeAggregateDataStreams = props.dataStreams
    .filter(
      (dataStream): dataStream is typeof dataStream & { range: { startDate: Date; endDate: Date } } =>
        dataStream.range != null
    )
    .filter(
      (dataStream) =>
        (dataStream.aggregateTypes != null && dataStream.aggregateTypes.length > 0) || dataStream.resolution != null
    );

  const staticAggregateChunks = sliceIntoChunks(staticRangeAggregateDataStreams, chunkSize);

  const staticRangeAggregatesQuery = useQueries({
    queries: staticAggregateChunks.map((chunk) => ({
      enabled: chunk.length > 0,
      queryKey: [
        {
          scope: 'static range aggregate data streams',
          entries: chunk.map((dataStream) => dataStream.entryId),
        },
      ],
      queryFn: async () => {
        const entriesWithDates = chunk.map((dataStream) => ({
          assetId: dataStream.assetId,
          propertyId: dataStream.propertyId,
          propertyAlias: dataStream.propertyAlias,
          aggregateTypes: dataStream.aggregateTypes,
          resolution: dataStream.resolution,
          entryId: dataStream.entryId,
          startDate: dataStream.range.startDate,
          endDate: dataStream.range.endDate,
        }));

        const paginator = paginateBatchGetAssetPropertyAggregates(
          { client: props.client, pageSize: 4000 },
          { entries: entriesWithDates }
        );

        const staticRangeAggregatesSuccessEntries: BatchGetAssetPropertyAggregatesCommandOutput['successEntries'] = [];
        const staticRangeAggregatesSkippedEntries: BatchGetAssetPropertyAggregatesCommandOutput['skippedEntries'] = [];
        const staticRangeAggregatesErrorEntries: BatchGetAssetPropertyAggregatesCommandOutput['errorEntries'] = [];

        for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
          staticRangeAggregatesSuccessEntries.push(...successEntries);
          staticRangeAggregatesSkippedEntries.push(...skippedEntries);
          staticRangeAggregatesErrorEntries.push(...errorEntries);
        }

        staticRangeAggregatesSuccessEntries.forEach(({ entryId, aggregatedValues }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'static aggregate data',
                entryId,
              },
            ],
            aggregatedValues
          );
        });

        staticRangeAggregatesSkippedEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'static aggregate data',
                entryId,
              },
            ],
            []
          );
        });

        staticRangeAggregatesErrorEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'static aggregate data',
                entryId,
              },
            ],
            []
          );
        });

        return [];
      },
    })),
  });

  const liveAggregateChunksWithRequestIntervals = liveAggregateEntryChunks
    .map((chunk) => {
      return requestIntervals.map((interval) => ({
        chunk,
        interval,
      }));
    })
    .flat();

  const liveAggregatesQuery = useQueries({
    queries: liveAggregateChunksWithRequestIntervals.map(({ chunk, interval }) => ({
      enabled: chunk.length > 0,
      refetchInterval: interval.refreshRate,
      queryKey: [
        {
          scope: 'live aggregate value data streams',
          maxAgeSeconds: interval.maxAgeSeconds,
          entries: chunk.map((query) => query.queryId),
        },
      ],
      queryFn: async () => {
        const now = Date.now();
        const nowInSeconds = Math.floor(now / 1000);
        const startDateInSeconds = nowInSeconds - interval.maxAgeSeconds;
        const endDateInSeconds = nowInSeconds - interval.minAgeSeconds;

        const entriesWithDates = chunk.map((query) => ({
          assetId: query.assetId,
          propertyId: query.propertyId,
          propertyAlias: query.propertyAlias,
          aggregateTypes: query.aggregateTypes,
          resolution: query.resolution,
          entryId: query.entryId,
          startDate: new Date(startDateInSeconds * 1000),
          endDate: new Date(endDateInSeconds * 1000),
        }));

        const paginator = paginateBatchGetAssetPropertyAggregates(
          { client: props.client, pageSize: 4000 },
          { entries: entriesWithDates }
        );

        const aggregateSuccessEntries: BatchGetAssetPropertyAggregatesCommandOutput['successEntries'] = [];
        const aggregateSkippedEntries: BatchGetAssetPropertyAggregatesCommandOutput['skippedEntries'] = [];
        const aggregateErrorEntries: BatchGetAssetPropertyAggregatesCommandOutput['errorEntries'] = [];

        for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
          aggregateSuccessEntries.push(...successEntries);
          aggregateSkippedEntries.push(...skippedEntries);
          aggregateErrorEntries.push(...errorEntries);
        }

        aggregateSuccessEntries.forEach(({ entryId, aggregatedValues }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'live data',
                queryId: chunk.find((query) => query.queryId === entryId)?.queryId,
                entryId,
                maxAgeSeconds: interval.maxAgeSeconds,
              },
            ],
            aggregatedValues
          );
        });

        aggregateSkippedEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'live data',
                queryId: chunk.find((query) => query.queryId === entryId)?.queryId,
                entryId,
                maxAgeSeconds: interval.maxAgeSeconds,
              },
            ],
            []
          );
        });

        aggregateErrorEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'live data',
                queryId: chunk.find((query) => query.queryId === entryId)?.queryId,
                entryId,
                maxAgeSeconds: interval.maxAgeSeconds,
              },
            ],
            []
          );
        });

        return [];
      },
    })),
  });

  const staticRangeHistoricalDataStreams = props.dataStreams
    .filter(
      (dataStream): dataStream is typeof dataStream & { range: { startDate: Date; endDate: Date } } =>
        dataStream.range != null
    )
    .filter((dataStream) => {
      if (dataStream.aggregateTypes != null && dataStream.aggregateTypes.length > 0) {
        return false;
      }

      if (dataStream.resolution != null) {
        return false;
      }

      if (dataStream.onlyLatestValue === true) {
        return false;
      }

      return true;
    });

  const staticHistoricalChunks = sliceIntoChunks(staticRangeHistoricalDataStreams, chunkSize);

  const staticRangeHistoricalQuery = useQueries({
    queries: staticHistoricalChunks.map((historicalChunk) => ({
      enabled: historicalChunk.length > 0,
      queryKey: [
        {
          scope: 'static range historical data streams',
          entries: historicalChunk.map((dataStream) => dataStream.entryId),
        },
      ],
      queryFn: async () => {
        const entriesWithDates = historicalChunk.map((dataStream) => ({
          assetId: dataStream.assetId,
          propertyId: dataStream.propertyId,
          propertyAlias: dataStream.propertyAlias,
          entryId: dataStream.entryId,
          startDate: dataStream.range.startDate,
          endDate: dataStream.range.endDate,
        }));

        const paginator = paginateBatchGetAssetPropertyValueHistory(
          { client: props.client, pageSize: 20000 },
          { entries: entriesWithDates }
        );

        const staticRangeHistoricalSuccessEntries: BatchGetAssetPropertyValueHistoryCommandOutput['successEntries'] =
          [];
        const staticRangeHistoricalSkippedEntries: BatchGetAssetPropertyValueHistoryCommandOutput['skippedEntries'] =
          [];
        const staticRangeHistoricalErrorEntries: BatchGetAssetPropertyValueHistoryCommandOutput['errorEntries'] = [];

        for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
          staticRangeHistoricalSuccessEntries.push(...successEntries);
          staticRangeHistoricalSkippedEntries.push(...skippedEntries);
          staticRangeHistoricalErrorEntries.push(...errorEntries);
        }

        staticRangeHistoricalSuccessEntries.forEach(({ entryId, assetPropertyValueHistory }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'static historical data',
                queryId: entryId,
              },
            ],
            assetPropertyValueHistory
          );
        });

        staticRangeHistoricalSkippedEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'static historical data',
                queryId: entryId,
              },
            ],
            []
          );
        });

        staticRangeHistoricalErrorEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'static historical data',
                queryId: entryId,
              },
            ],
            []
          );
        });

        return [];
      },
    })),
  });

  const liveHistoricalChunksWithIntervals = liveHistoricalEntryChunks
    .map((chunk) => {
      return requestIntervals.map((interval) => ({
        chunk,
        interval,
      }));
    })
    .flat();

  const liveHistoricalQuery = useQueries({
    queries: liveHistoricalChunksWithIntervals.map(({ chunk, interval }) => ({
      enabled: chunk.length > 0,
      refetchInterval: interval.refreshRate,
      queryKey: [
        {
          scope: 'live historical value data streams',
          maxAge: interval.maxAgeSeconds,
          entries: chunk.map((query) => query.queryId),
        },
      ],
      queryFn: async () => {
        const now = Date.now();
        const nowInSeconds = Math.floor(now / 1000);
        const startDateInSeconds = nowInSeconds - interval.maxAgeSeconds;
        const endDateInSeconds = nowInSeconds - interval.minAgeSeconds;

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
        const historicalSkippedEntries: BatchGetAssetPropertyValueHistoryCommandOutput['skippedEntries'] = [];
        const historicalErrorEntries: BatchGetAssetPropertyValueHistoryCommandOutput['errorEntries'] = [];

        for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
          historicalSuccessEntries.push(...successEntries);
          historicalSkippedEntries.push(...skippedEntries);
          historicalErrorEntries.push(...errorEntries);
        }

        historicalSuccessEntries.forEach(({ entryId, assetPropertyValueHistory }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'live data',
                queryId: chunk.find((query) => query.queryId === entryId)?.queryId,
                entryId,
                maxAgeSeconds: interval.maxAgeSeconds,
              },
            ],
            assetPropertyValueHistory
          );
        });

        historicalSkippedEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'live data',
                queryId: chunk.find((query) => query.queryId === entryId)?.queryId,
                entryId,
                maxAgeSeconds: interval.maxAgeSeconds,
              },
            ],
            []
          );
        });

        historicalErrorEntries.forEach(({ entryId }) => {
          queryClient.setQueryData(
            [
              {
                scope: 'live data',
                queryId: chunk.find((query) => query.queryId === entryId)?.queryId,
                entryId,
                maxAgeSeconds: interval.maxAgeSeconds,
              },
            ],
            []
          );
        });

        return [];
      },
    })),
  });

  const latestValueDataStreams = props.dataStreams.filter((dataStream) => {
    if (dataStream.onlyLatestValue === true) {
      return true;
    }

    return false;
  });

  const liveLatestValueQuery = useQuery({
    enabled: latestValueDataStreams.length > 0,
    refetchInterval: 5000,
    queryKey: [
      {
        scope: 'live latest value data streams',
        entries: latestValueDataStreams.map((dataStream) => dataStream.entryId),
      },
    ],
    queryFn: async () => {
      const requestEntries = latestValueDataStreams.map((dataStream) => {
        return {
          assetId: dataStream.assetId,
          propertyId: dataStream.propertyId,
          propertyAlias: dataStream.propertyAlias,
          // TODO: add unique id
          entryId: dataStream.entryId,
        };
      });

      const paginator = paginateBatchGetAssetPropertyValue({ client: props.client }, { entries: requestEntries });

      const latestValueSuccessEntries: BatchGetAssetPropertyValueCommandOutput['successEntries'] = [];
      const latestValueSkippedEntries: BatchGetAssetPropertyValueCommandOutput['skippedEntries'] = [];
      const latestValueErrorEntries: BatchGetAssetPropertyValueCommandOutput['errorEntries'] = [];

      for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
        latestValueSuccessEntries.push(...successEntries);
        latestValueSkippedEntries.push(...skippedEntries);
        latestValueErrorEntries.push(...errorEntries);
      }

      latestValueSuccessEntries.forEach(({ entryId, assetPropertyValue }) => {
        queryClient.setQueryData(
          [
            {
              scope: 'live latest value data',
              entryId,
            },
          ],
          [assetPropertyValue]
        );
      });

      latestValueSkippedEntries.forEach(({ entryId }) => {
        queryClient.setQueryData(
          [
            {
              scope: 'live latest value data',
              entryId,
            },
          ],
          []
        );
      });

      latestValueErrorEntries.forEach(({ entryId }) => {
        queryClient.setQueryData(
          [
            {
              scope: 'live latest value data',
              entryId,
            },
          ],
          []
        );
      });

      return [];
    },
  });

  return {
    staticRangeAggregatesQuery,
    liveAggregatesQuery,
    staticRangeHistoricalQuery,
    liveHistoricalQuery,
    liveLatestValueQuery,
  };
}
