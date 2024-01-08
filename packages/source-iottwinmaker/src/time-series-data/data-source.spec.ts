jest.mock('../metadata-module/TwinMakerMetadataModule', () => {
  const mockEntities = [
    {
      entityId: 'entity-1',
      components: {
        'comp-1': {
          componentTypeId: 'comp-type-1',
          componentName: 'comp-1',
        },
      },
    },
    {
      entityId: 'entity-2',
      components: {
        'comp-1': {
          componentTypeId: 'comp-type-2',
          componentName: 'comp-1',
        },
        'comp-2': {
          componentTypeId: 'comp-type-1',
          componentName: 'comp-2',
        },
      },
    },
  ] as unknown as GetEntityResponse[];

  class MetaDataModule {
    fetchEntitiesByComponentTypeId() {
      return Promise.resolve(mockEntities);
    }
  }

  return {
    _esModule: true,
    TwinMakerMetadataModule: MetaDataModule,
  };
});

import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

import { createDataSource } from './data-source';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { toDataStreamId } from './utils/dataStreamId';
import type { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
import type { TwinMakerDataStreamQuery } from './types';

const tmClient = new IoTTwinMakerClient({});
const twinMakerMetadataModule = new TwinMakerMetadataModule(
  'workspace-id',
  tmClient
);

it('initializes', () => {
  expect(() =>
    createDataSource(twinMakerMetadataModule, tmClient)
  ).not.toThrowError();
});

describe('getRequestsFromQuery', () => {
  it('should create expected request for entity query', async () => {
    const dataSource = createDataSource(twinMakerMetadataModule, tmClient);
    const REF_ID = 'some-ref';

    const query: TwinMakerDataStreamQuery = {
      workspaceId: 'ws-1',
      entityId: 'entity-1',
      componentName: 'comp-1',
      properties: [
        { propertyName: 'prop-1', refId: REF_ID },
        { propertyName: 'prop-2', refId: REF_ID + REF_ID },
      ],
    };

    const request = {
      viewport: {
        duration: '1d',
      },
    };

    const result = await dataSource.getRequestsFromQuery({ query, request });
    expect(result[0]).toEqual(
      expect.objectContaining({ refId: REF_ID, resolution: '0' })
    );
    expect(result[1]).toEqual(
      expect.objectContaining({ refId: REF_ID + REF_ID, resolution: '0' })
    );
  });

  it('should return empty request for random query', async () => {
    const dataSource = createDataSource(twinMakerMetadataModule, tmClient);
    const REF_ID = 'some-ref';

    const query = {
      workspaceId: 'ws-1',
      componentName: 'comp-1',
      properties: [
        { propertyName: 'prop-1', refId: REF_ID },
        { propertyName: 'prop-2', refId: REF_ID + REF_ID },
      ],
    } as TwinMakerDataStreamQuery;

    const request = {
      viewport: {
        duration: '1d',
      },
    };

    const result = await dataSource.getRequestsFromQuery({ query, request });
    expect(result).toEqual([]);
  });

  it('should create expected request for component type query', async () => {
    const dataSource = createDataSource(twinMakerMetadataModule, tmClient);
    const REF_ID = 'some-ref';

    const query: TwinMakerDataStreamQuery = {
      workspaceId: 'ws-1',
      componentTypeId: 'comp-type-1',
      properties: [
        { propertyName: 'prop-1', refId: REF_ID },
        { propertyName: 'prop-2', refId: REF_ID + REF_ID },
      ],
    };

    const request = {
      viewport: {
        duration: '1d',
      },
    };

    const result = await dataSource.getRequestsFromQuery({ query, request });
    expect(result[0]).toEqual(
      expect.objectContaining({
        meta: { componentTypeId: 'comp-type-1' },
        id: toDataStreamId({
          workspaceId: query.workspaceId,
          entityId: 'entity-1',
          componentName: 'comp-1',
          propertyName: 'prop-1',
        }),
        refId: REF_ID,
        resolution: '0',
      })
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        meta: { componentTypeId: 'comp-type-1' },
        id: toDataStreamId({
          workspaceId: query.workspaceId,
          entityId: 'entity-1',
          componentName: 'comp-1',
          propertyName: 'prop-2',
        }),
        refId: REF_ID + REF_ID,
        resolution: '0',
      })
    );
    expect(result[2]).toEqual(
      expect.objectContaining({
        meta: { componentTypeId: 'comp-type-1' },
        id: toDataStreamId({
          workspaceId: query.workspaceId,
          entityId: 'entity-2',
          componentName: 'comp-2',
          propertyName: 'prop-1',
        }),
        refId: REF_ID,
        resolution: '0',
      })
    );
    expect(result[3]).toEqual(
      expect.objectContaining({
        meta: { componentTypeId: 'comp-type-1' },
        id: toDataStreamId({
          workspaceId: query.workspaceId,
          entityId: 'entity-2',
          componentName: 'comp-2',
          propertyName: 'prop-2',
        }),
        refId: REF_ID + REF_ID,
        resolution: '0',
      })
    );
  });
});
