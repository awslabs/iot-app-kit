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
  AlarmExplorer,
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
        iotSiteWiseClient={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
      />

      <AssetPropertyExplorer
        iotSiteWiseClient={client}
        parameters={selectedAssets}
      />
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
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />

      <AssetExplorer
        iotSiteWiseClient={client}
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
        iotSiteWiseClient={client}
        parameters={selectedAssets}
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
      />
    </>
  );
}

export function AssetExplorerPlusAlarmExplorer() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  console.log(selectedAssets);

  return (
    <>
      <AssetExplorer
        iotSiteWiseClient={client}
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        selectionMode='multi'
      />

      <AlarmExplorer
        iotSiteWiseClient={client}
        parameters={selectedAssets}
        tableSettings={{
          isUserSettingsEnabled: true,
        }}
      />
    </>
  );
}

export function AssetModelExplorerPlusAlarmExplorer() {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >([]);

  return (
    <>
      <AssetModelExplorer
        iotSiteWiseClient={client}
        onSelectAssetModel={setSelectedAssetModels}
        selectedAssetModels={selectedAssetModels}
        selectionMode='multi'
      />

      <AlarmExplorer
        iotSiteWiseClient={client}
        parameters={selectedAssetModels}
        tableSettings={{ isFilterEnabled: true, isUserSettingsEnabled: true }}
      />
    </>
  );
}
