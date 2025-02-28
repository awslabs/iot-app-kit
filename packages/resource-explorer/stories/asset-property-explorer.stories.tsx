import { type Meta } from '@storybook/react';
import { type ReactElement } from 'react';
import {
  AssetPropertyExplorer,
  type AssetPropertyExplorerProps,
} from '../src/explorers';
import {
  type CommonResourceExplorerControls,
  SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
} from './controls';
import { client } from './data-source';
import {
  StoryWithClearedResourceCache,
  StoryWithSelectableResource,
  StoryWithTanstackDevTools,
  StoryWithTheming,
} from './decorators';

export default {
  title: 'Resource Explorers/Asset Property Explorer',
  component: AssetPropertyExplorer,
  parameters: {
    controls: {
      expanded: true,
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
} satisfies Meta<typeof AssetPropertyExplorer>;

type AssetPropertyExplorerStory = (
  controls: AssetPropertyExplorerStoryControls,
  context: AssetPropertyExplorerStoryContext
) => ReactElement;

type AssetPropertyExplorerStoryControls = CommonResourceExplorerControls;

interface AssetPropertyExplorerStoryContext {
  selectedResources: NonNullable<
    AssetPropertyExplorerProps['selectedAssetProperties']
  >;
  onSelectResource: NonNullable<
    AssetPropertyExplorerProps['onSelectAssetProperty']
  >;
}

function storyArgsToProps(
  {
    isTableTitleEnabled,
    isTableSearchEnabled,
    isTableFilterEnabled,
    isTableUserSettingsEnabled,
    isDropDownFilterEnabled,
    ...controls
  }: AssetPropertyExplorerStoryControls,
  { selectedResources, onSelectResource }: AssetPropertyExplorerStoryContext
): AssetPropertyExplorerProps {
  return {
    selectedAssetProperties: selectedResources,
    onSelectAssetProperty: onSelectResource,
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

// Requires setting parameters manually (or using search)
export const WithLatestValues: AssetPropertyExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AssetPropertyExplorer
      {...props}
      iotSiteWiseClient={client}
      parameters={[]}
    />
  );
};

// Requires setting parameters manually (or using search)
export const WithoutLatestValues: AssetPropertyExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AssetPropertyExplorer
      {...props}
      iotSiteWiseClient={{
        executeQuery: client.executeQuery.bind(client),
        listAssetProperties: client.listAssetProperties.bind(client),
        listAssetModelProperties: client.listAssetModelProperties.bind(client),
      }}
    />
  );
};

export const ZeroConfigurationTable: AssetPropertyExplorerStory = () => {
  return <AssetPropertyExplorer />;
};

export const ZeroConfigurationDropDown: AssetPropertyExplorerStory = () => {
  return <AssetPropertyExplorer variant='drop-down' />;
};
