import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { ComponentStory, type ComponentMeta } from '@storybook/react';
import React, { useState, type FC } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  ResourceExplorerProvider,
  AssetExplorer,
  type AssetExplorerProps,
} from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Asset Explorer',
  component: AssetExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies ComponentMeta<typeof AssetExplorer>;

export const AssetExplorerExample: ComponentStory<FC<AssetExplorerProps>> = ({
  selectionType,
}) => {
  const [selectedAssets, setSelectedAssets] = useState<AssetSummary[]>([]);

  return (
    <ResourceExplorerProvider>
      <AssetExplorer
        onSelectAsset={setSelectedAssets}
        selectedAssets={selectedAssets}
        // assetModelIds={['57490ce6-e791-4fcc-ac7e-9aaebe892b81']}
        selectionType={selectionType}
        dataSource={{
          // describeAsset: client.describeAsset.bind(client),
          listAssets: client.listAssets.bind(client),
          listAssociatedAssets: client.listAssociatedAssets.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};
