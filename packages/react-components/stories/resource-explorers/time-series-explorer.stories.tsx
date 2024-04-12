import { ComponentStory, type ComponentMeta } from '@storybook/react';
import React, { type FC } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  ResourceExplorerProvider,
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
} from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Time Series Explorer',
  component: TimeSeriesExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies ComponentMeta<typeof TimeSeriesExplorer>;

export const TimeSeriesExplorerExample: ComponentStory<
  FC<TimeSeriesExplorerProps>
> = ({ selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <TimeSeriesExplorer
        queries={[{ timeSeriesType: 'DISASSOCIATED' }, {}]}
        selectionType={selectionType}
        dataSource={{
          listTimeSeries: client.listTimeSeries.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};

export const AssociatedTimeSeriesExplorer: ComponentStory<
  FC<TimeSeriesExplorerProps>
> = ({ selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <TimeSeriesExplorer
        queries={[{ timeSeriesType: 'ASSOCIATED' }]}
        selectionType={selectionType}
        dataSource={{
          listTimeSeries: client.listTimeSeries.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};

export const DisassociatedTimeSeriesExplorer: ComponentStory<
  FC<TimeSeriesExplorerProps>
> = ({ selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <TimeSeriesExplorer
        queries={[{ timeSeriesType: 'DISASSOCIATED' }]}
        selectionType={selectionType}
        dataSource={{
          listTimeSeries: client.listTimeSeries.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};
