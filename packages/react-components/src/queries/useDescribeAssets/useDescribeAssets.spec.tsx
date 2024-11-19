import { renderHook, waitFor } from '@testing-library/react';
import { useDescribeAssets } from './useDescribeAssets';
import { queryClient } from '../queryClient';
import {
  MOCK_ASSET_ID,
  MOCK_ASSET_ID_2,
  describeAssetMock,
  iotSiteWiseClientMock,
} from '../../testing/alarms';

describe('useDescribeAssets', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should call DescribeAsset in successful queries when calling useDescribeAssets', async () => {
    describeAssetMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [{ assetId: MOCK_ASSET_ID }],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(describeAssetMock).toBeCalled();
  });

  it('should not call DescribeAsset when no assetIds passed into useDescribeAssets', async () => {
    describeAssetMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [],
      })
    );

    await waitFor(() => expect(queriesResult.current.length).toBe(0));

    expect(describeAssetMock).not.toBeCalled();
  });

  it('should disable query when undefined assetId passed into useDescribeAssets', async () => {
    describeAssetMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          { assetId: MOCK_ASSET_ID },
          undefined,
          { assetId: MOCK_ASSET_ID_2 },
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

    expect(describeAssetMock).toBeCalledTimes(2);
  });

  it('should handle DescribeAsset failure', async () => {
    describeAssetMock.mockRejectedValue(new Error('DescribeAsset failed'));
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [{ assetId: MOCK_ASSET_ID }],
        retry: false,
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isError).toBe(true));
  });
});
