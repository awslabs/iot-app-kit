import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';

import type { TimeSeriesQuery, TimeSeriesQueryEntry } from '../types';

interface TimeSeriesEntriesState {
  entries: TimeSeriesQueryEntry[];
  registerQuery: (query: TimeSeriesQuery) => void;
  unregisterQuery: (queryId: string) => void;
}

export const useTimeSeriesEntriesStore = create<TimeSeriesEntriesState>(() => ({
  entries: [],
  registerQuery: (query: TimeSeriesQuery) => {
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
  },
  unregisterQuery: (queryId: string) => {
    useTimeSeriesEntriesStore.setState((state) => ({
      ...state,
      entries: state.entries.filter((query) => query.queryId !== queryId),
    }));
  },
}));

interface UseTimeSeriesDataProps {
  query: Omit<TimeSeriesQuery, 'queryId'>;
}
// TODO: Dedupe same request

export function useTimeSeriesData({ query }: UseTimeSeriesDataProps) {
  const queryClient = useQueryClient();
  const [queryId] = useState(nanoid());

  const { registerQuery, unregisterQuery } = useTimeSeriesEntriesStore((state) => ({
    registerQuery: state.registerQuery,
    unregisterQuery: state.unregisterQuery,
  }));

  useEffect(() => {
    console.log('queryId', queryId);
    registerQuery({ ...query, queryId: queryId });

    return () => unregisterQuery(queryId);
  }, []);

  const dataStreams = queryClient.getQueryData([{ scope: 'live data' }]);

  return { dataStreams };
}
