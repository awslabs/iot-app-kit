import { DataPoint, Primitive } from '@synchro-charts/core';
import { IntervalStructure } from '../../common/intervalStructure';
import { ErrorDetails } from '../../common/types';
import { DataStream } from '../types';

type TTL = number;
export type TTLDurationMapping = {
  [durationMS: number]: TTL;
};

export type HistoricalRequest = {
  start: Date;
  end: Date;
  requestedAt: Date;
};

export type DataStreamStore = {
  id: string;
  resolution: number;
  // maintains a cache of all the data points, and their associated date intervals.
  dataCache: IntervalStructure<DataPoint<Primitive>>;
  // maintains a cache of all date intervals which have been requested.
  requestCache: IntervalStructure<DataPoint<Primitive>>;
  // List of recent date ranges requested. Won't be a full list of all requests - must be disjoint
  requestHistory: HistoricalRequest[];
  // During an initial load
  isLoading: boolean;
  // When data is being requested, whether or not data has been previously requested
  isRefreshing: boolean;
  error?: ErrorDetails;
} & Omit<DataStream, 'data' | 'aggregates'>;

export type DataStreamsStore = {
  [dataStreamId: string]:
    | {
        [resolution: number]: DataStreamStore | undefined;
      }
    | undefined;
};

export type CacheSettings = {
  // Mapping of duration to TTL, in MS.
  // Cache data is re-requested for data if the duration TTL is surpassed.
  // If the duration since the last request was longer the any of the provided duration's, then the value never expires.
  // INVARIANT: for any two pairs (durationMS, TTL), if a given durationMS is larger than another durationMS, it's TTL
  //            must also be larger
  //            i.e. given two pairs, (d1, ttl1) and (d2, ttl2),
  //            d1 > d2 iff ttl1 > ttl2
  ttlDurationMapping: TTLDurationMapping;
};
