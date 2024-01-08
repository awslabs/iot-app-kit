import { completePropertyStream } from './completePropertyStream';
import {
  ASSET_MODEL_WITH_ALARM,
  ALARM_ASSET_ID,
  INPUT_PROPERTY_ID,
  TIME_SERIES_DATA_WITH_ALARMS,
  ALARM,
} from '../../__mocks__/alarm';
import type { DataStream } from '@iot-app-kit/core';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';

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
    dataType: 'BOOLEAN' as PropertyDataType,
    unit: 'test',
  };

  const modelProps = ASSET_MODEL_WITH_ALARM.assetModelProperties?.map(
    (property) => {
      if (property.id === INPUT_PROPERTY_ID) {
        return { ...property, ...expectedMetaData };
      }

      return property;
    }
  );

  expect(
    completePropertyStream({
      assetModel: {
        ...ASSET_MODEL_WITH_ALARM,
        assetModelProperties: modelProps,
      },
      modeledDataStreams: (modelProps ?? []).map(() => ({
        propertyId: INPUT_PROPERTY_ID,
        assetId: ALARM_ASSET_ID,
        assetName: 'NAME',
        dataTypeSpec: 'somespec',
        ...expectedMetaData,
      })),
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
      modeledDataStreams: (
        ASSET_MODEL_WITH_ALARM.assetModelProperties ?? []
      ).map(({ unit, name, dataType }) => ({
        propertyId: INPUT_PROPERTY_ID,
        assetId: ALARM_ASSET_ID,
        assetName: 'NAME',
        dataTypeSpec: 'somespec',
        name: name ?? 'test',
        dataType: dataType ?? 'BOOLEAN',
        unit: unit ?? 'test',
      })),
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
      modeledDataStreams: [],
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
      modeledDataStreams: [],
      assetId: ALARM_ASSET_ID,
      propertyId: 'non-existent---property',
      dataStream: TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
      alarms: {},
    })
  ).toEqual(undefined);
});
