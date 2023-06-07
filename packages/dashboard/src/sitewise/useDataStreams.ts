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
import { useQueries, useQuery } from '@tanstack/react-query';

/*
# TODO:
- Static time range
- Live + beyond 20 minutes
*/

interface DataStream {
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  aggregateTypes?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['aggregateTypes'];
  resolution?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['resolution'];
  onlyLatestValue?: boolean;
  entryId: string;
}

interface UseDataStreamsProps {
  dataStreams: DataStream[];
  client: IoTSiteWiseClient;
}

const requestIntervals = [
  { minAge: 0, maxAge: 72000, refreshRate: 5000 },
  { minAge: 72001, maxAge: 180000, refreshRate: 30000 },
  { minAge: 180001, maxAge: 1200000, refreshRate: 300000 },
];

export function useLiveDataStreams(props: UseDataStreamsProps) {
  const aggregateDataStreams = props.dataStreams.filter(
    (dataStream) =>
      (dataStream.aggregateTypes != null && dataStream.aggregateTypes.length > 0) || dataStream.resolution != null
  );

  const liveAggregatesQuery = useQueries({
    queries: requestIntervals.map((interval) => ({
      refetchInterval: interval.refreshRate,
      queryKey: [
        {
          scope: 'live aggregate value data streams',
          maxAge: interval.maxAge,
          dataStreams: Object.fromEntries(
            aggregateDataStreams.map((dataStream) => {
              return [
                dataStream.entryId,
                {
                  aggregateTypes: dataStream.aggregateTypes,
                  resolution: dataStream.resolution,
                },
              ];
            })
          ),
        },
      ],
      queryFn: async () => {
        const entriesWithDates = aggregateDataStreams.map((dataStream) => ({
          assetId: dataStream.assetId,
          propertyId: dataStream.propertyId,
          propertyAlias: dataStream.propertyAlias,
          aggregateTypes: dataStream.aggregateTypes,
          resolution: dataStream.resolution,
          entryId: dataStream.entryId,
          startDate: new Date(Date.now() - interval.maxAge),
          endDate: new Date(Date.now() - interval.minAge),
        }));

        const paginator = paginateBatchGetAssetPropertyAggregates(
          { client: props.client, pageSize: 4000 },
          { entries: entriesWithDates }
        );

        const successEntries: BatchGetAssetPropertyAggregatesCommandOutput['successEntries'] = [];
        const skippedEntries: BatchGetAssetPropertyAggregatesCommandOutput['skippedEntries'] = [];
        const errorEntries: BatchGetAssetPropertyAggregatesCommandOutput['errorEntries'] = [];

        for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
          successEntries.push(...successEntries);
          skippedEntries.push(...skippedEntries);
          errorEntries.push(...errorEntries);
        }

        return {
          successEntries,
          skippedEntries,
          errorEntries,
        };
      },
    })),
  });

  const {
    successEntries: aggregateSuccessEntries = [],
    skippedEntries: aggregateSkippedEntries = [],
    errorEntries: aggregateErrorEntries = [],
  } = liveAggregatesQuery[0].data ?? {};

  const aggregateSuccessEntryToData = Object.fromEntries(
    aggregateSuccessEntries.map((entry) => {
      return [entry.entryId, { aggregatedValues: entry.aggregatedValues }];
    })
  );

  const aggregateSkippedEntryToData = Object.fromEntries(
    aggregateSkippedEntries.map((entry) => {
      return [entry.entryId, { completionStatus: entry.completionStatus, errorInfo: entry.errorInfo }];
    })
  );

  const aggregateErrorEntryToData = Object.fromEntries(
    aggregateErrorEntries.map((entry) => {
      return [entry.entryId, { errorCode: entry.errorCode, errorMessage: entry.errorMessage }];
    })
  );

  const aggregateEntryToData = {
    ...aggregateSuccessEntryToData,
    ...aggregateSkippedEntryToData,
    ...aggregateErrorEntryToData,
  };

  const historicalDataStreams = props.dataStreams.filter((dataStream) => {
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

  const liveHistoricalQuery = useQueries({
    queries: requestIntervals.map((interval) => ({
      refetchInterval: interval.refreshRate,
      queryKey: [
        {
          scope: 'live historical value data streams',
          maxAge: interval.maxAge,
          dataStreams: Object.fromEntries(
            historicalDataStreams.map((dataStream) => {
              return [dataStream.entryId, {}];
            })
          ),
        },
      ],
      queryFn: async () => {
        const entriesWithDates = historicalDataStreams.map((dataStream) => ({
          assetId: dataStream.assetId,
          propertyId: dataStream.propertyId,
          propertyAlias: dataStream.propertyAlias,
          // TODO: add unique id
          entryId: dataStream.entryId,
          startDate: new Date(Date.now() - interval.maxAge),
          endDate: new Date(Date.now() - interval.minAge),
        }));

        const paginator = paginateBatchGetAssetPropertyValueHistory(
          { client: props.client, pageSize: 20000 },
          { entries: entriesWithDates }
        );

        const successEntries: BatchGetAssetPropertyValueHistoryCommandOutput['successEntries'] = [];
        const skippedEntries: BatchGetAssetPropertyValueHistoryCommandOutput['skippedEntries'] = [];
        const errorEntries: BatchGetAssetPropertyValueHistoryCommandOutput['errorEntries'] = [];

        for await (const { successEntries = [] } of paginator) {
          successEntries.push(...successEntries);
          skippedEntries.push(...skippedEntries);
          errorEntries.push(...errorEntries);
        }

        return {
          successEntries,
          skippedEntries,
          errorEntries,
        };
      },
    })),
  });

  const {
    successEntries: historicalSuccessEntries = [],
    skippedEntries: historicalSkippedEntries = [],
    errorEntries: historicalErrorEntries = [],
  } = liveHistoricalQuery[0].data ?? {};

  const historicalSuccessEntryToData = Object.fromEntries(
    historicalSuccessEntries.map((entry) => {
      return [entry.entryId, { assetPropertyValueHistory: entry.assetPropertyValueHistory }];
    })
  );

  const historicalSkippedEntryToData = Object.fromEntries(
    historicalSkippedEntries.map((entry) => {
      return [entry.entryId, { completionStatus: entry.completionStatus, errorInfo: entry.errorInfo }];
    })
  );

  const historicalErrorEntryToData = Object.fromEntries(
    historicalErrorEntries.map((entry) => {
      return [entry.entryId, { errorCode: entry.errorCode, errorMessage: entry.errorMessage }];
    })
  );

  const historicalEntryToData = {
    ...historicalSuccessEntryToData,
    ...historicalSkippedEntryToData,
    ...historicalErrorEntryToData,
  };

  const latestValueDataStreams = props.dataStreams.filter((dataStream) => {
    if (dataStream.onlyLatestValue === true) {
      return true;
    }

    return false;
  });

  const liveLatestValueQuery = useQuery({
    refetchInterval: 5000,
    queryKey: [
      {
        scope: 'live latest value data streams',
        dataStreams: Object.fromEntries(
          latestValueDataStreams.map((dataStream) => {
            return [dataStream.entryId, {}];
          })
        ),
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

      const successEntries: BatchGetAssetPropertyValueCommandOutput['successEntries'] = [];
      const skippedEntries: BatchGetAssetPropertyValueCommandOutput['skippedEntries'] = [];
      const errorEntries: BatchGetAssetPropertyValueCommandOutput['errorEntries'] = [];

      for await (const { successEntries = [], skippedEntries = [], errorEntries = [] } of paginator) {
        successEntries.push(...successEntries);
        skippedEntries.push(...skippedEntries);
        errorEntries.push(...errorEntries);
      }

      return {
        successEntries,
        skippedEntries,
        errorEntries,
      };
    },
  });

  const {
    successEntries: latestValueSuccessEntries = [],
    skippedEntries: latestValueSkippedEntries = [],
    errorEntries: latestValueErrorEntries = [],
  } = liveLatestValueQuery.data ?? {};

  const latestValueSuccessEntryToData = Object.fromEntries(
    latestValueSuccessEntries.map((entry) => {
      return [entry.entryId, { assetPropertyValue: entry.assetPropertyValue }];
    })
  );

  const latestValueSkippedEntryToData = Object.fromEntries(
    latestValueSkippedEntries.map((entry) => {
      return [entry.entryId, { completionStatus: entry.completionStatus, errorInfo: entry.errorInfo }];
    })
  );

  const latestValueErrorEntryToData = Object.fromEntries(
    latestValueErrorEntries.map((entry) => {
      return [entry.entryId, { errorCode: entry.errorCode, errorMessage: entry.errorMessage }];
    })
  );

  const latestValueEntryToData = {
    ...latestValueSuccessEntryToData,
    ...latestValueSkippedEntryToData,
    ...latestValueErrorEntryToData,
  };

  return {
    data: {
      ...aggregateEntryToData,
      ...historicalEntryToData,
      ...latestValueEntryToData,
    },
  };
}
