import { renderHook, waitFor } from '@testing-library/react';
import { useDescribeAssets } from './useDescribeAssets';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { queryClient } from '../queryClient';

const MOCK_ASSET_ID = 'assetId';
const MOCK_ASSET_ID_2 = 'assetId2';

const describeAssetMock = jest.fn();
const iotSiteWiseClientMock = {
  describeAsset: describeAssetMock,
} as unknown as IoTSiteWise;

describe('useDescribeAssets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    describeAssetMock.mockResolvedValue({});
    queryClient.clear();
  });

  it('should call DescribeAsset in successful queries when calling useDescribeAssets', async () => {
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        assetIds: [MOCK_ASSET_ID],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(describeAssetMock).toBeCalled();
  });

  it('should not call DescribeAsset when no assetIds passed into useDescribeAssets', async () => {
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        assetIds: [],
      })
    );

    await waitFor(() => expect(queriesResult.current.length).toBe(0));

    expect(describeAssetMock).not.toBeCalled();
  });

  it('should disable query when undefined assetId passed into useDescribeAssets', async () => {
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        assetIds: [MOCK_ASSET_ID, undefined, MOCK_ASSET_ID_2],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));
    await waitFor(() => expect(queriesResult.current[1].isPending).toBe(true));
    await waitFor(() => expect(queriesResult.current[2].isSuccess).toBe(true));

    expect(describeAssetMock).toBeCalledTimes(2);
  });
});
