import { DATA_TYPE } from '@iot-app-kit/core';
import { completeDataStreams } from './completeDataStreams';
import { toId } from './time-series-data/util/dataStreamId';
import { ASSET_MODEL } from './__mocks__/assetModel';
import {
  ASSET_MODEL_WITH_ALARM,
  ALARM_STATE_PROPERTY_ID,
  ALARM_STATE_JSON_BLOB,
  INPUT_PROPERTY_ID,
  ALARM_ASSET_ID,
  ALARM,
} from './__mocks__/alarm';
import type { DataStream } from '@iot-app-kit/core';
import type { AssetModelProperty } from '@aws-sdk/client-iotsitewise';

const STRING_INFO_1 = {
  id: 'some-string-info',
  resolution: 0,
  dataType: DATA_TYPE.STRING,
  color: 'red',
  name: 'some-name',
};

const DATA_STREAM_INFO = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DATA_TYPE.NUMBER,
};

const DATA_STREAM: DataStream = {
  ...DATA_STREAM_INFO,
  data: [],
};

const DATA_STREAM_2: DataStream = {
  id: 'some-asset-id-2---some-property-id-2',
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

it('returns empty array when provided no data streams or asset models', () => {
  expect(completeDataStreams({ dataStreams: [], assetModels: {}, alarms: {} })).toBeEmpty();
});

it('returns the provided data stream when no asset models are given', () => {
  expect(completeDataStreams({ dataStreams: [DATA_STREAM, DATA_STREAM_2], assetModels: {}, alarms: {} })).toEqual([
    DATA_STREAM,
    DATA_STREAM_2,
  ]);
});

it('returns data stream when provided alarm stream but no alarms', () => {
  const assetId = 'asset-id';
  const propertyId = ALARM_STATE_PROPERTY_ID;

  const alarmStreamId = toId({ assetId, propertyId });

  const alarmStream: DataStream = {
    ...DATA_STREAM,
    id: alarmStreamId,
  };

  const assetModels = {
    [assetId]: {
      ...ASSET_MODEL,
      assetModelCompositeModels: ASSET_MODEL_WITH_ALARM.assetModelCompositeModels,
    },
  };

  const alarms = {};

  expect(completeDataStreams({ dataStreams: [alarmStream], assetModels, alarms })).toEqual([
    {
      ...alarmStream,
      name: 'test',
      streamType: 'ALARM',
    },
  ]);
});

it('parses alarm stream and sets streamType to ALARM when corresponding alarm provided', () => {
  const assetId = 'asset-id';
  const propertyId = ALARM_STATE_PROPERTY_ID;

  const alarmStreamId = toId({ assetId, propertyId });

  const alarmStream: DataStream = {
    ...STRING_INFO_1,
    id: alarmStreamId,
    data: [
      {
        x: 1000,
        y: JSON.stringify(ALARM_STATE_JSON_BLOB),
      },
    ],
  };

  const assetModels = {
    [assetId]: {
      ...ASSET_MODEL,
      assetModelCompositeModels: ASSET_MODEL_WITH_ALARM.assetModelCompositeModels,
    },
  };

  const alarms = { [alarmStreamId]: ALARM };

  expect(completeDataStreams({ dataStreams: [alarmStream], assetModels, alarms })).toEqual([
    expect.objectContaining({
      streamType: 'ALARM',
      data: [
        expect.objectContaining({
          y: 'Active',
        }),
      ],
    }),
  ]);
});

it('associates alarms stream with input property stream', () => {
  const assetId = ALARM_ASSET_ID;
  const propertyId = ALARM_STATE_PROPERTY_ID;

  const alarmStreamId = toId({ assetId, propertyId });

  const inputPropertyStreamId = toId({ assetId, propertyId: INPUT_PROPERTY_ID });

  const alarmStream: DataStream = {
    ...STRING_INFO_1,
    id: alarmStreamId,
    data: [
      {
        x: 1000,
        y: JSON.stringify(ALARM_STATE_JSON_BLOB),
      },
    ],
  };

  const inputPropertyStream: DataStream = {
    ...DATA_STREAM,
    id: inputPropertyStreamId,
  };

  const assetModels = {
    [assetId]: {
      ...ASSET_MODEL,
      assetModelCompositeModels: ASSET_MODEL_WITH_ALARM.assetModelCompositeModels,
      assetModelProperties: [
        {
          id: INPUT_PROPERTY_ID,
          name: 'input property',
          dataType: 'INTEGER',
          type: {
            measurement: {},
          },
          unit: 'Celsius',
        },
      ],
    },
  };

  const alarms = { [alarmStreamId]: ALARM };

  expect(completeDataStreams({ dataStreams: [alarmStream, inputPropertyStream], assetModels, alarms })).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: inputPropertyStreamId,
        associatedStreams: [
          expect.objectContaining({
            id: alarmStreamId,
            type: 'ALARM',
          }),
        ],
      }),
    ])
  );
});

it('returns data stream with property name and unit from asset model property', () => {
  const assetId = 'asset-id';
  const propertyId = 'property-id';

  const dataStream: DataStream = {
    ...DATA_STREAM,
    name: undefined,
    unit: undefined,
    dataType: undefined,
    id: toId({ assetId, propertyId }),
  };

  const property: AssetModelProperty = {
    id: propertyId,
    name: 'property-name',
    dataType: 'BOOLEAN',
    unit: 'm/s',
    type: undefined,
  };

  const assetModels = {
    [assetId]: {
      ...ASSET_MODEL,
      assetModelProperties: [property],
    },
  };

  expect(completeDataStreams({ dataStreams: [dataStream], assetModels, alarms: {} })).toEqual([
    expect.objectContaining({
      name: property.name,
      unit: property.unit,
    }),
  ]);
});

describe('parses data type correctly', () => {
  const assetId = 'asset-id';
  const propertyId = 'property-id';

  const dataStream: DataStream = {
    ...DATA_STREAM,
    name: undefined,
    unit: undefined,
    dataType: undefined,
    id: toId({ assetId, propertyId }),
  };

  it('returns a NUMBER dataType when provided a INTEGER property', () => {
    const property: AssetModelProperty = {
      id: propertyId,
      name: 'property-name',
      dataType: 'INTEGER',
      unit: 'm/s',
      type: undefined,
    };

    const assetModels = {
      [assetId]: {
        ...ASSET_MODEL,
        assetModelProperties: [property],
      },
    };

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels, alarms: {} })).toEqual([
      expect.objectContaining({
        dataType: 'NUMBER',
      }),
    ]);
  });

  it('returns a BOOLEAN dataType when provided a BOOLEAN property', () => {
    const property: AssetModelProperty = {
      id: propertyId,
      name: 'property-name',
      dataType: 'BOOLEAN',
      unit: 'm/s',
      type: undefined,
    };

    const assetModels = {
      [assetId]: {
        ...ASSET_MODEL,
        assetModelProperties: [property],
      },
    };

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels, alarms: {} })).toEqual([
      expect.objectContaining({
        dataType: 'BOOLEAN',
      }),
    ]);
  });

  it('returns a STRING dataType when provided a STRING property', () => {
    const property: AssetModelProperty = {
      id: propertyId,
      name: 'property-name',
      dataType: 'STRING',
      unit: 'm/s',
      type: undefined,
    };

    const assetModels = {
      [assetId]: {
        ...ASSET_MODEL,
        assetModelProperties: [property],
      },
    };

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels, alarms: {} })).toEqual([
      expect.objectContaining({
        dataType: 'STRING',
      }),
    ]);
  });

  it('provides a NUMBER dataType when provided an unknown property', () => {
    const property: AssetModelProperty = {
      id: propertyId,
      name: 'property-name',
      dataType: 'something-unknown',
      unit: 'm/s',
      type: undefined,
    };

    const assetModels = {
      [assetId]: {
        ...ASSET_MODEL,
        assetModelProperties: [property],
      },
    };

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels, alarms: {} })).toEqual([
      expect.objectContaining({
        dataType: 'NUMBER',
      }),
    ]);
  });

  it('provides a NUMBER dataType when provided no property dataType', () => {
    const property: AssetModelProperty = {
      id: propertyId,
      name: 'property-name',
      dataType: undefined,
      unit: 'm/s',
      type: undefined,
    };

    const assetModels = {
      [assetId]: {
        ...ASSET_MODEL,
        assetModelProperties: [property],
      },
    };

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels, alarms: {} })).toEqual([
      expect.objectContaining({
        dataType: 'NUMBER',
      }),
    ]);
  });
});
