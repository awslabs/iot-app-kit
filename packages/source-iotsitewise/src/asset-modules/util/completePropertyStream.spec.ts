import { completePropertyStream } from './completePropertyStream';
import {
  ASSET_MODEL_WITH_ALARM,
  ALARM_ASSET_ID,
  INPUT_PROPERTY_ID,
  TIME_SERIES_DATA_WITH_ALARMS,
  ALARM,
} from '../../__mocks__/alarm';
import { DataStream } from '@iot-app-kit/core';

const PROPERTY_STREAM = {
  id: 'alarm-asset-id---input-property-id',
  name: 'inputProperty',
  unit: 'Celsius',
  resolution: 0,
  refId: undefined,
  isRefreshing: false,
  isLoading: false,
  error: undefined,
  dataType: 'NUMBER',
  aggregates: {},
  associatedStreams: [],
  data: [
    {
      x: 1000000,
      y: 12,
    },
    {
      x: 2000000,
      y: 45,
    },
  ],
} as DataStream;

it('completes an asset model property stream', () => {
  const expectedMetaData = {
    name: 'test',
    dataType: 'BOOLEAN',
    unit: 'test',
  };

  expect(
    completePropertyStream({
      assetModel: {
        ...ASSET_MODEL_WITH_ALARM,
        assetModelProperties: ASSET_MODEL_WITH_ALARM.assetModelProperties?.map((property) => {
          if (property.id === INPUT_PROPERTY_ID) {
            return { ...property, ...expectedMetaData };
          }

          return property;
        }),
      },
      assetId: ALARM_ASSET_ID,
      propertyId: INPUT_PROPERTY_ID,
      dataStream: {
        ...PROPERTY_STREAM,
        name: undefined,
        unit: undefined,
        dataType: undefined,
      },
      alarms: {},
    })
  ).toEqual({
    ...PROPERTY_STREAM,
    ...expectedMetaData,
  });
});

it('appends associated stream if alarm on property created', () => {
  expect(
    completePropertyStream({
      assetModel: ASSET_MODEL_WITH_ALARM,
      assetId: ALARM_ASSET_ID,
      propertyId: INPUT_PROPERTY_ID,
      dataStream: PROPERTY_STREAM,
      alarms: { 'alarm-asset-id---alarm-state-property-id': ALARM },
    })
  ).toEqual({
    ...PROPERTY_STREAM,
    associatedStreams: [
      {
        id: 'alarm-asset-id---alarm-state-property-id',
        type: 'ALARM',
      },
    ],
  });
});

it('returns undefined when no asset model', () => {
  expect(
    completePropertyStream({
      assetId: ALARM_ASSET_ID,
      propertyId: INPUT_PROPERTY_ID,
      dataStream: TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
      alarms: {},
    })
  ).toEqual(undefined);
});

it('returns undefined when property not found in asset model', () => {
  expect(
    completePropertyStream({
      assetModel: ASSET_MODEL_WITH_ALARM,
      assetId: ALARM_ASSET_ID,
      propertyId: 'non-existent---property',
      dataStream: TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
      alarms: {},
    })
  ).toEqual(undefined);
});
