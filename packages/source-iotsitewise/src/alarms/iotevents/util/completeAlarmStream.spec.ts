import { completeAlarmStream } from './completeAlarmStream';
import {
  ASSET_MODEL_WITH_ALARM,
  ALARM_STATE_PROPERTY_ID,
  TIME_SERIES_DATA_WITH_ALARMS,
  ALARM_STATE_JSON_BLOB,
} from '../../../__mocks__/alarm';

it('returns alarm stream if property found in asset model composite model', () => {
  expect(
    completeAlarmStream({
      assetModel: ASSET_MODEL_WITH_ALARM,
      propertyId: ALARM_STATE_PROPERTY_ID,
      dataStream: {
        ...TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
        data: [
          {
            x: 1000000,
            y: JSON.stringify(ALARM_STATE_JSON_BLOB),
          },
        ],
      },
    })
  ).toEqual(
    expect.objectContaining({
      id: 'alarm-asset-id---alarm-state-property-id',
      name: 'AWS/ALARM_STATE',
      streamType: 'ALARM',
      dataType: 'NUMBER',
      data: [
        {
          x: 1000000,
          y: 'Active',
        },
      ],
    })
  );
});

it('returns alarm stream if no asset model but inferred to be iot events alarm state property value', () => {
  expect(
    completeAlarmStream({
      propertyId: ALARM_STATE_PROPERTY_ID,
      dataStream: {
        ...TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
        data: [
          {
            x: 1000000,
            y: JSON.stringify(ALARM_STATE_JSON_BLOB),
          },
        ],
      },
    })
  ).toEqual(
    expect.objectContaining({
      id: 'alarm-asset-id---alarm-state-property-id',
      name: 'AWS/ALARM_STATE',
      streamType: 'ALARM',
      dataType: 'NUMBER',
      data: [
        {
          x: 1000000,
          y: 'Active',
        },
      ],
    })
  );
});

it('returns undefined if stream is not alarm stream', () => {
  expect(
    completeAlarmStream({
      propertyId: ALARM_STATE_PROPERTY_ID,
      dataStream: {
        ...TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
        data: [
          {
            x: 1000000,
            y: 123,
          },
        ],
      },
    })
  ).toBe(undefined);
});
