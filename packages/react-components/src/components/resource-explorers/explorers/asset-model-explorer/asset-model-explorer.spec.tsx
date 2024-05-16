import React, { useState } from 'react';

import { AssetModelExplorer } from './asset-model-explorer';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';
import {
  createListAssetModelsPage,
  fakeListAssetModelsResponse,
} from '../../testing/helpers/responses';
import {
  describeDefaultConfiguration,
  describeDropdownVariant,
  describeRequestManagement,
  describeTableSelection,
  describeTableSettings,
} from '../../testing/helpers/common-tests';
import type { AssetModelResource } from '../../types/resources';

describe(AssetModelExplorer, () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describeDefaultConfiguration('Asset models', AssetModelExplorer);
  describeTableSettings('Asset models', AssetModelExplorer);
  describeDropdownVariant({
    ResourceExplorer: AssetModelExplorer,
  });
  describeRequestManagement({
    pluralResourceName: 'Asset models',
    singlePageTest: {
      requestFns: {
        listAssetModels: jest
          .fn()
          .mockResolvedValue(fakeListAssetModelsResponse),
      },
    },
    singleListPaginationTest: {
      requestFns: {
        listAssetModels: jest
          .fn()
          .mockResolvedValueOnce(
            createListAssetModelsPage(10, 1, 'next-token-1')
          )
          .mockResolvedValueOnce(
            createListAssetModelsPage(10, 20, 'next-token-2')
          )
          .mockResolvedValueOnce(createListAssetModelsPage(10, 30)),
      },
    },
    multipleListPaginationWithFullPagesTest: {
      parameters: [
        { assetModelTypes: ['ASSET_MODEL'] },
        { assetModelTypes: ['COMPONENT_MODEL'] },
        { assetModelTypes: ['ASSET_MODEL', 'COMPONENT_MODEL'] },
        {},
      ],
      requestFns: {
        listAssetModels: jest
          .fn()
          // Page 1 - Q1
          .mockResolvedValueOnce(
            createListAssetModelsPage(10, 1, 'next-token-1')
          )
          // Page 2 - Q1 -> Q2 -> Q3
          .mockResolvedValueOnce(createListAssetModelsPage(5, 20))
          .mockResolvedValueOnce(createListAssetModelsPage(3, 30))
          .mockResolvedValueOnce(
            createListAssetModelsPage(2, 40, 'next-token-2')
          )
          // Page 3 - Q3 -> Q4
          .mockResolvedValueOnce(createListAssetModelsPage(5, 50))
          .mockResolvedValueOnce(
            createListAssetModelsPage(5, 60, 'next-token-3')
          )
          // Page 4 - Q4
          .mockResolvedValueOnce(createListAssetModelsPage(10, 70)),
      },
    },
    ResourceExplorer: AssetModelExplorer,
  });

  describeTableSelection({
    pluralResourceName: 'Asset models',
    singleSelectTest: {
      ResourceExplorer: () => {
        const [selectedAssetModels, setSelectedAssetModels] = useState<
          AssetModelResource[]
        >([]);

        const listAssetModels = jest
          .fn()
          .mockResolvedValue(fakeListAssetModelsResponse);

        return (
          <AssetModelExplorer
            requestFns={{ listAssetModels }}
            selectionMode='single'
            selectedAssetModels={selectedAssetModels}
            onSelectAssetModel={setSelectedAssetModels}
          />
        );
      },
    },
    multiSelectTest: {
      ResourceExplorer: () => {
        const [selectedAssetModels, setSelectedAssetModels] = useState<
          AssetModelResource[]
        >([]);

        const listAssetModels = jest
          .fn()
          .mockResolvedValue(fakeListAssetModelsResponse);

        return (
          <AssetModelExplorer
            requestFns={{ listAssetModels }}
            selectionMode='multi'
            selectedAssetModels={selectedAssetModels}
            onSelectAssetModel={setSelectedAssetModels}
          />
        );
      },
    },
  });
});
