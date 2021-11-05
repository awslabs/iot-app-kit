import { DataPoint, Primitive } from '@synchro-charts/core';
import { IntervalStructure } from '../../common/intervalStructure';

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
  error?: string;
};
export type DataStreamsStore = {
  [dataStreamId: string]:
    | {
        [resolution: number]: DataStreamStore | undefined;
      }
    | undefined;
};
