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
  const streamIdComponents: TwinMakerDataStreamIdComponent = {
    workspaceId: 'ws-1',
    entityId: 'entity-1',
    componentName: 'comp-1',
    propertyName: 'prop-1',
  };
  const mockEntityRef: EntityPropertyReference = {
    entityId: streamIdComponents.entityId,
    componentName: streamIdComponents.componentName,
    propertyName: streamIdComponents.propertyName,
  };
  const mockRequestInfo: RequestInformationAndRange = {
    id: toDataStreamId(streamIdComponents),
    resolution: '0',
    start: new Date(2022, 1, 1),
    end: new Date(2022, 2, 1),
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
    let command: GetPropertyValueHistoryCommand;
    sendSpy.mockImplementation((cmd) => {
      command = cmd as GetPropertyValueHistoryCommand;
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [{ ...mockRequestInfo, fetchMostRecentBeforeStart: true }],
      client: tmClient,
    });

    expect(command!.input.workspaceId).toEqual(streamIdComponents.workspaceId);
    expect(command!.input.entityId).toEqual(streamIdComponents.entityId);
    expect(command!.input.componentName).toEqual(streamIdComponents.componentName);
    expect(command!.input.selectedProperties?.[0]).toEqual(streamIdComponents.propertyName);
    expect(command!.input.maxResults).toEqual(1);
    expect(command!.input.orderByTime).toEqual('DESCENDING');
    expect(command!.input.startTime).toEqual(new Date(0, 0, 0).toISOString());
    expect(command!.input.endTime).toEqual(mockRequestInfo.start.toISOString());
  });

  it('should send correct request when fetchMostRecentBeforeEnd is true', async () => {
    let command: GetPropertyValueHistoryCommand;
    sendSpy.mockImplementation((cmd) => {
      command = cmd as GetPropertyValueHistoryCommand;
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [{ ...mockRequestInfo, fetchMostRecentBeforeEnd: true }],
      client: tmClient,
    });

    expect(command!.input.maxResults).toEqual(1);
    expect(command!.input.orderByTime).toEqual('DESCENDING');
    expect(command!.input.startTime).toEqual(new Date(0, 0, 0).toISOString());
    expect(command!.input.endTime).toEqual(mockRequestInfo.end.toISOString());
  });

  it('should send correct request when fetchFromStartToEnd is true', async () => {
    let command: GetPropertyValueHistoryCommand;
    sendSpy.mockImplementation((cmd) => {
      command = cmd as GetPropertyValueHistoryCommand;
      return Promise.resolve({});
    });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [{ ...mockRequestInfo, fetchFromStartToEnd: true }],
      client: tmClient,
    });

    expect(command!.input.maxResults).toEqual(undefined);
    expect(command!.input.orderByTime).toEqual('ASCENDING');
    expect(command!.input.startTime).toEqual(mockRequestInfo.start.toISOString());
    expect(command!.input.endTime).toEqual(mockRequestInfo.end.toISOString());
  });

  it('should trigger onSuccess with correct dataStream response', async () => {
    const tmClientMock = mockClient(tmClient);
    tmClientMock
      .on(GetPropertyValueHistoryCommand)
      .resolvesOnce({
        nextToken: '11223344',
        propertyValues: [
          {
            entityPropertyReference: mockEntityRef,
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
            entityPropertyReference: mockEntityRef,
            values: [
              {
                value: {
                  integerValue: 33,
                },
                time: new Date(2022, 1, 3).toISOString(),
              },
            ],
          },
        ],
      });

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [{ ...mockRequestInfo, fetchFromStartToEnd: true }],
      client: tmClient,
    });

    expect(onSuccess).toBeCalledTimes(2);
    expect(onSuccess).toHaveBeenNthCalledWith(
      1,
      [
        expect.objectContaining({
          id: mockRequestInfo.id,
          data: [
            {
              x: new Date(2022, 1, 2).getTime(),
              y: 22,
            },
          ],
          meta: mockEntityRef,
        }),
      ],
      { ...mockRequestInfo, fetchFromStartToEnd: true },
      mockRequestInfo.start,
      mockRequestInfo.end
    );
    expect(onSuccess).toHaveBeenNthCalledWith(
      2,
      [
        expect.objectContaining({
          id: mockRequestInfo.id,
          data: [
            {
              x: new Date(2022, 1, 3).getTime(),
              y: 33,
            },
          ],
          meta: mockEntityRef,
        }),
      ],
      { ...mockRequestInfo, fetchFromStartToEnd: true },
      mockRequestInfo.start,
      mockRequestInfo.end
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
      requestInformations: [{ ...mockRequestInfo, fetchFromStartToEnd: true }],
      client: tmClient,
    });
    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith(expect.objectContaining({ error: mockErrorDetails }));
  });
});
