import { renderHook, waitFor } from '@testing-library/react';
import { useDescribeAssetModels } from './useDescribeAssetModels';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { queryClient } from '../queryClient';

const MOCK_ASSET_MODEL_ID = 'assetModelId';
const MOCK_ASSET_MODEL_ID_2 = 'assetModelId2';

const describeAssetModelMock = jest.fn();
const iotSiteWiseClientMock = {
  describeAssetModel: describeAssetModelMock,
} as unknown as IoTSiteWise;

describe('useDescribeAssetModels', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    describeAssetModelMock.mockResolvedValue({});
    queryClient.clear();
  });

  it('should call DescribeAssetModel in successful queries when calling useDescribeAssetModels', async () => {
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        assetModelIds: [MOCK_ASSET_MODEL_ID],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(describeAssetModelMock).toBeCalled();
  });

  it('should not call DescribeAssetModel when no assetIds passed into useDescribeAssetModels', async () => {
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        assetModelIds: [],
      })
    );

    await waitFor(() => expect(queriesResult.current.length).toBe(0));

    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should disable query when undefined assetId passed into useDescribeAssetModels', async () => {
    const { result: queriesResult } = renderHook(() =>
      useDescribeAssetModels({
        iotSiteWiseClient: iotSiteWiseClientMock,
        assetModelIds: [MOCK_ASSET_MODEL_ID, undefined, MOCK_ASSET_MODEL_ID_2],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));
    await waitFor(() => expect(queriesResult.current[1].isPending).toBe(true));
    await waitFor(() => expect(queriesResult.current[2].isSuccess).toBe(true));

    expect(describeAssetModelMock).toBeCalledTimes(2);
  });
});
