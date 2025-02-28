import { toId } from '@iot-app-kit/source-iotsitewise';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ASSET_ID,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataWithInputProperty,
} from '../../../../../testing/alarms';
import { type DataStream } from '@iot-app-kit/core';
import { filterDataStreamsForAlarm } from './filterDataStreamsForAlarm';

const TEST_DATASTREAM_1 = {
  id: toId({
    assetId: MOCK_ASSET_ID,
    propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
  }),
  data: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 3, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

const TEST_DATASTREAM_2 = {
  id: toId({
    assetId: 'a1',
    propertyId: 'p1',
  }),
  data: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 3, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

const TEST_DATASTREAM_3 = {
  id: toId({
    propertyAlias: 'pa1',
  }),
  data: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 3, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

describe('filterDataStreamsForAlarm', () => {
  it('returns datastreams for an alarm data with input property', () => {
    expect(
      filterDataStreamsForAlarm(mockAlarmDataWithInputProperty, [
        TEST_DATASTREAM_1,
        TEST_DATASTREAM_2,
        TEST_DATASTREAM_3,
      ])
    ).toEqual(expect.arrayContaining([TEST_DATASTREAM_1]));

    expect(
      filterDataStreamsForAlarm(mockAlarmDataDescribeAlarmModel, [
        TEST_DATASTREAM_1,
        TEST_DATASTREAM_2,
        TEST_DATASTREAM_3,
      ])
    ).toBeArrayOfSize(0);
  });
});
