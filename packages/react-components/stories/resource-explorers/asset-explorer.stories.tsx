import { type Meta } from '@storybook/react';
import React, { useState } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  AssetExplorer,
  type AssetExplorerProps,
} from '../../src/components/resource-explorers';
import type { ResourceExplorerStoryControls } from './types';
import type { AssetResource } from '../../src/components/resource-explorers/types/resources';

export default {
  title: 'Resource Explorers/Asset Explorer',
  component: AssetExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof AssetExplorer>;

type AssetExplorerStoryControls = ResourceExplorerStoryControls<AssetResource>;

export function StandardExample({
  isTitleEnabled,
  isSearchEnabled,
  isFilterEnabled,
  isUserSettingsEnabled,
  ...assetExplorerProps
}: AssetExplorerStoryControls) {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <AssetExplorer
      {...assetExplorerProps}
      requestFns={client}
      onSelectAsset={setSelectedAssets}
      selectedAssets={selectedAssets}
      tableSettings={{
        isTitleEnabled,
        isFilterEnabled,
        isUserSettingsEnabled,
        isSearchEnabled,
      }}
    />
  );
}

export function SearchOnly() {
  return (
    <AssetExplorer
      requestFns={{ executeQuery: client.executeQuery.bind(client) }}
      tableSettings={{
        isSearchEnabled: true,
      }}
    />
  );
}

export function ZeroConfiguration() {
  return <AssetExplorer />;
}

export function ZeroConfigurationDropDown() {
  return <AssetExplorer variant='drop-down' />;
}

export function GrafanaThemeTable() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <AssetExplorer
      requestFns={client}
      onSelectAsset={setSelectedAssets}
      selectedAssets={selectedAssets}
      tableSettings={{
        isFilterEnabled: true,
        isUserSettingsEnabled: true,
        isSearchEnabled: true,
      }}
    />
  );
}

export function GrafanaThemeDropDown() {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  return (
    <AssetExplorer
      requestFns={client}
      onSelectAsset={setSelectedAssets}
      selectedAssets={selectedAssets}
      tableSettings={{
        isFilterEnabled: true,
        isUserSettingsEnabled: true,
        isSearchEnabled: true,
      }}
      variant='drop-down'
    />
  );
}
