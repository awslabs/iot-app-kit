import { SiteWiseAssetTreeModule } from './assetTreeModule';
import { MockSiteWiseAssetModule, MockSiteWiseAssetsReplayData } from '../mocks';
import { HIERARCHY_ROOT_ID, HierarchyAssetSummaryList, LoadingStateEnum } from '../sitewise/types';
import { sampleAssetSummary } from '../../iotsitewise/__mocks__/asset';
import { RootedSiteWiseAssetTreeQueryArguments, SiteWiseAssetTreeQuery } from './types';

it('initializes', () => {
  expect(
    () => new SiteWiseAssetTreeModule(new MockSiteWiseAssetModule(new MockSiteWiseAssetsReplayData()))
  ).not.toThrowError();
});

it('returns a session', () => {
  let replayData = new MockSiteWiseAssetsReplayData();
  let testData: HierarchyAssetSummaryList = {
    assetHierarchyId: HIERARCHY_ROOT_ID,
    assets: [sampleAssetSummary],
    loadingState: LoadingStateEnum.LOADED,
  };
  replayData.addHierarchyAssetSummaryList({ assetHierarchyId: HIERARCHY_ROOT_ID }, testData);
  replayData.addAssetSummaries([sampleAssetSummary]);
  expect(() =>
    new SiteWiseAssetTreeModule(new MockSiteWiseAssetModule(replayData)).startSession(
      new SiteWiseAssetTreeQuery({ asset: undefined })
    )
  ).not.toBeUndefined();
});
