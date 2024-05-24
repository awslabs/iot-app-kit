import { type Meta } from '@storybook/react';
import React, { useState } from 'react';

import {
  StoryWithClearedResourceCache,
  StoryWithTanstackDevTools,
} from './decorators';
import { client } from './data-source';
import {
  AssetModelExplorer,
  AssetExplorer,
  AssetPropertyExplorer,
  TimeSeriesExplorer,
  type AssetModelExplorerProps,
  type AssetExplorerProps,
} from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Combinations',
  component: AssetExplorer,
  decorators: [StoryWithTanstackDevTools, StoryWithClearedResourceCache],
} satisfies Meta<typeof AssetExplorer>;

export function AssetExplorerPlusAssetPropertyExplorer() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <>
      <AssetExplorer
        requestFns={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
      />

      <AssetPropertyExplorer requestFns={client} parameters={selectedAssets} />
    </>
  );
}

export function AssetExplorerPlusTimeSeriesExplorer() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <>
      <AssetExplorer
        requestFns={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
        tableSettings={{
          isSearchEnabled: true,
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <TimeSeriesExplorer
        requestFns={client}
        parameters={selectedAssets}
        tableSettings={{ isFilterEnabled: true, isUserSettingsEnabled: true }}
      />
    </>
  );
}

export function AssetExplorerPlusAssetExplorer() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <>
      <AssetExplorer
        requestFns={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
        tableSettings={{
          isSearchEnabled: true,
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        requestFns={client}
        parameters={selectedAssets}
        tableSettings={{ isFilterEnabled: true, isUserSettingsEnabled: true }}
      />
    </>
  );
}

export function AssetModelExplorerPlusAssetExplorer() {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >([]);

  return (
    <>
      <AssetModelExplorer
        requestFns={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        requestFns={client}
        parameters={selectedAssetModels}
        tableSettings={{ isFilterEnabled: true, isUserSettingsEnabled: true }}
      />
    </>
  );
}

export function AssetModelExplorerPlusAssetExplorerPlusAssetPropertyExplorer() {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >([]);
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <>
      <AssetModelExplorer
        requestFns={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        requestFns={client}
        parameters={selectedAssetModels}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetPropertyExplorer
        requestFns={client}
        parameters={selectedAssets}
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />
    </>
  );
}

export function AssetModelExplorerPlusAssetExplorerPlusTimeSeriesExplorer() {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >([]);
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <>
      <AssetModelExplorer
        requestFns={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        requestFns={client}
        parameters={selectedAssetModels}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <TimeSeriesExplorer
        requestFns={client}
        parameters={selectedAssets}
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />
    </>
  );
}
