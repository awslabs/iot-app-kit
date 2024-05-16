import { type Meta } from '@storybook/react';
import React, { useState } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
} from '../../src/components/resource-explorers';
import type { ResourceExplorerStoryControls } from './types';
import type { TimeSeriesResource } from '../../src/components/resource-explorers/types/resources';

export default {
  title: 'Resource Explorers/Time Series Explorer',
  component: TimeSeriesExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies Meta<typeof TimeSeriesExplorer>;

type TimeSeriesExplorerStoryControls =
  ResourceExplorerStoryControls<TimeSeriesResource> &
    Pick<TimeSeriesExplorerProps, 'parameters'>;

export function StandardExample({
  isTitleless,
  isFilterEnabled,
  isUserSettingsEnabled,
  ...timeSeriesExplorerProps
}: TimeSeriesExplorerStoryControls) {
  const [selectedTimeSeries, setSeletedTimeSeries] = useState<
    NonNullable<TimeSeriesExplorerProps['selectedTimeSeries']>
  >([]);

  return (
    <TimeSeriesExplorer
      {...timeSeriesExplorerProps}
      requestFns={client}
      selectedTimeSeries={selectedTimeSeries}
      onSelectTimeSeries={setSeletedTimeSeries}
      parameters={[{}]}
      tableSettings={{
        isTitleless,
        isFilterEnabled,
        isUserSettingsEnabled,
      }}
    />
  );
}

export function ZeroConfiguration() {
  return <TimeSeriesExplorer />;
}
