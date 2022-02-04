import { SiteWiseAssetTreeSession } from './assetTreeSession';
import { BranchReference } from './types';
import { HIERARCHY_ROOT_ID, HierarchyAssetSummaryList, LoadingStateEnum } from '../sitewise/types';
import {
  AssetSummary,
  PropertyDataType,
  AssetPropertyValue,
  DescribeAssetModelResponse,
  AssetModelProperty,
} from '@aws-sdk/client-iotsitewise';
import { MockSiteWiseAssetSession, MockSiteWiseAssetsReplayData, sampleAssetModel, sampleAssetSummary } from '../mocks';

it('initializes', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let testData: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [sampleAssetSummary],
    loadingState: LoadingStateEnum.LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetHierarchyId: HIERARCHY_ROOT_ID }, testData);
  replayData.addAssetSummaries([sampleAssetSummary]);
  expect(
    () => new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), { rootAssetId: '' })
  ).not.toThrowError();
});

describe('root loading functionality', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let rootAsset: AssetSummary = { ...sampleAssetSummary };
  rootAsset.hierarchies = [{ id: 'bananas1234', name: 'bananas' }];

  let rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetHierarchyId: HIERARCHY_ROOT_ID }, rootHierarchy);
  replayData.addAssetSummaries([rootAsset]);

  it('When you subscribe the root is returned', (done) => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {
      rootAssetId: '',
    });
    session.subscribe((treeRoot) => {
      if (!treeRoot || treeRoot.length == 0) {
        return;
      }
      expect(treeRoot.length).toEqual(1);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.hierarchies.size).toEqual(1);
      expect(treeRoot[0]?.hierarchies.get('bananas1234')?.isExpanded).toBeFalse();
      expect(treeRoot[0]?.hierarchies.get('bananas1234')).toEqual({
        children: [],
        id: 'bananas1234',
        isExpanded: false,
        loadingState: LoadingStateEnum.NOT_LOADED,
        name: 'bananas',
      });

      expect(treeRoot[0]?.properties).toBeEmpty();
      done();
    });
  });
});

describe('branch loading functionality', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let rootAsset: AssetSummary = { ...sampleAssetSummary };
  replayData.addAssetSummaries([rootAsset]);
  // This time the asset has no hierarchis and the loading will stop at just the asset

  it('When you subscribe the asset is returned', (done) => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {
      rootAssetId: rootAsset.id,
    });
    session.subscribe((treeRoot) => {
      if (!treeRoot || treeRoot.length == 0) {
        return;
      }
      expect(treeRoot.length).toEqual(1);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.hierarchies.size).toEqual(0);
      expect(treeRoot[0]?.properties).toBeEmpty();
      done();
    });
  });
});

describe('model loading', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let rootAsset: AssetSummary = { ...sampleAssetSummary };

  let rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetHierarchyId: HIERARCHY_ROOT_ID }, rootHierarchy);
  replayData.addAssetSummaries([rootAsset]);
  replayData.addAssetModels([sampleAssetModel]);

  it('When you request the model you get the model', (done) => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {
      rootAssetId: '',
      withModels: true,
    });
    session.subscribe((treeRoot) => {
      if (!treeRoot || treeRoot.length == 0) {
        return;
      }
      expect(treeRoot.length).toEqual(1);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.model).toEqual(sampleAssetModel);

      expect(treeRoot[0]?.properties).toBeEmpty();
      done();
    });
  });
});

describe('asset property loading', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let rootAsset: AssetSummary = { ...sampleAssetSummary };

  let rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetHierarchyId: HIERARCHY_ROOT_ID }, rootHierarchy);
  replayData.addAssetSummaries([rootAsset]);
  const modelWithProperties: DescribeAssetModelResponse = { ...sampleAssetModel };
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

  it('When you request a property and it exists it is attached to the asset node', (done) => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {
      rootAssetId: '',
      withModels: true,
      propertyIds: ['propertyNotInModel.id.1234', 'modelNumber.id.1234'],
    });
    session.subscribe((treeRoot) => {
      if (!treeRoot || treeRoot.length == 0) {
        return;
      }
      expect(treeRoot.length).toEqual(1);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.model).toEqual(modelWithProperties);
      expect(treeRoot[0]?.properties.size).toEqual(1);
      expect(treeRoot[0]?.properties.get('modelNumber.id.1234')).toEqual(expectedPropertyValue);
      done();
    });
  });
});

describe('expand functionality', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let rootAsset: AssetSummary = { ...sampleAssetSummary };
  rootAsset.hierarchies = [{ id: 'bananas1234', name: 'bananas' }];
  let bananaOne: AssetSummary = { ...sampleAssetSummary };
  bananaOne.id = bananaOne.name = 'bananaOne';
  let bananaTwo: AssetSummary = { ...sampleAssetSummary };
  bananaTwo.id = bananaTwo.name = 'bananaTwo';

  let rootHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [rootAsset],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetHierarchyId: HIERARCHY_ROOT_ID }, rootHierarchy);

  let bananaHierarchy: HierarchyAssetSummaryList = {
    assetHierarchyId: 'bananas1234',
    assets: [bananaOne, bananaTwo],
    loadingState: LoadingStateEnum.NOT_LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetId: rootAsset.id, assetHierarchyId: 'bananas1234' }, bananaHierarchy);

  replayData.addAssetSummaries([rootAsset, bananaOne, bananaTwo]);

  it('Expands a hierarchy when requested', (done) => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {
      rootAssetId: '',
    });
    session.expand(new BranchReference(rootAsset.id, 'bananas1234'));
    session.subscribe((treeRoot) => {
      if (treeRoot.length == 0) {
        return;
      }

      expect(treeRoot.length).toEqual(1);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.hierarchies.size).toEqual(1);
      expect(treeRoot[0]?.hierarchies.get('bananas1234')).not.toBeUndefined();
      expect(treeRoot[0]?.hierarchies.get('bananas1234')?.isExpanded).toBeTrue();
      expect(treeRoot[0]?.hierarchies.get('bananas1234')?.children.length).toEqual(2);
      expect(treeRoot[0]?.hierarchies.get('bananas1234')?.children[0].asset).toEqual(bananaOne);
      expect(treeRoot[0]?.hierarchies.get('bananas1234')?.children[1].asset).toEqual(bananaTwo);
      done();
    });
  });

  it('Collapses and expanded hierarchy', (done) => {
    const session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeSession(new MockSiteWiseAssetSession(replayData), {
      rootAssetId: '',
    });
    session.collapse(new BranchReference(rootAsset.id, 'bananas1234'));
    session.subscribe((treeRoot) => {
      if (treeRoot.length == 0) {
        return;
      }

      expect(treeRoot.length).toEqual(1);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.asset).toEqual(rootAsset);
      expect(treeRoot[0]?.hierarchies.size).toEqual(1);
      expect(treeRoot[0]?.hierarchies.get('bananas1234')?.children.length).toEqual(0);
      done();
    });
  });
});
