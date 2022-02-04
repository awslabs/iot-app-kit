import { completeDataStreams } from './completeDataStreams';
import { DATA_STREAM, DATA_STREAM_2 } from './testing/__mocks__/mockWidgetProperties';
import { toDataStreamId } from './iotsitewise/time-series-data/util/dataStreamId';
import { DataStream } from './data-module/types';
import { ASSET_MODEL } from './testing/__mocks__/assetModel';
import { AssetModelProperty } from '@aws-sdk/client-iotsitewise';

it('returns empty array when provided no data streams or asset models', () => {
  expect(completeDataStreams({ dataStreams: [], assetModels: {} })).toBeEmpty();
});

it('returns the provided data stream when no asset models are given', () => {
  expect(completeDataStreams({ dataStreams: [DATA_STREAM, DATA_STREAM_2], assetModels: {} })).toEqual([
    DATA_STREAM,
    DATA_STREAM_2,
  ]);
});

it('returns the provided data stream when no asset model has no matching properties', () => {
  const assetId = 'asset-id';
  const propertyId = 'property-id';

  const dataStream: DataStream = {
    ...DATA_STREAM,
    name: undefined,
    unit: undefined,
    dataType: undefined,
    id: toDataStreamId({ assetId, propertyId }),
  };

  const assetModels = {
    [assetId]: {
      ...ASSET_MODEL,
      assetModelProperties: [],
    },
  };

  expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([dataStream]);
});

it('returns data stream with property name and unit from asset model property', () => {
  const assetId = 'asset-id';
  const propertyId = 'property-id';

  const dataStream: DataStream = {
    ...DATA_STREAM,
    name: undefined,
    unit: undefined,
    dataType: undefined,
    id: toDataStreamId({ assetId, propertyId }),
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

  expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([
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
    id: toDataStreamId({ assetId, propertyId }),
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

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([
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

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([
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

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([
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

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([
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

    expect(completeDataStreams({ dataStreams: [dataStream], assetModels })).toEqual([
      expect.objectContaining({
        dataType: 'NUMBER',
      }),
    ]);
  });
});
