import { AssetExplorer } from './asset-explorer';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';
import {
  describeDefaultConfiguration,
  describeDropdownVariant,
  describeRequestManagement,
  describeTableSettings,
} from '../../testing/helpers/common-tests';
import { ListAssets } from '../../types/request-fn';
import { createListAssetsPage } from '../../testing/helpers/responses';

describe(AssetExplorer, () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describeDefaultConfiguration('Assets', AssetExplorer);
  describeTableSettings('Assets', AssetExplorer, true);
  describeDropdownVariant({
    ResourceExplorer: AssetExplorer,
  });
  describeRequestManagement({
    pluralResourceName: 'Assets',
    singlePageTest: {
      requestFns: {
        listAssets: jest.fn().mockResolvedValue({
          assetSummaries: [
            {
              arn: 'arn',
              id: 'asset-1',
              name: 'Asset',
              assetModelId: 'asset-model-1',
              creationDate: new Date(0),
              lastUpdateDate: new Date(1),
              status: {
                state: 'ACTIVE',
              },
              hierarchies: [],
            },
          ],
        } satisfies Awaited<ReturnType<ListAssets>>),
      },
    },
    singleListPaginationTest: {
      requestFns: {
        listAssets: jest
          .fn()
          .mockResolvedValueOnce(createListAssetsPage(10, 1, 'next-token-1'))
          .mockResolvedValueOnce(createListAssetsPage(10, 20, 'next-token-2'))
          .mockResolvedValueOnce(createListAssetsPage(10, 30)),
      },
    },
    multipleListPaginationWithFullPagesTest: {
      parameters: [
        { assetModelId: 'asset-model-1' },
        { assetModelId: 'asset-model-2' },
        { assetModelId: 'asset-model-3' },
        { assetModelId: 'asset-model-4' },
      ],
      requestFns: {
        listAssets: jest
          .fn()
          .mockResolvedValueOnce(createListAssetsPage(10, 1, 'next-token-1'))
          // Page 2 - Q1 -> Q2 -> Q3
          .mockResolvedValueOnce(createListAssetsPage(5, 20))
          .mockResolvedValueOnce(createListAssetsPage(3, 30))
          .mockResolvedValueOnce(createListAssetsPage(2, 40, 'next-token-2'))
          // Page 3 - Q3 -> Q4
          .mockResolvedValueOnce(createListAssetsPage(5, 40))
          .mockResolvedValueOnce(createListAssetsPage(5, 60, 'next-token-3'))
          // Page 4 - Q4
          .mockResolvedValueOnce(createListAssetsPage(10, 70)),
      },
    },
    ResourceExplorer: AssetExplorer,
  });
});
