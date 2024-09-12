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
  mockDefaultAlarmSource,
  mockDefaultAlarmState,
  mockDefaultAlarmType,
  mockStringAssetPropertyValue,
} from '../../../testing/alarms';
import { AlarmData } from '../types';
import { useLatestAlarmPropertyValue } from './useLatestAlarmPropertyValue';

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

const expectedStateAssetProperty = mockStringAssetPropertyValue(
  mockDefaultAlarmState
);
const expectedTypeAssetProperty =
  mockStringAssetPropertyValue(mockDefaultAlarmType);
const expectedSourceAssetProperty = mockStringAssetPropertyValue(
  mockDefaultAlarmSource
);

describe('useLatestAlarmPropertyValue', () => {
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
              assetPropertyValue: expectedStateAssetProperty,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      state: {
        ...mockAlarmDataDescribeAsset.state!,
        data: [expectedStateAssetProperty],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValue({
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
              assetPropertyValue: expectedTypeAssetProperty,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      type: {
        ...mockAlarmDataDescribeAsset.type!,
        data: [expectedTypeAssetProperty],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValue({
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
              assetPropertyValue: expectedSourceAssetProperty,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      source: {
        ...mockAlarmDataDescribeAsset.source!,
        data: [expectedSourceAssetProperty],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValue({
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
    const externalAlarmData: AlarmData = {
      ...mockAlarmDataDescribeAsset,
      source: undefined,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValue({
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
      useLatestAlarmPropertyValue({
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
    const expectedStateAssetProperty2 = mockStringAssetPropertyValue('ACTIVE');

    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return mockBatchGetAssetPropertyValue({
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: expectedStateAssetProperty,
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValue: expectedStateAssetProperty2,
            },
          ],
        });
      }
    );

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      state: {
        ...mockAlarmDataDescribeAsset.state!,
        data: [expectedStateAssetProperty],
      },
    };

    const expectedAlarmData2 = {
      ...mockAlarmDataDescribeAsset2,
      state: {
        ...mockAlarmDataDescribeAsset2.state!,
        data: [expectedStateAssetProperty2],
      },
    };

    const { result: alarmDataResults } = renderHook(() =>
      useLatestAlarmPropertyValue({
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

  it('should overwrite the status of AlarmData when queries fail', async () => {});
});
