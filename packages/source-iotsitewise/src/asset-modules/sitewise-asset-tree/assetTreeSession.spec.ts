import { SiteWiseAssetTreeSession } from './assetTreeSession';
import { BranchReference } from './types';
import { HIERARCHY_ROOT_ID, LoadingStateEnum } from '../sitewise/types';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import {
  MockSiteWiseAssetSession,
  MockSiteWiseAssetsReplayData,
} from '../mocks';
import { sampleAssetModel } from '../../__mocks__/assetModel';
import { sampleAssetSummary } from '../../__mocks__/asset';
import type { HierarchyAssetSummaryList } from '../sitewise/types';
import type {
  AssetSummary,
  AssetPropertyValue,
  DescribeAssetModelResponse,
  AssetModelProperty,
} from '@aws-sdk/client-iotsitewise';

it('initializes', () => {
  const replayData = new MockSiteWiseAssetsReplayData();
  const testData: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [sampleAssetSummary],
    loadingState: LoadingStateEnum.LOADED,
  };
  replayData.addHierarchyAssetSummaryList(
    { assetHierarchyId: HIERARCHY_ROOT_ID },
    testData
  );
  replayData.addAssetSummaries([sampleAssetSummary]);
  expect(
    () =>
      new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {})
  ).not.toThrowError();
});

describe('root loading functionality', () => {
  const replayData = new MockSiteWiseAssetsReplayData();
  const rootAsset: AssetSummary = { ...sampleAssetSummary };
  rootAsset.hierarchies = [{ id: 'bananas1234', name: 'bananas' }];

  const rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList(
    { assetHierarchyId: HIERARCHY_ROOT_ID },
    rootHierarchy
  );
  replayData.addAssetSummaries([rootAsset]);

  it('When you subscribe the root is returned', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {}
    );
    session.subscribe({
      next: (treeRoot) => {
        if (!treeRoot || treeRoot.length == 0) {
          return;
        }
        expect(treeRoot.length).toEqual(1);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.hierarchies.size).toEqual(1);
        expect(
          treeRoot[0]?.hierarchies.get('bananas1234')?.isExpanded
        ).toBeFalse();
        expect(treeRoot[0]?.hierarchies.get('bananas1234')).toEqual({
          children: [],
          id: 'bananas1234',
          isExpanded: false,
          loadingState: LoadingStateEnum.NOT_LOADED,
          name: 'bananas',
        });

        expect(treeRoot[0]?.properties).toBeEmpty();
      },
    });
  });
});

describe('branch loading functionality', () => {
  const replayData = new MockSiteWiseAssetsReplayData();
  const rootAsset: AssetSummary = { ...sampleAssetSummary };
  replayData.addAssetSummaries([rootAsset]);
  // This time the asset has no hierarchis and the loading will stop at just the asset

  it('When you subscribe the asset is returned', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        asset: { assetId: rootAsset.id as string },
      }
    );
    session.subscribe({
      next: (treeRoot) => {
        if (!treeRoot || treeRoot.length == 0) {
          return;
        }
        expect(treeRoot.length).toEqual(1);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.hierarchies.size).toEqual(0);
        expect(treeRoot[0]?.properties).toBeEmpty();
      },
    });
  });
});

describe('model loading', () => {
  const replayData = new MockSiteWiseAssetsReplayData();
  const rootAsset: AssetSummary = { ...sampleAssetSummary };

  const rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList(
    { assetHierarchyId: HIERARCHY_ROOT_ID },
    rootHierarchy
  );
  replayData.addAssetSummaries([rootAsset]);
  replayData.addAssetModels([sampleAssetModel]);

  it('When you request the model you get the model', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        asset: { assetId: rootAsset.id as string },
        withModels: true,
      }
    );
    session.subscribe({
      next: (treeRoot) => {
        if (!treeRoot || treeRoot.length == 0) {
          return;
        }
        expect(treeRoot.length).toEqual(1);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.model).toEqual(sampleAssetModel);
        expect(treeRoot[0]?.properties).toBeEmpty();
      },
    });
  });
});

describe('asset property loading', () => {
  const replayData = new MockSiteWiseAssetsReplayData();
  const rootAsset: AssetSummary = { ...sampleAssetSummary };

  const rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList(
    { assetHierarchyId: HIERARCHY_ROOT_ID },
    rootHierarchy
  );
  replayData.addAssetSummaries([rootAsset]);
  const modelWithProperties: DescribeAssetModelResponse = {
    ...sampleAssetModel,
  };
  const sampleProperty: AssetModelProperty = {
    dataType: PropertyDataType.STRING,
    id: 'modelNumber.id.1234',
    name: 'modelNumber',
    type: {
      attribute: {
        defaultValue: 'Model No. 1234',
      },
    },
  };
  const propertyNotInModel: AssetModelProperty = {
    dataType: PropertyDataType.STRING,
    id: 'propertyNotInModel.id.1234',
    name: 'propertyNotInModel',
    type: {
      attribute: {
        defaultValue: 'Bogons',
      },
    },
  };
  modelWithProperties.assetModelProperties = [sampleProperty];
  replayData.addAssetModels([modelWithProperties]);
  const expectedPropertyValue: AssetPropertyValue = {
    value: { stringValue: 'Model Number 5' },
    timestamp: { timeInSeconds: 12345, offsetInNanos: 0 },
  };
  replayData.addAssetPropertyValues({
    assetId: rootAsset.id as string,
    propertyId: sampleProperty.id as string,
    value: expectedPropertyValue,
  });
  const badPropertyValue: AssetPropertyValue = {
    value: { stringValue: 'This should never get loaded' },
    timestamp: { timeInSeconds: 12345, offsetInNanos: 0 },
  };
  replayData.addAssetPropertyValues({
    assetId: rootAsset.id as string,
    propertyId: propertyNotInModel.id as string,
    value: badPropertyValue,
  });

  it('When you request a property and it exists it is attached to the asset node', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        withModels: true,
        withPropertyValues: [
          'propertyNotInModel.id.1234',
          'modelNumber.id.1234',
        ],
      }
    );
    session.subscribe({
      next: (treeRoot) => {
        if (!treeRoot || treeRoot.length == 0) {
          return;
        }
        expect(treeRoot.length).toEqual(1);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.model).toEqual(modelWithProperties);
        expect(treeRoot[0]?.properties.size).toEqual(1);
        expect(treeRoot[0]?.properties.get('modelNumber.id.1234')).toEqual(
          expectedPropertyValue
        );
      },
    });
  });
});

describe('expand functionality', () => {
  const replayData = new MockSiteWiseAssetsReplayData();
  const rootAsset: AssetSummary = { ...sampleAssetSummary };
  rootAsset.hierarchies = [{ id: 'bananas1234', name: 'bananas' }];
  const bananaOne: AssetSummary = { ...sampleAssetSummary };
  bananaOne.id = bananaOne.name = 'bananaOne';
  const bananaTwo: AssetSummary = { ...sampleAssetSummary };
  bananaTwo.id = bananaTwo.name = 'bananaTwo';

  const rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList(
    { assetHierarchyId: HIERARCHY_ROOT_ID },
    rootHierarchy
  );

  const bananaHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: 'bananas1234',
    assets: [bananaOne, bananaTwo],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList(
    { assetId: rootAsset.id, assetHierarchyId: 'bananas1234' },
    bananaHierarchy
  );

  replayData.addAssetSummaries([rootAsset, bananaOne, bananaTwo]);

  it('Expands a hierarchy when requested', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {}
    );
    session.expand(new BranchReference(rootAsset.id, 'bananas1234'));
    session.subscribe({
      next: (treeRoot) => {
        if (treeRoot.length == 0) {
          return;
        }

        expect(treeRoot.length).toEqual(1);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.hierarchies.size).toEqual(1);
        expect(treeRoot[0]?.hierarchies.get('bananas1234')).not.toBeUndefined();
        expect(
          treeRoot[0]?.hierarchies.get('bananas1234')?.isExpanded
        ).toBeTrue();
        expect(
          treeRoot[0]?.hierarchies.get('bananas1234')?.children.length
        ).toEqual(2);
        expect(
          treeRoot[0]?.hierarchies.get('bananas1234')?.children[0].asset
        ).toEqual(bananaOne);
        expect(
          treeRoot[0]?.hierarchies.get('bananas1234')?.children[1].asset
        ).toEqual(bananaTwo);
      },
    });
  });

  it('Collapses and expanded hierarchy', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {}
    );
    session.collapse(new BranchReference(rootAsset.id, 'bananas1234'));
    session.subscribe({
      next: (treeRoot) => {
        if (treeRoot.length == 0) {
          return;
        }

        expect(treeRoot.length).toEqual(1);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.asset).toEqual(rootAsset);
        expect(treeRoot[0]?.hierarchies.size).toEqual(1);
        expect(
          treeRoot[0]?.hierarchies.get('bananas1234')?.children.length
        ).toEqual(0);
      },
    });
  });
});

describe('error handling', () => {
  const replayData = new MockSiteWiseAssetsReplayData();

  const error = {
    msg: 'id not found',
    type: 'ResourceNotFoundException',
    status: 'ResourceNotFoundException',
  };

  replayData.addErrors([error]);

  it('it returns the error when requesting root asset fails', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        asset: { assetId: '' },
      }
    );
    session.expand(new BranchReference(undefined, HIERARCHY_ROOT_ID));
    session.subscribe({
      next: () => {
        // noop
      },
      error: (err) => {
        expect(err.length).toEqual(1);
        expect(err[0].msg).toEqual(error.msg);
        expect(err[0].type).toEqual(error.type);
        expect(err[0].status).toEqual(error.status);
      },
    });
  });

  it('it returns the error when requesting asset hierarchy fails', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        asset: { assetId: '' },
      }
    );
    session.expand(new BranchReference('asset-id', 'hierarchy-id'));
    session.subscribe({
      next: () => {
        // noop
      },
      error: (err) => {
        expect(err.length).toEqual(1);
        expect(err[0].msg).toEqual(error.msg);
        expect(err[0].type).toEqual(error.type);
        expect(err[0].status).toEqual(error.status);
      },
    });
  });

  it('it returns the error when requesting asset summary fails', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        asset: { assetId: 'root-asset-id' },
      }
    );
    session.subscribe({
      next: () => {
        // noop
      },
      error: (err) => {
        expect(err.length).toEqual(1);
        expect(err[0].msg).toEqual(error.msg);
        expect(err[0].type).toEqual(error.type);
        expect(err[0].status).toEqual(error.status);
      },
    });
  });

  it('it returns the error when requesting asset model fails', async () => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(
      new MockSiteWiseAssetSession(replayData),
      {
        asset: { assetId: 'root-asset-id' },
      }
    );
    session.subscribe({
      next: () => {
        // noop
      },
      error: (err) => {
        expect(err.length).toEqual(1);
        expect(err[0].msg).toEqual(error.msg);
        expect(err[0].type).toEqual(error.type);
        expect(err[0].status).toEqual(error.status);
      },
    });
  });
});
