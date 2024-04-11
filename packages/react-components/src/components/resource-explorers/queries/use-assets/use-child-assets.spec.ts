import {
  createFakeListAssetsResponse,
  testUseListResourcesHook,
} from '../helpers/testing';
import { useChildAssets } from './use-child-assets';

testUseListResourcesHook({
  resourceName: 'assets',
  hook: useChildAssets,
  renderHookWithEmptyList() {
    const fakeListAssociatedAssets = jest
      .fn()
      .mockResolvedValueOnce({ assetSummaries: [] });

    return {
      resourceHookOptions: {
        query: { assetId: '123' },
        maxResults: 5,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
    };
  },
  renderHookWithSinglePage() {
    const fakeListAssociatedAssetsResponse = createFakeListAssetsResponse();
    const fakeListAssociatedAssets = jest
      .fn()
      .mockResolvedValue(fakeListAssociatedAssetsResponse);

    return {
      resourceHookOptions: {
        query: { assetId: '123' },
        maxResults: 5,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
      expectedResources: fakeListAssociatedAssetsResponse.assetSummaries,
    };
  },
  renderHookWithMultiplePages() {
    const fakeListAssociatedAssetsResponseWithNextToken1 =
      createFakeListAssetsResponse({
        nextToken: 'token-1',
      });
    const fakeListAssociatedAssetsResponseWithNextToken2 =
      createFakeListAssetsResponse({
        nextToken: 'token-2',
      });
    const fakeListAssociatedAssetsResponse = createFakeListAssetsResponse();
    const fakeListAssociatedAssets = jest
      .fn()
      .mockResolvedValue(fakeListAssociatedAssetsResponse)
      .mockResolvedValueOnce(fakeListAssociatedAssetsResponseWithNextToken1)
      .mockResolvedValueOnce(fakeListAssociatedAssetsResponseWithNextToken2);

    return {
      resourceHookOptions: {
        query: { assetId: '123' },
        maxResults: 5,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
      expectedResourcesPage1:
        fakeListAssociatedAssetsResponseWithNextToken1.assetSummaries,
      expectedResourcesPage2:
        fakeListAssociatedAssetsResponseWithNextToken2.assetSummaries,
      expectedResourcesPage3: fakeListAssociatedAssetsResponse.assetSummaries,
    };
  },

  renderHookWithError() {
    const fakeListAssociatedAssets = jest
      .fn()
      .mockRejectedValue(new Error('Error'));

    return {
      resourceHookOptions: {
        query: { assetId: '123' },
        maxResults: 5,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
    };
  },

  renderDisabledRequest() {
    const fakeListAssociatedAssets = jest
      .fn()
      .mockRejectedValue(new Error('Error'));

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssociatedAssets: fakeListAssociatedAssets,
      },
    };
  },
});
