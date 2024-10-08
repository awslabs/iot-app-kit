import {
  BatchGetAssetPropertyValueErrorEntry,
  BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse,
  BatchGetAssetPropertyValueSuccessEntry,
} from '@aws-sdk/client-iotsitewise';
import { queryClient } from '../../../queries';
import {
  batchGetAssetPropertyValueMock,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAsset,
  mockSourceAssetPropertyValue,
} from '../../../testing/alarms';
import { renderHook, waitFor } from '@testing-library/react';
import { useAlarmSources } from './useAlarmSources';
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

describe('useAlarmSources', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });
  it('correctly calls onUpdateAlarmSourceData', async () => {
    const onUpdateAlarmSourceData = jest.fn();

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

    renderHook(() =>
      useAlarmSources({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: mockAlarmDataDescribeAsset.assetId,
            source: mockAlarmDataDescribeAsset.source,
          },
        ],
        onUpdateAlarmSourceData,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmSourceData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: undefined,
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.source.property.id,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdateAlarmSourceData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: {
                propertyValue: mockSourceAssetPropertyValue,
              },
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.source.property.id,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });
  });
});
