import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import type { IntervalStructure } from '../../common/intervalStructure';
import type { ErrorDetails } from '../../common/types';
import type { DataPoint, DataStream } from '../types';

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
  dataCache: IntervalStructure<DataPoint>;
  // maintains a cache of all date intervals which have been requested.
  requestCache: IntervalStructure<DataPoint>;
  // List of recent date ranges requested. Won't be a full list of all requests - must be disjoint
  requestHistory: HistoricalRequest[];
  // During an initial load
  isLoading: boolean;
  // When data is being requested, whether or not data has been previously requested
  isRefreshing: boolean;
  aggregationType?: AggregateType;
  error?: ErrorDetails;
  numOutgoingRequests?: number;
} & Omit<DataStream, 'data'>;

export type AggregationStreamStore = {
  [aggregationType in AggregateType]?: DataStreamStore | undefined;
};

export type DataStoreForID = {
  resolutions?:
    | { [resolution: number]: AggregationStreamStore | undefined }
    | undefined;
  rawData?: DataStreamStore | undefined;
};

export type DataStreamsStore = {
  [dataStreamId: string]: DataStoreForID | undefined;
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
