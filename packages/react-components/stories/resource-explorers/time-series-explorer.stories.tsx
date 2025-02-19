import { type Meta } from '@storybook/react';
import { type ReactElement } from 'react';
import {
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
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
  StoryWithTheming,
} from './decorators';

export default {
  title: 'Resource Explorers/Time Series Explorer',
  component: TimeSeriesExplorer,
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
} satisfies Meta<typeof TimeSeriesExplorer>;

type TimeSeriesExplorerStory = (
  controls: TimeSeriesExplorerStoryControls,
  context: AssetPropertyExplorerStoryContext
) => ReactElement;

type TimeSeriesExplorerStoryControls = CommonResourceExplorerControls;

interface AssetPropertyExplorerStoryContext {
  selectedResources: NonNullable<TimeSeriesExplorerProps['selectedTimeSeries']>;
  onSelectResource: NonNullable<TimeSeriesExplorerProps['onSelectTimeSeries']>;
}

function storyArgsToProps(
  {
    isTableTitleEnabled,
    isTableSearchEnabled,
    isTableFilterEnabled,
    isTableUserSettingsEnabled,
    isDropDownFilterEnabled,
    ...controls
  }: TimeSeriesExplorerStoryControls,
  { selectedResources, onSelectResource }: AssetPropertyExplorerStoryContext
): TimeSeriesExplorerProps {
  return {
    selectedTimeSeries: selectedResources,
    onSelectTimeSeries: onSelectResource,
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

export const AllTimeSeriesWithLatestValues: TimeSeriesExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return <TimeSeriesExplorer {...props} iotSiteWiseClient={client} />;
};

export const AllTimeSeriesWithoutLatestValues: TimeSeriesExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <TimeSeriesExplorer
      {...props}
      iotSiteWiseClient={{ listTimeSeries: client.listTimeSeries.bind(client) }}
    />
  );
};

export const AllAssociatedTimeSeries: TimeSeriesExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <TimeSeriesExplorer
      {...props}
      iotSiteWiseClient={client}
      parameters={[{ timeSeriesType: 'ASSOCIATED' }]}
    />
  );
};

export const AllDisassociatedTimeSeries: TimeSeriesExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <TimeSeriesExplorer
      {...props}
      iotSiteWiseClient={client}
      parameters={[{ timeSeriesType: 'DISASSOCIATED' }]}
    />
  );
};

export const ZeroConfigurationTable: TimeSeriesExplorerStory = () => {
  return <TimeSeriesExplorer />;
};

export const ZeroConfigurationDropDown: TimeSeriesExplorerStory = () => {
  return <TimeSeriesExplorer variant='drop-down' />;
};
