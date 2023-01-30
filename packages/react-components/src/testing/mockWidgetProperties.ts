import { DataStream } from '@iot-app-kit/core';
import { toDataStreamId } from './dataStreamId';

export const DATA_STREAM: DataStream<number> = {
  id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: 'NUMBER',
  data: [],
};

export const DATA_STREAM_2: DataStream<number> = {
  id: toDataStreamId({ assetId: 'some-asset-id-2', propertyId: 'some-property-id-2' }),
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: 'NUMBER',
  data: [],
};
