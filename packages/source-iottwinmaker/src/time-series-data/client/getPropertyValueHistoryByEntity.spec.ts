import {
  EntityPropertyReference,
  GetPropertyValueHistoryCommand,
  IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';
import { RequestInformationAndRange, ErrorDetails } from '@iot-app-kit/core';
import { mockClient } from 'aws-sdk-client-mock';

import { TwinMakerDataStreamIdComponent } from '../types';
import { toDataStreamId } from '../utils/dataStreamId';
import { getPropertyValueHistoryByEntity } from './getPropertyValueHistoryByEntity';

describe('getPropertyValueHistoryByEntity', () => {
  const start = new Date(2022, 1, 1);
  const end = new Date(2022, 2, 1);
  const streamIdComponents1: TwinMakerDataStreamIdComponent = {
    workspaceId: 'ws-1',
    entityId: 'entity-1',
    componentName: 'comp-1',
    propertyName: 'prop-1',
  };
  const streamIdComponents2: TwinMakerDataStreamIdComponent = {
    workspaceId: 'ws-1',
    entityId: 'entity-1',
    componentName: 'comp-1',
    propertyName: 'prop-2',
  };
  const mockEntityRef1: EntityPropertyReference = {
    entityId: streamIdComponents1.entityId,
    componentName: streamIdComponents1.componentName,
    propertyName: streamIdComponents1.propertyName,
  };
  const mockEntityRef2: EntityPropertyReference = {
    entityId: streamIdComponents2.entityId,
    componentName: streamIdComponents2.componentName,
    propertyName: streamIdComponents2.propertyName,
  };
  const mockRequestInfo1: RequestInformationAndRange = {
    id: toDataStreamId(streamIdComponents1),
    resolution: '0',
    start,
    end,
  };
  const mockRequestInfo2: RequestInformationAndRange = {
    id: toDataStreamId(streamIdComponents2),
    resolution: '0',
    start,
    end,
  };
  const tmClient = new IoTTwinMakerClient({});
  let sendSpy = jest.spyOn(tmClient, 'send');
  const onSuccess = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    sendSpy = jest.spyOn(tmClient, 'send');
  });

  it('should send correct request when fetchMostRecentBeforeStart is true', async () => {
    const commands: GetPropertyValueHistoryCommand[] = [];
    sendSpy.mockImplementation((cmd) => {
      commands.push(cmd as GetPropertyValueHistoryCommand);
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfo1, fetchMostRecentBeforeStart: true },
        { ...mockRequestInfo2, fetchMostRecentBeforeStart: true },
      ],
      client: tmClient,
    });

    // First request
    expect(commands[0].input.workspaceId).toEqual(streamIdComponents1.workspaceId);
    expect(commands[0].input.entityId).toEqual(streamIdComponents1.entityId);
    expect(commands[0].input.componentName).toEqual(streamIdComponents1.componentName);
    expect(commands[0].input.selectedProperties).toEqual([streamIdComponents1.propertyName]);
    expect(commands[0].input.maxResults).toEqual(1);
    expect(commands[0].input.orderByTime).toEqual('DESCENDING');
    expect(commands[0].input.startTime).toEqual(new Date(0, 0, 0).toISOString());
    expect(commands[0].input.endTime).toEqual(start.toISOString());
    // Second request
    expect(commands[1].input.workspaceId).toEqual(streamIdComponents2.workspaceId);
    expect(commands[1].input.entityId).toEqual(streamIdComponents2.entityId);
    expect(commands[1].input.componentName).toEqual(streamIdComponents2.componentName);
    expect(commands[1].input.selectedProperties).toEqual([streamIdComponents2.propertyName]);
  });

  it('should send correct request when fetchMostRecentBeforeEnd is true', async () => {
    const commands: GetPropertyValueHistoryCommand[] = [];
    sendSpy.mockImplementation((cmd) => {
      commands.push(cmd as GetPropertyValueHistoryCommand);
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfo1, fetchMostRecentBeforeEnd: true },
        { ...mockRequestInfo2, fetchMostRecentBeforeEnd: true },
      ],
      client: tmClient,
    });

    // Fist request
    expect(commands[0].input.maxResults).toEqual(1);
    expect(commands[0].input.orderByTime).toEqual('DESCENDING');
    expect(commands[0].input.startTime).toEqual(new Date(0, 0, 0).toISOString());
    expect(commands[0].input.endTime).toEqual(end.toISOString());
    // Second request
    expect(commands[1].input.workspaceId).toEqual(streamIdComponents2.workspaceId);
    expect(commands[1].input.entityId).toEqual(streamIdComponents2.entityId);
    expect(commands[1].input.componentName).toEqual(streamIdComponents2.componentName);
    expect(commands[1].input.selectedProperties).toEqual([streamIdComponents2.propertyName]);
  });

  it('should send correct request when fetchFromStartToEnd is true', async () => {
    const commands: GetPropertyValueHistoryCommand[] = [];
    sendSpy.mockImplementation((cmd) => {
      commands.push(cmd as GetPropertyValueHistoryCommand);
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfo1, fetchFromStartToEnd: true },
        { ...mockRequestInfo2, fetchFromStartToEnd: true },
      ],
      client: tmClient,
    });

    // Should combine into the same request
    expect(commands.length).toEqual(1);
    expect(commands[0].input.workspaceId).toEqual(streamIdComponents1.workspaceId);
    expect(commands[0].input.entityId).toEqual(streamIdComponents1.entityId);
    expect(commands[0].input.componentName).toEqual(streamIdComponents1.componentName);
    expect(commands[0].input.selectedProperties).toEqual([
      streamIdComponents1.propertyName,
      streamIdComponents2.propertyName,
    ]);
    expect(commands[0].input.maxResults).toEqual(undefined);
    expect(commands[0].input.orderByTime).toEqual('ASCENDING');
    expect(commands[0].input.startTime).toEqual(start.toISOString());
    expect(commands[0].input.endTime).toEqual(end.toISOString());
  });

  it('should trigger onSuccess with correct dataStream response', async () => {
    const tmClientMock = mockClient(tmClient);
    tmClientMock
      .on(GetPropertyValueHistoryCommand)
      .resolvesOnce({
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
        ],
      })
      .resolvesOnce({
        nextToken: undefined,
        propertyValues: [
          {
            entityPropertyReference: mockEntityRef1,
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
            entityPropertyReference: mockEntityRef2,
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
      });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [
        { ...mockRequestInfo1, fetchFromStartToEnd: true },
        { ...mockRequestInfo2, fetchFromStartToEnd: true },
      ],
      client: tmClient,
    });

    expect(onSuccess).toBeCalledTimes(3);
    expect(onSuccess).toHaveBeenNthCalledWith(
      1,
      [
        expect.objectContaining({
          id: mockRequestInfo1.id,
          data: [
            {
              x: new Date(2022, 1, 2).getTime(),
              y: 22,
            },
          ],
          meta: mockEntityRef1,
        }),
      ],
      { ...mockRequestInfo1, fetchFromStartToEnd: true },
      start,
      end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      2,
      [
        expect.objectContaining({
          id: mockRequestInfo1.id,
          data: [
            {
              x: new Date(2022, 1, 3).getTime(),
              y: 33,
            },
          ],
          meta: mockEntityRef1,
        }),
      ],
      { ...mockRequestInfo1, fetchFromStartToEnd: true },
      start,
      end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      3,
      [
        expect.objectContaining({
          id: mockRequestInfo2.id,
          data: [
            {
              x: new Date(2022, 1, 4).getTime(),
              y: 44,
            },
          ],
          meta: mockEntityRef2,
        }),
      ],
      { ...mockRequestInfo2, fetchFromStartToEnd: true },
      start,
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

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [{ ...mockRequestInfo1, fetchFromStartToEnd: true }],
      client: tmClient,
    });
    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith(expect.objectContaining({ error: mockErrorDetails }));
  });
});
