import {
  createFakeListAssetsResponse,
  testUseListResourcesHook,
} from '../helpers/testing';
import { useRootAssets } from './use-root-assets';

testUseListResourcesHook({
  resourceName: 'assets',
  hook: useRootAssets,
  renderHookWithEmptyList() {
    const fakeListAssets = jest
      .fn()
      .mockResolvedValueOnce({ assetSummaries: [] });

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
      },
    };
  },
  renderHookWithSinglePage() {
    const fakeListAssetsResponse = createFakeListAssetsResponse();
    const fakeListAssets = jest.fn().mockResolvedValue(fakeListAssetsResponse);

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
      },
      expectedResources: fakeListAssetsResponse.assetSummaries,
    };
  },
  renderHookWithMultiplePages() {
    const fakeListAssetsResponseWithNextToken1 = createFakeListAssetsResponse({
      nextToken: 'token-1',
    });
    const fakeListAssetsResponseWithNextToken2 = createFakeListAssetsResponse({
      nextToken: 'token-2',
    });
    const fakeListAssetsResponse = createFakeListAssetsResponse();
    const fakeListAssets = jest
      .fn()
      .mockResolvedValue(fakeListAssetsResponse)
      .mockResolvedValueOnce(fakeListAssetsResponseWithNextToken1)
      .mockResolvedValueOnce(fakeListAssetsResponseWithNextToken2);

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
      },
      expectedResourcesPage1:
        fakeListAssetsResponseWithNextToken1.assetSummaries,
      expectedResourcesPage2:
        fakeListAssetsResponseWithNextToken2.assetSummaries,
      expectedResourcesPage3: fakeListAssetsResponse.assetSummaries,
    };
  },

  renderHookWithError() {
    const fakeListAssets = jest
      .fn()
      .mockRejectedValue(new Error('errrrrorrrr'));

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
      },
    };
  },
});
