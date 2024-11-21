import { type Meta } from '@storybook/react';
import { type ReactElement } from 'react';
import {
  AlarmExplorer,
  type AlarmExplorerProps,
} from '../../src/components/resource-explorers';
import {
  type CommonResourceExplorerControls,
  SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
} from './controls';
import { client } from './data-source';
import {
  StoryWithClearedResourceCache,
  StoryWithSelectableResource,
  StoryWithTanstackDevTools,
} from './decorators';

export default {
  title: 'Resource Explorers/Alarm Explorer',
  component: AlarmExplorer,
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
} satisfies Meta<typeof AlarmExplorer>;

type AlarmExplorerStory = (
  controls: AlarmExplorerStoryControls,
  context: AlarmExplorerStoryContext
) => ReactElement;

type AlarmExplorerStoryControls = CommonResourceExplorerControls;

interface AlarmExplorerStoryContext {
  selectedResources: NonNullable<AlarmExplorerProps['selectedAlarms']>;
  onSelectResource: NonNullable<AlarmExplorerProps['onSelectAlarm']>;
}

function storyArgsToProps(
  {
    isTableTitleEnabled,
    isTableSearchEnabled,
    isTableFilterEnabled,
    isTableUserSettingsEnabled,
    isDropDownFilterEnabled,
    ...controls
  }: AlarmExplorerStoryControls,
  { selectedResources, onSelectResource }: AlarmExplorerStoryContext
): AlarmExplorerProps {
  return {
    selectedAlarms: selectedResources,
    onSelectAlarm: onSelectResource,
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
export const WithLatestValues: AlarmExplorerStory = (controls, context) => {
  const props = storyArgsToProps(controls, context);

  return (
    <AlarmExplorer {...props} iotSiteWiseClient={client} parameters={[]} />
  );
};

export const ZeroConfigurationTable: AlarmExplorerStory = () => {
  return <AlarmExplorer />;
};

export const ZeroConfigurationDropDown: AlarmExplorerStory = () => {
  return <AlarmExplorer variant='drop-down' />;
};
