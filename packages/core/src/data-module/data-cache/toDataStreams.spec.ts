import { toDataStreams } from './toDataStreams';
import { DataStreamsStore } from './types';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';
import { MINUTE_IN_MS } from '../../common/time';
import { DataStreamInfo, DataStream, DataType, StreamType } from '@synchro-charts/core';

const ALARM = 'alarm';
const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1);

const NUMBER_INFO_1: DataStreamInfo = {
  id: 'number-some-id',
  resolution: 0,
  dataType: DataType.NUMBER,
  color: 'cyan',
  name: 'number-some-name',
};

export const NUMBER_STREAM_1: DataStream<number> = {
  id: NUMBER_INFO_1.id,
  color: 'cyan',
  name: 'number-some-name',
  dataType: NUMBER_INFO_1.dataType,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 100,
    },
  ],
};

export const ALARM_STREAM_INFO: DataStreamInfo = {
  id: 'alarm-stream',
  resolution: 0,
  dataType: DataType.STRING,
  streamType: StreamType.ALARM,
  name: 'alarm stream',
  color: 'red',
};

const ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream',
  dataType: DataType.STRING,
  name: 'alarm stream',
  color: 'red',
  streamType: StreamType.ALARM,
  resolution: 0,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE.getTime(),
      y: ALARM,
    },
  ],
};

const rawStore = {
  id: ALARM_STREAM_INFO.id,
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
  id: ALARM_STREAM_INFO.id,
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
};

const STORE_WITH_NUMBERS_ONLY: DataStreamsStore = {
  [ALARM_STREAM_INFO.id]: {
    0: rawStore,
    [MINUTE_IN_MS]: aggregatedStore,
  },
};

it('returns no data streams when provided no infos or stores', () => {
  expect(toDataStreams({ requestInformations: [], dataStreamsStores: {} })).toBeEmpty();
});

it('returns no data streams when provided no infos with a non-empty store', () => {
  expect(toDataStreams({ requestInformations: [], dataStreamsStores: STORE_WITH_NUMBERS_ONLY })).toBeEmpty();
});

it('returns a single data stream containing all the available resolutions', () => {
  const [stream] = toDataStreams({
    requestInformations: [{ ...ALARM_STREAM_INFO, resolution: '0' }],
    dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
  });
  expect(stream.resolution).toEqual(ALARM_STREAM_INFO.resolution);
  expect(stream.id).toEqual(ALARM_STREAM_INFO.id);
  // expect(stream.detailedName).toEqual(ALARM_STREAM_INFO.detailedName);
  // expect(stream.dataType).toEqual(ALARM_STREAM_INFO.dataType);
  // expect(stream.streamType).toEqual(ALARM_STREAM_INFO.streamType);
  expect(stream.data).toEqual(ALARM_STREAM.data);
  expect(stream.aggregates![MINUTE_IN_MS]).toEqual(NUMBER_STREAM_1.data);
});

it('appends additional information about dataStream that is cached', () => {
  const [stream] = toDataStreams({
    requestInformations: [{ ...ALARM_STREAM_INFO, resolution: '0' }],
    dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
  });

  expect(stream.dataType).toEqual(rawStore.dataType);
  expect(stream.name).toEqual(rawStore.name);
  expect(stream.meta).toEqual(rawStore.meta);
});

it('appends the refId from the request information', () => {
  const REF_ID = 'some-ref-id';
  const [stream] = toDataStreams({
    requestInformations: [{ ...ALARM_STREAM_INFO, resolution: '0', refId: REF_ID }],
    dataStreamsStores: STORE_WITH_NUMBERS_ONLY,
  });

  expect(stream.refId).toEqual(REF_ID);
});
