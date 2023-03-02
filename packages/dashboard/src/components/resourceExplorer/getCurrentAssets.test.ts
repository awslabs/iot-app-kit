import { getCurrentAssets } from './getCurrentAssets';
import { HIERARCHY_ROOT_ID } from './nextResourceExplorer';
import { MaybeSiteWiseAssetTreeSessionInterface } from './types';
import { DashboardMessages } from '~/messages';

describe('getCurrentAssets', () => {
  it('should return all assets under the root when currentBranchId is hierachy root id', async () => {
    const provider = {
      branches: {
        [HIERARCHY_ROOT_ID]: {
          assetIds: ['Asset1', 'Asset2'],
        },
      },
      assetNodes: {
        Asset1: { asset: { name: 'Asset 1' } },
        Asset2: { asset: { name: 'Asset 2' } },
      },
    } as unknown as MaybeSiteWiseAssetTreeSessionInterface;
    const messageOverrides = {
      resourceExplorer: {
        rootAssetsHeader: 'Root Assets',
        childAssetsHeader: 'Child Assets',
      },
    } as DashboardMessages;

    const result = await getCurrentAssets(provider, HIERARCHY_ROOT_ID, messageOverrides);

    expect(result).toEqual([{ isHeader: true, name: 'Root Assets' }, { name: 'Asset 1' }, { name: 'Asset 2' }]);
  });

  it('should return all assets for the current branch when currentBranchId is valid and something other than hierarchy root id', async () => {
    const provider = {
      branches: {
        [HIERARCHY_ROOT_ID]: {
          assetIds: ['Asset1'],
        },
        Asset3ModelAsset1: {
          assetIds: ['Asset3'],
        },
      },
      assetNodes: {
        Asset1: {
          asset: {
            id: 'Asset1',
            name: 'Asset 1',
            hierarchies: [{ id: 'Asset3Model', name: 'Asset 3 Model' }],
          },
        },
        Asset3: { asset: { id: 'Asset3', name: 'Asset 3' } },
      },
    } as unknown as MaybeSiteWiseAssetTreeSessionInterface;
    const messageOverrides = {
      resourceExplorer: {
        rootAssetsHeader: 'Root Assets',
        childAssetsHeader: 'Child Assets',
      },
    } as DashboardMessages;

    const result = await getCurrentAssets(provider, 'Asset1', messageOverrides);

    expect(result).toEqual([
      { isHeader: true, name: 'Child Assets' },
      { id: 'Asset3', name: 'Asset 3' },
    ]);
  });

  it('should return an empty array when currentBranchId is missing', async () => {
    const provider = {
      branches: {
        [HIERARCHY_ROOT_ID]: {
          assetIds: ['Asset1'],
        },
      },
      assetNodes: {
        Asset1: {
          asset: {
            id: 'Asset1',
            name: 'Asset 1',
            hierarchies: [],
          },
        },
      },
    } as unknown as MaybeSiteWiseAssetTreeSessionInterface;
    const messageOverrides = {
      resourceExplorer: {
        rootAssetsHeader: 'Root Assets',
        childAssetsHeader: 'Child Assets',
      },
    } as DashboardMessages;

    const result = await getCurrentAssets(provider, 'notARealBranchId', messageOverrides);

    expect(result).toEqual([]);
  });

  it('should return empty array when branches or assetNodes are missing', async () => {
    const provider = {} as unknown as MaybeSiteWiseAssetTreeSessionInterface;
    const messageOverrides = {
      resourceExplorer: {
        rootAssetsHeader: 'Root Assets',
        childAssetsHeader: 'Child Assets',
      },
    } as DashboardMessages;

    const result = await getCurrentAssets(provider, HIERARCHY_ROOT_ID, messageOverrides);

    expect(result).toEqual([]);
  });
});
