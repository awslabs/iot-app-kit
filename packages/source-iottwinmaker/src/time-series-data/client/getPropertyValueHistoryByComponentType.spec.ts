/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetEntityResponse, GetPropertyValueHistoryCommand, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { RequestInformationAndRange, ErrorDetails } from '@iot-app-kit/core';
import { mockClient } from 'aws-sdk-client-mock';
import flushPromises from 'flush-promises';
import { TwinMakerMetadataModule } from '../../metadata-module/TwinMakerMetadataModule';

import { TwinMakerDataStreamIdComponent } from '../types';
import { toDataStreamId } from '../utils/dataStreamId';
import { getPropertyValueHistoryByComponentType } from './getPropertyValueHistoryByComponentType';

describe('getPropertyValueHistoryByComponentType', () => {
  const streamIdComponents1: TwinMakerDataStreamIdComponent = {
    workspaceId: 'ws-1',
    entityId: 'entity-1',
    componentName: 'comp-1',
    propertyName: 'prop-1',
  };
  const streamIdComponents2: TwinMakerDataStreamIdComponent = {
    workspaceId: 'ws-1',
    entityId: 'entity-2',
    componentName: 'comp-1',
    propertyName: 'prop-1',
  };
  const streamIdComponents3: TwinMakerDataStreamIdComponent = {
    workspaceId: 'ws-1',
    entityId: 'entity-2',
    componentName: 'comp-1',
    propertyName: 'prop-2',
  };
  const mockEntityRef1 = {
    propertyName: streamIdComponents1.propertyName,
    externalIdProperty: {
      extid: 'ext-id-1',
    },
  };
  const mockEntityRef2 = {
    propertyName: streamIdComponents2.propertyName,
    externalIdProperty: {
      extid: 'ext-id-2',
    },
  };
  const mockEntityRef3 = {
    propertyName: streamIdComponents3.propertyName,
    externalIdProperty: {
      extid: 'ext-id-2',
    },
  };
  const mockEntityRef4 = {
    propertyName: streamIdComponents1.propertyName,
    externalIdProperty: {
      extid: 'ext-id-3',
    },
  };
  const start = new Date(2022, 1, 1);
  const end = new Date(2022, 2, 1);

  const mockRequestInfos: RequestInformationAndRange[] = [
    {
      id: toDataStreamId(streamIdComponents1),
      resolution: '0',
      start,
      end,
      meta: { componentTypeId: 'comp-type-1' },
    },
    {
      id: toDataStreamId(streamIdComponents2),
      resolution: '0',
      start,
      end,
      meta: { componentTypeId: 'comp-type-1' },
    },
    {
      id: toDataStreamId(streamIdComponents3),
      resolution: '0',
      start,
      end,
      meta: { componentTypeId: 'comp-type-1' },
    },
  ];
  const tmClient = new IoTTwinMakerClient({});
  const twinMakerMetadataModule = new TwinMakerMetadataModule('workspace-id', tmClient);
  const mockEntities: GetEntityResponse[] = [
    {
      entityId: 'entity-1',
      components: {
        'comp-1': {
          componentTypeId: 'comp-type-1',
          componentName: 'comp-1',
          properties: {
            extid: {
              definition: {
                isExternalId: true,
              },
              value: {
                stringValue: 'ext-id-1',
              },
            },
            'prop-1': {
              definition: {
                isExternalId: false,
              },
            },
          },
        },
      },
    },
    {
      entityId: 'entity-2',
      components: {
        'comp-1': {
          componentTypeId: 'comp-type-1',
          componentName: 'comp-1',
          properties: {
            extid: {
              definition: {
                isExternalId: true,
              },
              value: {
                stringValue: 'ext-id-2',
              },
            },
            'prop-1': {
              definition: {
                isExternalId: false,
              },
            },
            'prop-2': {
              definition: {
                isExternalId: false,
              },
            },
          },
        },
        'comp-2': {
          componentTypeId: 'comp-type-2',
          componentName: 'comp-2',
          properties: {
            extid: {
              definition: {
                isExternalId: true,
              },
              value: {
                stringValue: 'ext-id-3',
              },
            },
            'prop-1': {
              definition: {
                isExternalId: false,
              },
            },
          },
        },
      },
    },
  ] as any as GetEntityResponse[];
  jest.spyOn(twinMakerMetadataModule, 'fetchEntitiesByComponentTypeId').mockResolvedValue(mockEntities);

  let sendSpy = jest.spyOn(tmClient, 'send');
  const onSuccess = jest.fn();
  const onError = jest.fn();

  const mockResponse1 = {
    nextToken: '11223344',
    propertyValues: [
      {
        entityPropertyReference: mockEntityRef1,
        values: [
          {
            value: {
              integerValue: 22,
            },
            time: new Date(2022, 1, 2).toISOString(),
          },
        ],
      },
      {
        entityPropertyReference: mockEntityRef4,
        values: [
          {
            value: {
              integerValue: 44,
            },
            time: new Date(2022, 1, 3).toISOString(),
          },
        ],
      },
    ],
  };
  const mockResponse2 = {
    nextToken: undefined,
    propertyValues: [
      {
        entityPropertyReference: mockEntityRef2,
        values: [
          {
            value: {
              integerValue: 33,
            },
            time: new Date(2022, 1, 3).toISOString(),
          },
        ],
      },
      {
        entityPropertyReference: mockEntityRef1,
        values: [
          {
            value: {
              integerValue: 11,
            },
            time: new Date(2022, 1, 1).toISOString(),
          },
        ],
      },
      {
        entityPropertyReference: mockEntityRef3,
        values: [
          {
            value: {
              integerValue: 44,
            },
            time: new Date(2022, 1, 4).toISOString(),
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sendSpy = jest.spyOn(tmClient, 'send');
  });

  it('should send correct request when fetchMostRecentBeforeStart is true', async () => {
    let command: GetPropertyValueHistoryCommand;
    sendSpy.mockImplementation((cmd) => {
      command = cmd as GetPropertyValueHistoryCommand;
      return Promise.resolve({});
    });
    const expectedStart = new Date(start);
    expectedStart.setDate(expectedStart.getDate() - 1);

    await getPropertyValueHistoryByComponentType({
      metadataModule: twinMakerMetadataModule,
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfos[0], fetchMostRecentBeforeStart: true },
        { ...mockRequestInfos[1], fetchMostRecentBeforeStart: true },
      ],
      client: tmClient,
    });

    expect(command!.input.workspaceId).toEqual(streamIdComponents1.workspaceId);
    expect(command!.input.componentTypeId).toEqual(mockRequestInfos[0].meta?.['componentTypeId']);
    expect(command!.input.selectedProperties?.[0]).toEqual(streamIdComponents1.propertyName);
    expect(command!.input.orderByTime).toEqual('DESCENDING');
    expect(command!.input.startTime).toEqual(expectedStart.toISOString());
    expect(command!.input.endTime).toEqual(start.toISOString());
  });

  it('should send correct request when fetchMostRecentBeforeEnd is true', async () => {
    let command: GetPropertyValueHistoryCommand;
    sendSpy.mockImplementation((cmd) => {
      command = cmd as GetPropertyValueHistoryCommand;
      return Promise.resolve({});
    });
    const expectedStart = new Date(start);
    expectedStart.setDate(expectedStart.getDate() - 1);

    await getPropertyValueHistoryByComponentType({
      metadataModule: twinMakerMetadataModule,
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfos[0], fetchMostRecentBeforeEnd: true },
        { ...mockRequestInfos[1], fetchMostRecentBeforeEnd: true },
      ],
      client: tmClient,
    });

    expect(command!.input.orderByTime).toEqual('DESCENDING');
    expect(command!.input.startTime).toEqual(expectedStart.toISOString());
    expect(command!.input.endTime).toEqual(end.toISOString());
  });

  it('should send correct request when fetchFromStartToEnd is true', async () => {
    let command: GetPropertyValueHistoryCommand;
    sendSpy.mockImplementation((cmd) => {
      command = cmd as GetPropertyValueHistoryCommand;
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByComponentType({
      metadataModule: twinMakerMetadataModule,
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfos[0], fetchFromStartToEnd: true },
        { ...mockRequestInfos[1], fetchFromStartToEnd: true },
      ],
      client: tmClient,
    });

    expect(command!.input.orderByTime).toEqual('ASCENDING');
    expect(command!.input.startTime).toEqual(start.toISOString());
    expect(command!.input.endTime).toEqual(end.toISOString());
  });

  it('should trigger onSuccess with correct dataStream response for fetchFromStartToEnd case', async () => {
    const tmClientMock = mockClient(tmClient);
    tmClientMock.on(GetPropertyValueHistoryCommand).resolvesOnce(mockResponse1).resolvesOnce(mockResponse2);

    await getPropertyValueHistoryByComponentType({
      metadataModule: twinMakerMetadataModule,
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfos[0], fetchFromStartToEnd: true },
        { ...mockRequestInfos[1], fetchFromStartToEnd: true },
        { ...mockRequestInfos[2], fetchFromStartToEnd: true },
      ],
      client: tmClient,
    });

    await flushPromises();

    expect(onSuccess).toBeCalledTimes(4);
    expect(onSuccess).toHaveBeenNthCalledWith(
      1,
      [
        expect.objectContaining({
          id: mockRequestInfos[0].id,
          data: [
            {
              x: new Date(2022, 1, 2).getTime(),
              y: 22,
            },
          ],
          meta: {
            entityId: streamIdComponents1.entityId,
            componentName: streamIdComponents1.componentName,
            propertyName: streamIdComponents1.propertyName,
          },
        }),
      ],
      { ...mockRequestInfos[0], fetchFromStartToEnd: true },
      start,
      end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      2,
      [
        expect.objectContaining({
          id: mockRequestInfos[1].id,
          data: [
            {
              x: new Date(2022, 1, 3).getTime(),
              y: 33,
            },
          ],
          meta: {
            entityId: streamIdComponents2.entityId,
            componentName: streamIdComponents2.componentName,
            propertyName: streamIdComponents2.propertyName,
          },
        }),
      ],
      { ...mockRequestInfos[1], fetchFromStartToEnd: true },
      start,
      end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      3,
      [
        expect.objectContaining({
          id: mockRequestInfos[0].id,
          data: [
            {
              x: new Date(2022, 1, 1).getTime(),
              y: 11,
            },
          ],
          meta: {
            entityId: streamIdComponents1.entityId,
            componentName: streamIdComponents1.componentName,
            propertyName: streamIdComponents1.propertyName,
          },
        }),
      ],
      { ...mockRequestInfos[0], fetchFromStartToEnd: true },
      start,
      end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      4,
      [
        expect.objectContaining({
          id: mockRequestInfos[2].id,
          data: [
            {
              x: new Date(2022, 1, 4).getTime(),
              y: 44,
            },
          ],
          meta: {
            entityId: streamIdComponents3.entityId,
            componentName: streamIdComponents3.componentName,
            propertyName: streamIdComponents3.propertyName,
          },
        }),
      ],
      { ...mockRequestInfos[2], fetchFromStartToEnd: true },
      start,
      end
    );
  });

  it('should trigger onSuccess with correct dataStream response for fetchMostRecentBeforeEnd case', async () => {
    const tmClientMock = mockClient(tmClient);
    tmClientMock.on(GetPropertyValueHistoryCommand).resolvesOnce(mockResponse1).resolvesOnce(mockResponse2);
    const expectedStart = new Date(start);
    expectedStart.setDate(expectedStart.getDate() - 1);

    await getPropertyValueHistoryByComponentType({
      metadataModule: twinMakerMetadataModule,
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfos[0], fetchMostRecentBeforeEnd: true },
        { ...mockRequestInfos[1], fetchMostRecentBeforeEnd: true },
      ],
      client: tmClient,
    });

    await flushPromises();

    expect(onSuccess).toBeCalledTimes(2);
    expect(onSuccess).toHaveBeenNthCalledWith(
      1,
      [
        expect.objectContaining({
          id: mockRequestInfos[0].id,
          data: [
            {
              x: new Date(2022, 1, 2).getTime(),
              y: 22,
            },
          ],
          meta: {
            entityId: streamIdComponents1.entityId,
            componentName: streamIdComponents1.componentName,
            propertyName: streamIdComponents1.propertyName,
          },
        }),
      ],
      { ...mockRequestInfos[0], fetchMostRecentBeforeEnd: true },
      expectedStart,
      end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      2,
      [
        expect.objectContaining({
          id: mockRequestInfos[1].id,
          data: [
            {
              x: new Date(2022, 1, 3).getTime(),
              y: 33,
            },
          ],
          meta: {
            entityId: streamIdComponents2.entityId,
            componentName: streamIdComponents2.componentName,
            propertyName: streamIdComponents2.propertyName,
          },
        }),
      ],
      { ...mockRequestInfos[1], fetchMostRecentBeforeEnd: true },
      expectedStart,
      end
    );
  });

  it('should trigger onError with correct error details', async () => {
    const mockError = {
      name: 'random-error-name',
      message: 'random-error-message',
      $metadata: { httpStatusCode: '401' },
    };
    const mockErrorDetails: ErrorDetails = {
      msg: mockError.message,
      type: mockError.name,
      status: mockError.$metadata.httpStatusCode,
    };
    const tmClientMock = mockClient(tmClient);
    tmClientMock.on(GetPropertyValueHistoryCommand).rejects(mockError);

    await getPropertyValueHistoryByComponentType({
      metadataModule: twinMakerMetadataModule,
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfos[0], fetchFromStartToEnd: true },
        { ...mockRequestInfos[1], fetchFromStartToEnd: true },
      ],
      client: tmClient,
    });

    await flushPromises();

    expect(onError).toBeCalledTimes(2);
    expect(onError).toBeCalledWith(expect.objectContaining({ error: mockErrorDetails }));
  });
});
