/* eslint-disable @typescript-eslint/no-explicit-any */
import { MINUTE_IN_MS, RequestInformationAndRange, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { GetEntityResponse, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

import * as byEntity from './client/getPropertyValueHistoryByEntity';
import * as byComponentType from './client/getPropertyValueHistoryByComponentType';
import { createDataSource } from './data-source';
import { TwinMakerDataStreamQuery } from './types';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { toDataStreamId } from './utils/dataStreamId';

const tmClient = new IoTTwinMakerClient({});
const twinMakerMetadataModule = new TwinMakerMetadataModule('workspace-id', tmClient);

it('initializes', () => {
  expect(() => createDataSource(twinMakerMetadataModule, tmClient)).not.toThrowError();
});
const noop = () => {};

const LAST_MINUTE_REQUEST: TimeSeriesDataRequest = {
  viewport: {
    duration: MINUTE_IN_MS,
  },
  settings: {
    fetchMostRecentBeforeEnd: true,
  },
};

describe('initiateRequest', () => {
  it('does call getPropertyValueHistoryByEntity and getPropertyValueHistoryByComponentType with expected request info', () => {
    const entityQuerySpy = jest
      .spyOn(byEntity, 'getPropertyValueHistoryByEntity')
      .mockImplementation(() => Promise.resolve());
    const componentTypeQuerySpy = jest
      .spyOn(byComponentType, 'getPropertyValueHistoryByComponentType')
      .mockImplementation(() => Promise.resolve());
    const dataSource = createDataSource(twinMakerMetadataModule, tmClient);
    const query = {
      workspaceId: 'ws-1',
      entityId: 'entity-1',
      componentName: 'comp-1',
      properties: [{ propertyName: 'prop-1' }],
    };
    const reqInfoEntity: RequestInformationAndRange = {
      id: toDataStreamId({
        workspaceId: query.workspaceId,
        entityId: query.entityId,
        componentName: query.componentName,
        propertyName: query.properties[0].propertyName,
      }),
      start: new Date(2022, 1, 1),
      end: new Date(2022, 1, 2),
      resolution: '0',
    };
    const reqInfoComp: RequestInformationAndRange = {
      ...reqInfoEntity,
      meta: { componentTypeId: 'comp-type-1' },
    };

    dataSource.initiateRequest(
      {
        onError: noop,
        onSuccess: noop,
        query,
        request: LAST_MINUTE_REQUEST,
      },
      [reqInfoEntity, reqInfoComp]
    );

    expect(entityQuerySpy).toBeCalledTimes(1);
    expect(entityQuerySpy).toBeCalledWith({
      onError: noop,
      onSuccess: noop,
      client: tmClient,
      requestInformations: [reqInfoEntity],
    });

    expect(componentTypeQuerySpy).toBeCalledTimes(1);
    expect(componentTypeQuerySpy).toBeCalledWith({
      metadataModule: twinMakerMetadataModule,
      onError: noop,
      onSuccess: noop,
      client: tmClient,
      requestInformations: [reqInfoComp],
    });
  });
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
    expect(result[0]).toEqual(expect.objectContaining({ refId: REF_ID, resolution: '0' }));
    expect(result[1]).toEqual(expect.objectContaining({ refId: REF_ID + REF_ID, resolution: '0' }));
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
    ] as any as GetEntityResponse[];
    jest.spyOn(twinMakerMetadataModule, 'fetchEntitiesByComponentTypeId').mockResolvedValue(mockEntities);

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
