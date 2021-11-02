import { toDataStreams } from './toDataStreams';
import { DataStreamsStore } from './types';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';
import { ALARM_STREAM, ALARM_STREAM_INFO, NUMBER_STREAM_1 } from '../../testing/__mocks__/mockWidgetProperties';
import { MINUTE_IN_MS } from '../../utils/time';

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
  expect(toDataStreams({ dataStreamInfo: [], dataStreamsStores: {} })).toBeEmpty();
});

it('returns no data streams when provided no infos with a non-empty store', () => {
  expect(toDataStreams({ dataStreamInfo: [], dataStreamsStores: STORE_WITH_NUMBERS_ONLY })).toBeEmpty();
});

it('returns a single data stream containing all the available resolutions', () => {
  const [stream] = toDataStreams({ dataStreamInfo: [ALARM_STREAM_INFO], dataStreamsStores: STORE_WITH_NUMBERS_ONLY });
  expect(stream.resolution).toEqual(ALARM_STREAM_INFO.resolution);
  expect(stream.id).toEqual(ALARM_STREAM_INFO.id);
  // expect(stream.detailedName).toEqual(ALARM_STREAM_INFO.detailedName);
  // expect(stream.dataType).toEqual(ALARM_STREAM_INFO.dataType);
  // expect(stream.streamType).toEqual(ALARM_STREAM_INFO.streamType);
  expect(stream.data).toEqual(ALARM_STREAM.data);
  expect(stream.aggregates![MINUTE_IN_MS]).toEqual(NUMBER_STREAM_1.data);
});
