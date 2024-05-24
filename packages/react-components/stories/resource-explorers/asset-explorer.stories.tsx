import { type Meta } from '@storybook/react';
import React from 'react';

import {
  CommonResourceExplorerControls,
  SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
} from './controls';
import { client } from './data-source';

import {
  AssetExplorer,
  type AssetExplorerProps,
} from '../../src/components/resource-explorers';
import {
  StoryWithClearedResourceCache,
  StoryWithSelectableResource,
  StoryWithTanstackDevTools,
} from './decorators';
import { StoryFnReactReturnType } from '@storybook/react/dist/ts3.9/client/preview/types';

export default {
  title: 'Resource Explorers/Asset Explorer',
  component: AssetExplorer,
  parameters: {
    controls: {
      expanded: true,
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
} satisfies Meta<typeof AssetExplorer>;

type AssetExplorerStory = (
  controls: AssetExplorerStoryControls,
  context: AssetExplorerStoryContext
) => StoryFnReactReturnType;

type AssetExplorerStoryControls = CommonResourceExplorerControls;

interface AssetExplorerStoryContext {
  selectedResources: NonNullable<AssetExplorerProps['selectedAssets']>;
  onSelectResource: NonNullable<AssetExplorerProps['onSelectAsset']>;
}

function storyArgsToProps(
  {
    isTableTitleEnabled,
    isTableSearchEnabled,
    isTableFilterEnabled,
    isTableUserSettingsEnabled,
    isDropDownFilterEnabled,
    ...controls
  }: AssetExplorerStoryControls,
  { selectedResources, onSelectResource }: AssetExplorerStoryContext
): AssetExplorerProps {
  return {
    selectedAssets: selectedResources,
    onSelectAsset: onSelectResource,
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

export const HierarchyNavigation: AssetExplorerStory = (controls, context) => {
  const props = storyArgsToProps(controls, context);

  return <AssetExplorer {...props} requestFns={client} />;
};

export const SearchOnly: AssetExplorerStory = (controls, context) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AssetExplorer
      {...props}
      requestFns={{ executeQuery: client.executeQuery.bind(client) }}
    />
  );
};

export const ZeroConfigurationTable: AssetExplorerStory = () => {
  return <AssetExplorer />;
};

export const ZeroConfigurationDropDown: AssetExplorerStory = () => {
  return <AssetExplorer variant='drop-down' />;
};
