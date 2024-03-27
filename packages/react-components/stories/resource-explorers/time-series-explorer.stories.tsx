import { ComponentStory, type ComponentMeta } from '@storybook/react';
import React, { type FC } from 'react';

import { SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES } from './constants';
import { client } from './data-source';

import {
  TimeSeriesExplorer,
  TimeSeriesExplorerProps,
} from '../../src/components/resource-explorers/time-series-explorer/time-series-explorer';
import { ResourceExplorerProvider } from '../../src/components/resource-explorers';

export default {
  title: 'Resource Explorers/Time Series Explorer',
  component: TimeSeriesExplorer,
  argTypes: {
    ...SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES,
  },
} satisfies ComponentMeta<typeof TimeSeriesExplorer>;

export const TimeSeriesExplorerExample: ComponentStory<
  FC<TimeSeriesExplorerProps>
> = ({ filterEnabled, preferencesEnabled, selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <TimeSeriesExplorer
        queries={[
          { timeSeriesType: 'DISASSOCIATED' },
          { assetId: '9a802ed9-7f28-4e20-8239-701a8aba7da1' },
          { assetId: 'd90ac8be-423c-4ec3-8d0d-a894a00565ce' },
          {},
        ]}
        filterEnabled={filterEnabled}
        preferencesEnabled={preferencesEnabled}
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
> = ({ filterEnabled, preferencesEnabled, selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <TimeSeriesExplorer
        queries={[{ timeSeriesType: 'ASSOCIATED' }]}
        filterEnabled={filterEnabled}
        preferencesEnabled={preferencesEnabled}
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
> = ({ filterEnabled, preferencesEnabled, selectionType }) => {
  return (
    <ResourceExplorerProvider>
      <TimeSeriesExplorer
        queries={[{ timeSeriesType: 'DISASSOCIATED' }]}
        filterEnabled={filterEnabled}
        preferencesEnabled={preferencesEnabled}
        selectionType={selectionType}
        dataSource={{
          listTimeSeries: client.listTimeSeries.bind(client),
        }}
      />
    </ResourceExplorerProvider>
  );
};

// TODO: example of modeled time series only
// TODO: example of unmodeled time series only
