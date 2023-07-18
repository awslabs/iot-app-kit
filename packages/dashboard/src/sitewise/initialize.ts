import { useEffect, useState } from 'react';
import { type BatchGetAssetPropertyAggregatesCommandInput } from '@aws-sdk/client-iotsitewise';
import { atom, useSetAtom, useAtomValue } from 'jotai';
import { nanoid } from 'nanoid';
import { useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';

interface TimeSeriesEntriesState {
  entries: TimeSeriesQueryEntry[];
}

const useTimeSeriesEntriesStore = create<TimeSeriesEntriesState>(() => ({
  entries: [],
}));

export function registerQuery(query: TimeSeriesQuery) {
  const assetQueryEntries =
    query.assets?.flatMap((asset) => {
      return asset.properties.map((property) => {
        return {
          queryId: query.queryId,
          entryId: nanoid(),
          assetId: asset.assetId,
          propertyId: property.propertyId,
          aggregateTypes: property.aggregateTypes,
          resolution: property.resolution,
          propertyAlias: undefined,
        };
      });
    }) ?? [];

  const propertyQueryEntries =
    query.properties?.map((property) => {
      return {
        queryId: query.queryId,
        entryId: nanoid(),
        propertyAlias: property.propertyAlias,
        aggregateTypes: property.aggregateTypes,
        resolution: property.resolution,
        assetId: undefined,
        propertyId: undefined,
      };
    }) ?? [];

  useTimeSeriesEntriesStore.setState((state) => ({
    ...state,
    entries: [...state.entries, ...assetQueryEntries, ...propertyQueryEntries],
  }));
}

interface AssetQueryPart {
  assetId: string;
  properties: {
    propertyId: string;
    aggregateTypes?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['aggregateTypes'];
    resolution?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['resolution'];
  }[];
}

interface PropertyQueryPart {
  propertyAlias: string;
  aggregateTypes?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['aggregateTypes'];
  resolution?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['resolution'];
}

interface TimeSeriesQuery {
  queryId: string;
  assets?: AssetQueryPart[];
  properties?: PropertyQueryPart[];
}

type TimeSeriesQueryEntry = {
  queryId: string;
  entryId: string;
  assetId?: AssetQueryPart['assetId'];
  propertyId?: AssetQueryPart['properties'][number]['propertyId'];
  propertyAlias?: PropertyQueryPart['propertyAlias'];
  aggregateTypes?: PropertyQueryPart['aggregateTypes'];
  resolution?: PropertyQueryPart['resolution'];
};

const timeSeriesQueryEntriesBaseAtom = atom<TimeSeriesQueryEntry[]>([]);

const readTimeSeriesQueryEntriesAtom = atom((get) => get(timeSeriesQueryEntriesBaseAtom));
const writeTimeSeriesQueryEntriesAtom = atom(null, (_get, set, queryEntries: TimeSeriesQueryEntry[]) => {
  set(timeSeriesQueryEntriesBaseAtom, queryEntries);
});

const registerQueryAtom = atom(null, (get, set, query: TimeSeriesQuery) => {
  const assetQueryEntries =
    query.assets?.flatMap((asset) => {
      return asset.properties.map((property) => {
        return {
          queryId: query.queryId,
          entryId: nanoid(),
          assetId: asset.assetId,
          propertyId: property.propertyId,
          aggregateTypes: property.aggregateTypes,
          resolution: property.resolution,
          propertyAlias: undefined,
        };
      });
    }) ?? [];

  const propertyQueryEntries =
    query.properties?.map((property) => {
      return {
        queryId: query.queryId,
        entryId: nanoid(),
        propertyAlias: property.propertyAlias,
        aggregateTypes: property.aggregateTypes,
        resolution: property.resolution,
        assetId: undefined,
        propertyId: undefined,
      };
    }) ?? [];

  const currentEntries = get(readTimeSeriesQueryEntriesAtom);
  const updatedEntries = [...currentEntries, ...assetQueryEntries, ...propertyQueryEntries];

  set(writeTimeSeriesQueryEntriesAtom, updatedEntries);
});

const unregisterQueryAtom = atom(null, (get, set, queryId: string) => {
  const currentQueries = get(readTimeSeriesQueryEntriesAtom);
  const updatedQueries = currentQueries.filter((query) => query.queryId !== queryId);

  set(writeTimeSeriesQueryEntriesAtom, updatedQueries);
});

function sliceIntoChunks<T>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const readEntriesByTypeAtom = atom((get) => {
  const entries = get(readTimeSeriesQueryEntriesAtom);

  const liveAggregateEntries = entries.filter((entry) => {
    return (
      entry.aggregateTypes != null &&
      entry.aggregateTypes.length > 0 &&
      entry.resolution != null &&
      entry.resolution !== ''
    );
  });
  const liveAggregateEntryChunks = sliceIntoChunks(liveAggregateEntries, 16);

  const liveHistoricalEntries = entries.filter((entry) => {
    return (
      entry.aggregateTypes == null ||
      entry.aggregateTypes.length === 0 ||
      entry.resolution == null ||
      entry.resolution === ''
    );
  });
  const liveHistoricalEntryChunks = sliceIntoChunks(liveHistoricalEntries, 16);

  return {
    liveAggregateEntryChunks,
    liveHistoricalEntryChunks,
  };
});

export function useTimeSeriesQueryEntries() {
  const queries = useAtomValue(readEntriesByTypeAtom);

  return queries;
}

interface UseTimeSeriesDataProps {
  query: Omit<TimeSeriesQuery, 'queryId'>;
}
// TODO: Dedupe same request

export function useTimeSeriesData({ query }: UseTimeSeriesDataProps) {
  const queryClient = useQueryClient();
  const [queryId] = useState(nanoid());

  const registerQuery = useSetAtom(registerQueryAtom);
  const unregisterQuery = useSetAtom(unregisterQueryAtom);

  useEffect(() => {
    console.log('queryId', queryId);
    registerQuery({ ...query, queryId: queryId });

    return () => unregisterQuery(queryId);
  }, []);

  const dataStreams = queryClient.getQueryData([{ scope: 'live data' }]);

  return { dataStreams };
}
