import { ComponentStory, type ComponentMeta } from '@storybook/react';
import React, { type FC } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  ResourceExplorerProvider,
  AssetModelExplorer,
  type AssetModelExplorerProps,
} from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Asset Model Explorer',
  component: AssetModelExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
    assetModelTypes: {
      control: { type: 'array' },
      defaultValue: undefined,
    },
  },
} satisfies ComponentMeta<typeof AssetModelExplorer>;

export const AssetModelExplorerExample: ComponentStory<
  FC<AssetModelExplorerProps>
> = ({ selectionType, assetModelTypes }) => {
  return (
    <ResourceExplorerProvider>
      <AssetModelExplorer
        assetModelTypes={assetModelTypes}
        selectionType={selectionType}
        dataSource={{
          listAssetModels: client.listAssetModels.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};

export const AssetModelsOnly: ComponentStory<FC<AssetModelExplorerProps>> = ({
  selectionType,
}) => {
  return (
    <ResourceExplorerProvider>
      <AssetModelExplorer
        assetModelTypes={['ASSET_MODEL']}
        selectionType={selectionType}
        dataSource={{
          listAssetModels: client.listAssetModels.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};

export const ComponentModelsOnly: ComponentStory<
  FC<AssetModelExplorerProps>
> = ({ selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <AssetModelExplorer
        assetModelTypes={['COMPONENT_MODEL']}
        selectionType={selectionType}
        dataSource={{
          listAssetModels: client.listAssetModels.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};
