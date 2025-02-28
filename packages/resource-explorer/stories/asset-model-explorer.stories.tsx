import { type Meta } from '@storybook/react';
import { type ReactElement } from 'react';
import {
  AssetModelExplorer,
  type AssetModelExplorerProps,
} from '../src/explorers';
import {
  SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  type CommonResourceExplorerControls,
} from './controls';
import { client } from './data-source';
import {
  StoryWithClearedResourceCache,
  StoryWithSelectableResource,
  StoryWithTanstackDevTools,
  StoryWithTheming,
} from './decorators';

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
    StoryWithTheming,
  ],
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof AssetModelExplorer>;

type AssetModelExplorerStory = (
  controls: AssetModelExplorerStoryControls,
  context: AssetModelExplorerStoryContext
) => ReactElement;

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

  return <AssetModelExplorer {...props} iotSiteWiseClient={client} />;
};

export const OnlyAssetModels: AssetModelExplorerStory = (controls, context) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AssetModelExplorer
      {...props}
      iotSiteWiseClient={client}
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
      iotSiteWiseClient={client}
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
