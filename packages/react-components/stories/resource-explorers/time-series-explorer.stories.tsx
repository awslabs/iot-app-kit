import { type Meta } from '@storybook/react';
import React from 'react';

import {
  CommonResourceExplorerControls,
  SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
} from './controls';
import { client } from './data-source';

import {
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
} from '../../src/components/resource-explorers';
import { StoryFnReactReturnType } from '@storybook/react/dist/ts3.9/client/preview/types';
import {
  StoryWithClearedResourceCache,
  StoryWithSelectableResource,
  StoryWithTanstackDevTools,
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
  ],
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof TimeSeriesExplorer>;

type TimeSeriesExplorerStory = (
  controls: TimeSeriesExplorerStoryControls,
  context: AssetPropertyExplorerStoryContext
) => StoryFnReactReturnType;

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

  return <TimeSeriesExplorer {...props} requestFns={client} />;
};

export const AllTimeSeriesWithoutLatestValues: TimeSeriesExplorerStory = (
  controls,
  context
) => {
  const props = storyArgsToProps(controls, context);

  return (
    <TimeSeriesExplorer
      {...props}
      requestFns={{ listTimeSeries: client.listTimeSeries.bind(client) }}
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
      requestFns={client}
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
      requestFns={client}
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
