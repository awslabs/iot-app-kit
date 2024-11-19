import { type EntityPropertyReference } from '@aws-sdk/client-iottwinmaker';
import {
  type RequestInformationAndRange,
  type ErrorDetails,
} from '@iot-app-kit/core';
import { createMockTwinMakerSDK } from '../../__mocks__/iottwinmakerSDK';

import { type TwinMakerDataStreamIdComponent } from '../types';
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
  const getPropertyValueHistory = vi.fn();
  const tmClient = createMockTwinMakerSDK({
    getPropertyValueHistory,
  });
  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send correct request when fetchMostRecentBeforeStart is true', async () => {
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
    expect(getPropertyValueHistory).toBeCalledWith({
      workspaceId: streamIdComponents1.workspaceId,
      entityId: streamIdComponents1.entityId,
      componentName: streamIdComponents1.componentName,
      selectedProperties: [streamIdComponents1.propertyName],
      maxResults: 1,
      orderByTime: 'DESCENDING',
      startTime: new Date(0, 0, 0).toISOString(),
      endTime: start.toISOString(),
    });
    // Second request
    expect(getPropertyValueHistory).toBeCalledWith({
      workspaceId: streamIdComponents2.workspaceId,
      entityId: streamIdComponents2.entityId,
      componentName: streamIdComponents2.componentName,
      selectedProperties: [streamIdComponents2.propertyName],
      maxResults: 1,
      orderByTime: 'DESCENDING',
      startTime: new Date(0, 0, 0).toISOString(),
      endTime: start.toISOString(),
    });
  });

  it('should send correct request when fetchMostRecentBeforeEnd is true', async () => {
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
    expect(getPropertyValueHistory).toBeCalledWith({
      workspaceId: streamIdComponents1.workspaceId,
      entityId: streamIdComponents1.entityId,
      componentName: streamIdComponents1.componentName,
      selectedProperties: [streamIdComponents1.propertyName],
      maxResults: 1,
      orderByTime: 'DESCENDING',
      startTime: new Date(0, 0, 0).toISOString(),
      endTime: end.toISOString(),
    });
    // Second request
    expect(getPropertyValueHistory).toBeCalledWith({
      workspaceId: streamIdComponents2.workspaceId,
      entityId: streamIdComponents2.entityId,
      componentName: streamIdComponents2.componentName,
      selectedProperties: [streamIdComponents2.propertyName],
      maxResults: 1,
      orderByTime: 'DESCENDING',
      startTime: new Date(0, 0, 0).toISOString(),
      endTime: end.toISOString(),
    });
  });

  it('should send correct request when fetchFromStartToEnd is true', async () => {
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
    expect(getPropertyValueHistory).toBeCalledTimes(1);
    expect(getPropertyValueHistory).toBeCalledWith({
      workspaceId: streamIdComponents1.workspaceId,
      entityId: streamIdComponents1.entityId,
      componentName: streamIdComponents1.componentName,
      selectedProperties: [
        streamIdComponents1.propertyName,
        streamIdComponents2.propertyName,
      ],
      orderByTime: 'ASCENDING',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
  });

  it('should trigger onSuccess with correct dataStream response', async () => {
    getPropertyValueHistory
      .mockResolvedValueOnce({
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
      .mockResolvedValueOnce({
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
          isRefreshing: true,
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
          isRefreshing: false,
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
    getPropertyValueHistory.mockRejectedValue(mockError);

    await getPropertyValueHistoryByEntity({
      onSuccess,
      onError,
      requestInformations: [{ ...mockRequestInfo1, fetchFromStartToEnd: true }],
      client: tmClient,
    });
    expect(onError).toBeCalledTimes(1);
    expect(onError).toBeCalledWith(
      expect.objectContaining({ error: mockErrorDetails })
    );
  });
});
