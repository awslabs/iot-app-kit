import {
  createFakeListAssetsResponse,
  testUseListResourcesHook,
} from '../helpers/testing';
import { useAssets } from './use-assets';

testUseListResourcesHook({
  resourceName: 'assets',
  hook: useAssets,
  renderHookWithEmptyList() {
    const fakeListAssets = jest.fn().mockResolvedValue({ assetSummaries: [] });
    const fakeListAssociatedAssets = jest
      .fn()
      .mockResolvedValue({ assetSummaries: [] });

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
    };
  },
  renderHookWithSinglePage() {
    const fakeListAssetsResponse = createFakeListAssetsResponse();
    const fakeListAssets = jest.fn().mockResolvedValue(fakeListAssetsResponse);
    const fakeListAssociatedAssets = jest
      .fn()
      .mockResolvedValue({ assetSummaries: [] });

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
        listAssociatedAssets: fakeListAssociatedAssets,
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
    const fakeListAssociatedAssets = jest
      .fn()
      .mockResolvedValue({ assetSummaries: [] });

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
      expectedResourcesPage1:
        fakeListAssetsResponseWithNextToken1.assetSummaries,
      expectedResourcesPage2:
        fakeListAssetsResponseWithNextToken2.assetSummaries,
      expectedResourcesPage3: fakeListAssetsResponse.assetSummaries,
    };
  },

  renderHookWithError() {
    const fakeListAssets = jest.fn().mockRejectedValue(new Error('Error'));
    const fakeListAssociatedAssets = jest
      .fn()
      .mockRejectedValue(new Error('Error'));

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssets: fakeListAssets,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
    };
  },
});
