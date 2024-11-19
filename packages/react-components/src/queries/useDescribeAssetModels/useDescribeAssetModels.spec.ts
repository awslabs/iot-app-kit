import { renderHook, waitFor } from '@testing-library/react';
import { useDescribeAssetModels } from './useDescribeAssetModels';
import { queryClient } from '../queryClient';
import {
  MOCK_ASSET_MODEL_ID,
  MOCK_ASSET_MODEL_ID_2,
  describeAssetModelMock,
  iotSiteWiseClientMock,
} from '../../testing/alarms';

describe('useDescribeAssetModels', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should call DescribeAssetModel in successful queries when calling useDescribeAssetModels', async () => {
    describeAssetModelMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [{ assetModelId: MOCK_ASSET_MODEL_ID }],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(describeAssetModelMock).toBeCalled();
  });

  it('should not call DescribeAssetModel when no assetIds passed into useDescribeAssetModels', async () => {
    describeAssetModelMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [],
      })
    );

    await waitFor(() => expect(queriesResult.current.length).toBe(0));

    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should disable query when undefined assetId passed into useDescribeAssetModels', async () => {
    describeAssetModelMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          { assetModelId: MOCK_ASSET_MODEL_ID },
          undefined,
          { assetModelId: MOCK_ASSET_MODEL_ID_2 },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));
    await waitFor(() => {
      expect(queriesResult.current[1].fetchStatus).toBe('idle');
      expect(queriesResult.current[1].isPending).toBe(true);
      expect(queriesResult.current[1].isLoading).toBe(false);
    });
    await waitFor(() => expect(queriesResult.current[2].isSuccess).toBe(true));

    expect(describeAssetModelMock).toBeCalledTimes(2);
  });

  it('should handle DescribeAssetModel failure', async () => {
    describeAssetModelMock.mockRejectedValue(
      new Error('DescribeAssetModel failed')
    );
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [{ assetModelId: MOCK_ASSET_MODEL_ID }],
        retry: false,
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isError).toBe(true));
  });
});
