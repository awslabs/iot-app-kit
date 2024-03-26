import { type AssetPropertySummary } from '@aws-sdk/client-iotsitewise';
import { ComponentStory, type ComponentMeta } from '@storybook/react';
import React, { useState, type FC } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  AssetPropertyExplorer,
  type AssetPropertyExplorerProps,
} from '../../src/components/resource-explorers/asset-property-explorer/asset-property-explorer';
import { ResourceExplorerProvider } from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Asset Property Explorer',
  component: AssetPropertyExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies ComponentMeta<typeof AssetPropertyExplorer>;

export const AssetPropertyExplorerExample: ComponentStory<
  FC<AssetPropertyExplorerProps>
> = ({ filterEnabled, preferencesEnabled, selectionType }) => {
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    AssetPropertySummary[]
  >([]);
  return (
    <ResourceExplorerProvider>
      <AssetPropertyExplorer
        onSelectionChange={setSelectedAssetProperties}
        selectedResources={selectedAssetProperties}
        assetIds={[
          '9f7cd652-40dd-4246-b3ec-7a9224d547aa',
          '8ab80efc-ba4b-4e82-b941-182e1cf72034',
        ]}
        filterEnabled={filterEnabled}
        preferencesEnabled={preferencesEnabled}
        selectionType={selectionType}
        dataSource={{
          listAssetProperties: client.listAssetProperties.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};

export const AssetPropertyExplorerWithExtendedDataExample: ComponentStory<
  FC<AssetPropertyExplorerProps>
> = ({ filterEnabled, preferencesEnabled, selectionType }) => {
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    AssetPropertySummary[]
  >([]);
  return (
    <ResourceExplorerProvider>
      <AssetPropertyExplorer
        onSelectionChange={setSelectedAssetProperties}
        selectedResources={selectedAssetProperties}
        assetIds={[
          '9f7cd652-40dd-4246-b3ec-7a9224d547aa',
          '8ab80efc-ba4b-4e82-b941-182e1cf72034',
        ]}
        filterEnabled={filterEnabled}
        preferencesEnabled={preferencesEnabled}
        selectionType={selectionType}
        dataSource={{
          listAssetProperties: client.listAssetProperties.bind(client),
          describeAsset: client.describeAsset.bind(client),
          listAssetModelProperties:
            client.listAssetModelProperties.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};
