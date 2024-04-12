import { type AssetProperty } from '@aws-sdk/client-iotsitewise';
import { ComponentStory, type ComponentMeta } from '@storybook/react';
import React, { useState, type FC } from 'react';
import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';
import {
  ResourceExplorerProvider,
  AssetPropertyExplorer,
  type AssetPropertyExplorerProps,
} from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Asset Property Explorer',
  component: AssetPropertyExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies ComponentMeta<typeof AssetPropertyExplorer>;
export const AssetPropertyExplorerExample: ComponentStory<
  FC<AssetPropertyExplorerProps>
> = ({ selectionType }) => {
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    AssetProperty[]
  >([]);
  return (
    <ResourceExplorerProvider>
      <AssetPropertyExplorer
        onSelectAssetProperty={setSelectedAssetProperties}
        selectedAssetProperties={selectedAssetProperties}
        queries={[]}
        selectionType={selectionType}
        dataSource={{
          listAssetProperties: client.listAssetProperties.bind(client),
          listAssetModelProperties:
            client.listAssetModelProperties.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};
