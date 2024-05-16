import { type Meta } from '@storybook/react';
import React, { useState } from 'react';
import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';
import {
  AssetPropertyExplorer,
  type AssetPropertyExplorerProps,
} from '../../src/components/resource-explorers';
import { ResourceExplorerStoryControls } from './types';
import type { AssetPropertyResource } from '../../src/components/resource-explorers/types/resources';

export default {
  title: 'Resource Explorers/Asset Property Explorer',
  component: AssetPropertyExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof AssetPropertyExplorer>;

type AssetPropertyExplorerStoryControls =
  ResourceExplorerStoryControls<AssetPropertyResource>;

export function AssetPropertyExplorerExample({
  isTitleless,
  isSearchEnabled,
  isFilterEnabled,
  isUserSettingsEnabled,
  ...assetPropertyExplorerProps
}: AssetPropertyExplorerStoryControls) {
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
  >([]);

  return (
    <AssetPropertyExplorer
      {...assetPropertyExplorerProps}
      onSelectAssetProperty={setSelectedAssetProperties}
      selectedAssetProperties={selectedAssetProperties}
      parameters={[
        {
          assetId: 'fe77512c-542e-48f0-8aed-6437bcd13ada',
          assetModelId: '0ea4b401-1fae-492b-bd26-509bc97bfd34',
        },
        {
          assetId: '5488de7d-01e6-405e-b4f7-de4767273ac5',
          assetModelId: '0ea4b401-1fae-492b-bd26-509bc97bfd34',
        },
        {
          assetId: 'c04755c2-e1c5-4674-a2ff-8f66e7de6d29',
          assetModelId: '0ea4b401-1fae-492b-bd26-509bc97bfd34',
        },
        {
          assetId: '759f73df-811c-4a29-9bf0-447228c19d9c',
          assetModelId: '0ea4b401-1fae-492b-bd26-509bc97bfd34',
        },
        {
          assetId: '3d1d17a4-2655-4405-aee8-67cd1ca5c166',
          assetModelId: '0ea4b401-1fae-492b-bd26-509bc97bfd34',
        },
        {
          assetId: '6c16d9ac-0eac-4c16-801d-1b8480c89ebb',
          assetModelId: '0ea4b401-1fae-492b-bd26-509bc97bfd34',
        },
      ]}
      requestFns={client}
      tableSettings={{
        isTitleless,
        isFilterEnabled,
        isUserSettingsEnabled,
        isSearchEnabled,
      }}
    />
  );
}

export function ZeroConfiguration() {
  return <AssetPropertyExplorer />;
}
