import {
  BatchGetAssetPropertyValueErrorEntry,
  BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse,
  BatchGetAssetPropertyValueSuccessEntry,
} from '@aws-sdk/client-iotsitewise';
import { renderHook, waitFor } from '@testing-library/react';
import { queryClient } from '../../../queries';
import {
  batchGetAssetPropertyValueMock,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAsset2,
  mockSourceAssetPropertyValue,
  mockStateAssetPropertyValue,
  mockStateAssetPropertyValue2,
  mockTypeAssetPropertyValue,
} from '../../../testing/alarms';
import type { AlarmDataInternal } from '../types';
import { useLatestAlarmPropertyValues } from './useLatestAlarmPropertyValues';

const mockBatchGetAssetPropertyValue = ({
  errorEntries = [],
  successEntries = [],
}: {
  errorEntries?: BatchGetAssetPropertyValueErrorEntry[];
  successEntries?: BatchGetAssetPropertyValueSuccessEntry[];
}): BatchGetAssetPropertyValueResponse => ({
  errorEntries,
  successEntries,
  skippedEntries: [],
});

describe('useLatestAlarmPropertyValues', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('should return AlarmData with latest state property value for one alarm', async () => {
    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return mockBatchGetAssetPropertyValue({
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: mockStateAssetPropertyValue,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      state: {
        ...mockAlarmDataDescribeAsset.state!,
        data: [mockStateAssetPropertyValue],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarmDataList: [mockAlarmDataDescribeAsset],
        alarmPropertyFieldName: 'state',
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(batchGetAssetPropertyValueMock).toBeCalledTimes(1);
  });

  it('should return AlarmData with latest type property value for one alarm', async () => {
    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return mockBatchGetAssetPropertyValue({
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: mockTypeAssetPropertyValue,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      type: {
        ...mockAlarmDataDescribeAsset.type!,
        data: [mockTypeAssetPropertyValue],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarmDataList: [mockAlarmDataDescribeAsset],
        alarmPropertyFieldName: 'type',
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(batchGetAssetPropertyValueMock).toBeCalledTimes(1);
  });

  it('should return AlarmData with latest source property value for one alarm', async () => {
    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return mockBatchGetAssetPropertyValue({
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: mockSourceAssetPropertyValue,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      source: {
        ...mockAlarmDataDescribeAsset.source!,
        data: [mockSourceAssetPropertyValue],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarmDataList: [mockAlarmDataDescribeAsset],
        alarmPropertyFieldName: 'source',
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(batchGetAssetPropertyValueMock).toBeCalledTimes(1);
  });

  it('should return same AlarmData for external alarm without a source property', async () => {
    const externalAlarmData = {
      ...mockAlarmDataDescribeAsset,
      source: undefined,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarmDataList: [externalAlarmData],
        alarmPropertyFieldName: 'source',
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(externalAlarmData);
    });

    expect(batchGetAssetPropertyValueMock).toBeCalledTimes(0);
  });

  it('should return same AlarmData when alarm field is not an AlarmProperty', async () => {
    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarmDataList: [mockAlarmDataDescribeAsset],
        alarmPropertyFieldName: 'assetId',
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(
        mockAlarmDataDescribeAsset
      );
    });

    expect(batchGetAssetPropertyValueMock).toBeCalledTimes(0);
  });

  it('should return AlarmData with latest state property value for multiple alarms', async () => {
    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return mockBatchGetAssetPropertyValue({
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: mockStateAssetPropertyValue,
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValue: mockStateAssetPropertyValue2,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      state: {
        ...mockAlarmDataDescribeAsset.state!,
        data: [mockStateAssetPropertyValue],
      },
    };

    const expectedAlarmData2 = {
      ...mockAlarmDataDescribeAsset2,
      state: {
        ...mockAlarmDataDescribeAsset2.state!,
        data: [mockStateAssetPropertyValue2],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarmDataList: [
          mockAlarmDataDescribeAsset,
          mockAlarmDataDescribeAsset2,
        ],
        alarmPropertyFieldName: 'state',
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
      expect(alarmDataResults.current[1]).toMatchObject(expectedAlarmData2);
    });

    expect(batchGetAssetPropertyValueMock).toBeCalledTimes(1);
  });
});
