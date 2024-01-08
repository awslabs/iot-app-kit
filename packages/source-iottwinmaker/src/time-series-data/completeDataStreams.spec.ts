import { completeDataStreams } from './completeDataStreams';
import { toDataStreamId } from './utils/dataStreamId';
import type { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
import type { DataStream } from '@iot-app-kit/core';

describe('completeDataStreams', () => {
  const stream: DataStream = {
    id: toDataStreamId({
      entityId: 'entity-1',
      componentName: 'comp-1',
      propertyName: 'prop-1',
      workspaceId: 'ws-1',
    }),
    name: 'random',
    data: [],
    resolution: 0,
    meta: { random: 'random' },
  };

  it('should not change dataStream when dataType is not defined', () => {
    expect(
      completeDataStreams({ dataStreams: [stream], entities: {} })
    ).toEqual([stream]);
  });

  it('should add extra value to dataStream when dataType is defined', () => {
    const entity = {
      components: {
        'comp-1': {
          properties: {
            'prop-1': {
              definition: { dataType: { unitOfMeasure: 'm', type: 'INTEGER' } },
            },
          },
        },
      },
    } as unknown as GetEntityResponse;
    expect(
      completeDataStreams({
        dataStreams: [stream],
        entities: {
          'entity-1': entity,
        },
      })
    ).toEqual([{ ...stream, name: 'prop-1', unit: 'm', dataType: 'NUMBER' }]);
  });
});
