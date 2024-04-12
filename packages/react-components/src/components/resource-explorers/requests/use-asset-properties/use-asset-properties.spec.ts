import {
  AssetProperty,
  AssetPropertySummary,
  AssetModelPropertySummary,
} from '@aws-sdk/client-iotsitewise';
import {
  testUseListResourcesHook,
  createFakeAssetPropertySummary,
  createFakeAssetModelPropertySummary,
} from '../helpers/testing';
import { useAssetProperties } from './use-asset-properties';

function createExpectedResources(
  assetPropertySummaries: AssetPropertySummary[],
  assetModelPropertySummaries: AssetModelPropertySummary[]
): AssetProperty[] {
  const matchingAssetModelPropertySummaries = assetPropertySummaries.map(
    ({ id: assetPropertyId }) => {
      return assetModelPropertySummaries.find(
        ({ id: assetModelPropertyId }) =>
          assetModelPropertyId === assetPropertyId
      );
    }
  ) as AssetModelPropertySummary[];

  return assetPropertySummaries.map((assetPropertySummary, index) => ({
    ...assetPropertySummary,
    ...matchingAssetModelPropertySummaries.map(
      ({ type: _type, ...rest }) => rest
    )[index],
  }));
}

testUseListResourcesHook({
  resourceName: 'assetProperties',
  hook: useAssetProperties,
  renderHookWithEmptyList() {
    const fakeListAssetProperties = jest
      .fn()
      .mockResolvedValueOnce({ assetPropertySummaries: [] });
    const fakeListAssetModelProperties = jest
      .fn()
      .mockResolvedValueOnce({ assetModelPropertySummaries: [] });

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123', assetModelId: '456' }],
        maxResults: 5,
        listAssetProperties: fakeListAssetProperties,
        listAssetModelProperties: fakeListAssetModelProperties,
      },
    };
  },
  renderHookWithSinglePage() {
    const assetPropertySummaries = [
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
    ];
    const fakeListAssetPropertiesResponse = {
      assetPropertySummaries,
    };
    const fakeListAssetProperties = jest
      .fn()
      .mockResolvedValue(fakeListAssetPropertiesResponse);

    const assetModelPropertySummaries = assetPropertySummaries.map(({ id }) =>
      createFakeAssetModelPropertySummary(id)
    );
    const fakeListAssetModelPropertiesResponse = {
      assetModelPropertySummaries,
    };
    const fakeListAssetModelProperties = jest
      .fn()
      .mockResolvedValue(fakeListAssetModelPropertiesResponse);

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123', assetModelId: '456' }],
        maxResults: 5,
        listAssetProperties: fakeListAssetProperties,
        listAssetModelProperties: fakeListAssetModelProperties,
      },
      expectedResources: createExpectedResources(
        assetPropertySummaries,
        assetModelPropertySummaries
      ),
    };
  },
  renderHookWithMultiplePages() {
    const page1AssetPropertySummaries = [
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
    ];
    const page2AssetPropertySummaries = [
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
    ];
    const page3AssetPropertySummaries = [
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
    ];
    const page4AssetPropertySummaries = [
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
      createFakeAssetPropertySummary(),
    ];
    const assetModelPropertySummariesResponse1 =
      page1AssetPropertySummaries.map(({ id }) =>
        createFakeAssetModelPropertySummary(id)
      );
    const assetModelPropertySummariesResponse2 = [
      ...page2AssetPropertySummaries,
      ...page3AssetPropertySummaries,
      ...page4AssetPropertySummaries,
    ].map(({ id }) => createFakeAssetModelPropertySummary(id));

    const page1 = {
      assetPropertySummaries: page1AssetPropertySummaries,
    };
    const page2 = {
      assetPropertySummaries: page2AssetPropertySummaries,
      nextToken: 'token-1',
    };
    const page3 = {
      assetPropertySummaries: page3AssetPropertySummaries,
      nextToken: 'token-2',
    };
    const page4 = {
      assetPropertySummaries: page4AssetPropertySummaries,
    };
    const fakeListAssetProperties = jest
      .fn()
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2)
      .mockResolvedValueOnce(page3)
      .mockResolvedValue(page4);
    const fakeListAssetModelProperties = jest
      .fn()
      .mockResolvedValueOnce({
        assetModelPropertySummaries: assetModelPropertySummariesResponse1,
      })
      .mockResolvedValueOnce({
        assetModelPropertySummaries: assetModelPropertySummariesResponse2,
      });

    const expectedResourcesPage1 = [
      ...createExpectedResources(
        page1AssetPropertySummaries,
        assetModelPropertySummariesResponse1
      ),
      ...createExpectedResources(
        page2AssetPropertySummaries,
        assetModelPropertySummariesResponse2
      ),
    ];
    const expectedResourcesPage2 = createExpectedResources(
      page3AssetPropertySummaries,
      assetModelPropertySummariesResponse2
    );
    const expectedResourcesPage3 = createExpectedResources(
      page4AssetPropertySummaries,
      assetModelPropertySummariesResponse2
    );

    return {
      resourceHookOptions: {
        queries: [
          { assetId: '123', assetModelId: '456' },
          { assetId: 'abc', assetModelId: 'xyz' },
        ],
        maxResults: 5,
        listAssetProperties: fakeListAssetProperties,
        listAssetModelProperties: fakeListAssetModelProperties,
      },
      expectedResourcesPage1: expectedResourcesPage1,
      expectedResourcesPage2: expectedResourcesPage2,
      expectedResourcesPage3: expectedResourcesPage3,
    };
  },

  renderHookWithError() {
    const fakeListAssetProperties = jest
      .fn()
      .mockRejectedValue(new Error('Error'));
    const fakeListAssetModelProperties = jest
      .fn()
      .mockRejectedValue(new Error('Error'));

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123', assetModelId: '456' }],
        maxResults: 5,
        listAssetProperties: fakeListAssetProperties,
        listAssetModelProperties: fakeListAssetModelProperties,
      },
    };
  },
});
