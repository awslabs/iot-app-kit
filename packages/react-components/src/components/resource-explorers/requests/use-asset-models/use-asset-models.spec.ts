import {
  createFakeListAssetModelsResponse,
  testUseListResourcesHook,
} from '../helpers/testing';
import { useAssetModels } from './use-asset-models';

testUseListResourcesHook({
  resourceName: 'assetModels',
  hook: useAssetModels,
  renderHookWithEmptyList() {
    const fakeListAssetModels = jest
      .fn()
      .mockResolvedValue({ assetModelSummaries: [] });

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssetModels: fakeListAssetModels,
      },
    };
  },
  renderHookWithSinglePage() {
    const fakeListAssetModelsResponse = createFakeListAssetModelsResponse();
    const fakeListAssetModels = jest
      .fn()
      .mockResolvedValue(fakeListAssetModelsResponse);

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssetModels: fakeListAssetModels,
      },
      expectedResources: fakeListAssetModelsResponse.assetModelSummaries,
    };
  },
  renderHookWithMultiplePages() {
    const fakeListAssetModelsResponseWithNextToken1 =
      createFakeListAssetModelsResponse({
        nextToken: 'token-1',
      });
    const fakeListAssetModelsResponseWithNextToken2 =
      createFakeListAssetModelsResponse({
        nextToken: 'token-2',
      });
    const fakeListAssetModelsResponse = createFakeListAssetModelsResponse();
    const fakeListAssetModels = jest
      .fn()
      .mockResolvedValue(fakeListAssetModelsResponse)
      .mockResolvedValueOnce(fakeListAssetModelsResponseWithNextToken1)
      .mockResolvedValueOnce(fakeListAssetModelsResponseWithNextToken2);

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssetModels: fakeListAssetModels,
      },
      expectedResourcesPage1:
        fakeListAssetModelsResponseWithNextToken1.assetModelSummaries,
      expectedResourcesPage2:
        fakeListAssetModelsResponseWithNextToken2.assetModelSummaries,
      expectedResourcesPage3: fakeListAssetModelsResponse.assetModelSummaries,
    };
  },

  renderHookWithError() {
    const fakeListAssetModels = jest.fn().mockRejectedValue(new Error());

    return {
      resourceHookOptions: {
        maxResults: 5,
        listAssetModels: fakeListAssetModels,
      },
    };
  },
});
