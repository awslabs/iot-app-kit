import {
  type BatchGetAssetPropertyValueErrorEntry,
  type BatchGetAssetPropertyValueRequest,
  type BatchGetAssetPropertyValueResponse,
  type BatchGetAssetPropertyValueSuccessEntry,
} from '@aws-sdk/client-iotsitewise';
import { queryClient } from '../../../queries';
import {
  batchGetAssetPropertyValueMock,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAsset,
  mockTypeAssetPropertyValue,
} from '../../../testing/alarms';
import { renderHook, waitFor } from '@testing-library/react';
import { useAlarmTypes } from './useAlarmTypes';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';

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

describe('useAlarmTypes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('correctly calls onUpdateAlarmTypeData', async () => {
    const onUpdateAlarmTypeData = vi.fn();

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

    renderHook(() =>
      useAlarmTypes({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: mockAlarmDataDescribeAsset.assetId,
            type: mockAlarmDataDescribeAsset.type,
          },
        ],
        onUpdateAlarmTypeData,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmTypeData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: undefined,
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.type.property.id,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdateAlarmTypeData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: {
                propertyValue: mockTypeAssetPropertyValue,
              },
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.type.property.id,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });
  });
});
