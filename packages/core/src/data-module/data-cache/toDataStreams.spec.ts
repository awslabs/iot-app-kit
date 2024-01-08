import { toDataStreams } from './toDataStreams';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';
import { MINUTE_IN_MS } from '../../common/time';
import { DATA_TYPE, STREAM_TYPE } from '../../common/constants';
import type { DataStreamsStore, DataStreamStore } from './types';
import type { DataStream } from '../types';

const ALARM = 'alarm';
const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1);
const AGGREGATE_TYPE = AggregateType.AVERAGE;

export const NUMBER_STREAM_1: DataStream<number> = {
  id: 'number-some-id',
  color: 'cyan',
  name: 'number-some-name',
  dataType: DATA_TYPE.NUMBER,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 100,
    },
  ],
};

const ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream',
  dataType: DATA_TYPE.STRING,
  name: 'alarm stream',
  color: 'red',
  streamType: STREAM_TYPE.ALARM,
  resolution: 0,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE.getTime(),
      y: ALARM,
    },
  ],
};

const rawStore: DataStreamStore = {
  id: ALARM_STREAM.id,
  resolution: 0,
  dataCache: addToDataPointCache({
    start: new Date(),
    end: new Date(),
    data: ALARM_STREAM.data,
    cache: EMPTY_CACHE,
  }),
  requestCache: EMPTY_CACHE,
  requestHistory: [],
  meta: { key: 1000 },
  name: 'somedatastreamname',
  dataType: 'NUMBER',
  isLoading: false,
  isRefreshing: false,
};

const aggregatedStore = {
  id: ALARM_STREAM.id,
  resolution: MINUTE_IN_MS,
  dataCache: addToDataPointCache({
    start: new Date(),
    end: new Date(),
    data: NUMBER_STREAM_1.data,
    cache: EMPTY_CACHE,
  }),
  requestCache: EMPTY_CACHE,
  requestHistory: [],
  isLoading: false,
  isRefreshing: false,
  aggregationType: AGGREGATE_TYPE,
};

const STORE_WITH_NUMBERS_ONLY: DataStreamsStore = {
  [ALARM_STREAM.id]: {
    resolutions: { [MINUTE_IN_MS]: { [AGGREGATE_TYPE]: aggregatedStore } },
    rawData: rawStore,
  },
};

it('returns no data streams when provided no infos or stores', () => {
  expect(
    toDataStreams({ requestInformations: [], dataStreamsStores: {} })
  ).toBeEmpty();
});

it('returns no data streams when provided no infos with a non-empty store', () => {
  expect(
    toDataStreams({
      requestInformations: [],
      dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
    })
  ).toBeEmpty();
});

it('returns an array of data streams containing the requested resolutions', () => {
  const [stream] = toDataStreams({
    requestInformations: [{ ...ALARM_STREAM, resolution: '0' }],
    dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
  });
  expect(stream.resolution).toEqual(ALARM_STREAM.resolution);
  expect(stream.id).toEqual(ALARM_STREAM.id);
  expect(stream.data).toEqual(ALARM_STREAM.data);
});

it('appends additional information about dataStream that is cached', () => {
  const [stream] = toDataStreams({
    requestInformations: [{ ...ALARM_STREAM, resolution: '0' }],
    dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
  });

  expect(stream.dataType).toEqual(rawStore.dataType);
  expect(stream.name).toEqual(rawStore.name);
  expect(stream.meta).toEqual(rawStore.meta);
});

it('appends the refId from the request information', () => {
  const REF_ID = 'some-ref-id';
  const [stream] = toDataStreams({
    requestInformations: [{ ...ALARM_STREAM, resolution: '0', refId: REF_ID }],
    dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
  });

  expect(stream.refId).toEqual(REF_ID);
});
