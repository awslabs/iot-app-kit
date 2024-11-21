import { type Meta } from '@storybook/react';
import { useState } from 'react';

import {
  AlarmExplorer,
  AssetExplorer,
  AssetModelExplorer,
  AssetPropertyExplorer,
  TimeSeriesExplorer,
  type AssetExplorerProps,
  type AssetModelExplorerProps,
} from '../../src/components/resource-explorers';
import { client, eventsClient } from './data-source';
import {
  StoryWithClearedResourceCache,
  StoryWithTanstackDevTools,
} from './decorators';

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
        iotEventsClient={eventsClient}
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
        iotEventsClient={eventsClient}
        parameters={selectedAssetModels}
        tableSettings={{ isFilterEnabled: true, isUserSettingsEnabled: true }}
      />
    </>
  );
}
