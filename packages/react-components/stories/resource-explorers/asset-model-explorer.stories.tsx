import { type Meta } from '@storybook/react';
import React from 'react';

import {
  SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  type CommonResourceExplorerControls,
} from './controls';
import { client } from './data-source';

import {
  AssetModelExplorer,
  type AssetModelExplorerProps,
} from '../../src/components/resource-explorers';
import {
  StoryWithClearedResourceCache,
  StoryWithSelectableResource,
  StoryWithTanstackDevTools,
} from './decorators';
import { StoryFnReactReturnType } from '@storybook/react/dist/ts3.9/client/preview/types';

export default {
  title: 'Resource Explorers/Asset Model Explorer',
  component: AssetModelExplorer,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['tableSettings.isSearchEnabled'],
    },
  },
  decorators: [
    StoryWithTanstackDevTools,
    StoryWithClearedResourceCache,
    StoryWithSelectableResource,
  ],
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof AssetModelExplorer>;

type AssetModelExplorerStory = (
  controls: AssetModelExplorerStoryControls,
  context: AssetModelExplorerStoryContext
) => StoryFnReactReturnType;

type AssetModelExplorerStoryControls = CommonResourceExplorerControls;

interface AssetModelExplorerStoryContext {
  selectedResources: NonNullable<
    AssetModelExplorerProps['selectedAssetModels']
  >;
  onSelectResource: NonNullable<AssetModelExplorerProps['onSelectAssetModel']>;
}

function storyArgsToProps(
  {
    isTableTitleEnabled,
    isTableSearchEnabled,
    isTableFilterEnabled,
    isTableUserSettingsEnabled,
    isDropDownFilterEnabled,
    ...controls
  }: AssetModelExplorerStoryControls,
  { selectedResources, onSelectResource }: AssetModelExplorerStoryContext
): AssetModelExplorerProps {
  return {
    selectedAssetModels: selectedResources,
    onSelectAssetModel: onSelectResource,
    tableSettings: {
      isTitleEnabled: isTableTitleEnabled,
      isSearchEnabled: isTableSearchEnabled,
      isFilterEnabled: isTableFilterEnabled,
      isUserSettingsEnabled: isTableUserSettingsEnabled,
    },
    dropDownSettings: {
      isFilterEnabled: isDropDownFilterEnabled,
    },
    ...controls,
  };
}

export const AssetAndComponentModels: AssetModelExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return <AssetModelExplorer {...props} requestFns={client} />;
};

export const OnlyAssetModels: AssetModelExplorerStory = (controls, context) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AssetModelExplorer
      {...props}
      requestFns={client}
      parameters={[{ assetModelTypes: ['ASSET_MODEL'] }]}
    />
  );
};

export const OnlyComponentModels: AssetModelExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AssetModelExplorer
      {...props}
      requestFns={client}
      parameters={[{ assetModelTypes: ['COMPONENT_MODEL'] }]}
    />
  );
};

export const ZeroConfigurationTable: AssetModelExplorerStory = () => {
  return <AssetModelExplorer />;
};

export const ZeroConfigurationDropDown: AssetModelExplorerStory = () => {
  return <AssetModelExplorer variant='drop-down' />;
};
