import { type Meta } from '@storybook/react';
import React, { useState } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  AssetModelExplorer,
  AssetExplorer,
  AssetPropertyExplorer,
  type AssetModelExplorerProps,
  type AssetExplorerProps,
  type AssetPropertyExplorerProps,
} from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Combinations',
  component: AssetExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof AssetExplorer>;

export function AssetPlusAssetPropertyExplorer() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
  >([]);

  return (
    <>
      <AssetExplorer
        requestFns={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
      />

      <AssetPropertyExplorer
        onSelectAssetProperty={setSelectedAssetProperties}
        selectedAssetProperties={selectedAssetProperties}
        parameters={selectedAssets}
        requestFns={client}
        selectionMode='multi'
      />
    </>
  );
}

export function AssetModelPlusAssetExplorer() {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >([]);
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <>
      <AssetModelExplorer
        variant='drop-down'
        requestFns={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
      />

      <AssetExplorer
        parameters={selectedAssetModels}
        requestFns={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
      />
    </>
  );
}
