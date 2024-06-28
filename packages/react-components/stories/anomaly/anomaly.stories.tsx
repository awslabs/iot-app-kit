import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../../src/queries';
import { AnomalyChart } from '../../src/components/anomaly-chart';
import { errorMockDatasource } from './mockData';
import { getEnvCredentials, getRegion } from '../utils/query';
import { TimeSelection, TimeSync } from '../../src';
import { ConnectedAnomalyChart } from './connected-anomaly-chart';
import { MOCK_DATA_SOURCE_SUCCESS } from '../../src/components/anomaly-chart/tests/mockDataSources';

export default {
  title: 'Widgets/Anomaly',
  component: AnomalyChart,
  argTypes: {
    assetId: {
      control: { type: 'text' },
      defaultValue: '4a89a6b3-4a85-4ece-a598-a1ca4661d466',
    },
    axis: {
      control: { type: 'object' },
    },
    gestures: {
      control: { type: 'boolean' },
    },
    predictionDefinitionId: {
      control: { type: 'text' },
      defaultValue: 'a85b0fb2-b259-441c-aacc-d7d7495214f5',
    },
    decimalPlaces: { control: { type: 'number', defaultValue: undefined } },
    mode: {
      control: 'select',
      options: ['light', 'dark'],
      defaultValue: 'light',
    },
    tooltipSort: {
      control: 'select',
      options: ['value', 'alphabetical'],
      defaultValue: 'alphabetical',
    },
    showTimestamp: {
      control: { type: 'boolean' },
      defaultValue: true,
    },
    viewport: {
      control: { type: 'object' },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
      </>
    ),
  ],
} as ComponentMeta<typeof AnomalyChart>;

export const DefaultSettingsAnomalyChart: ComponentStory<
  typeof AnomalyChart
> = (options) => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart {...options} data={[MOCK_DATA_SOURCE_SUCCESS]} />
      </div>
    </div>
  );
};

export const AnomalyChartHiddenAxisAndTimestamp: ComponentStory<
  typeof AnomalyChart
> = () => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart
          data={[MOCK_DATA_SOURCE_SUCCESS]}
          axis={{ showY: false, showX: false }}
          showTimestamp={false}
          viewport={{
            start: new Date(1714409978348),
            end: new Date(1714999073631),
          }}
        />
      </div>
    </div>
  );
};

export const SiteWiseConnectedAnomalyChart: ComponentStory<
  typeof ConnectedAnomalyChart
> = ({ assetId, predictionDefinitionId, ...options }) => {
  if (!getEnvCredentials() || !getRegion()) {
    return (
      <div>
        <h1>All required Env variables not set</h1>
        <p>Required:</p>
        <ul>
          <li>AWS_ACCESS_KEY_ID</li>
          <li>AWS_SECRET_ACCESS_KEY</li>
          <li>AWS_SESSION_TOKEN</li>
          <li>AWS_REGION</li>
        </ul>
      </div>
    );
  }

  return (
    <TimeSync>
      <TimeSelection />
      <ConnectedAnomalyChart
        {...options}
        assetId={assetId}
        predictionDefinitionId={predictionDefinitionId}
      />
    </TimeSync>
  );
};

export const AnomalyChartErrorState: ComponentStory<typeof AnomalyChart> = (
  options
) => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart
          {...options}
          data={[errorMockDatasource]}
          viewport={{
            start: new Date(1714409978348),
            end: new Date(1714999073631),
          }}
        />
      </div>
    </div>
  );
};

export const AnomalyChartEmptyState: ComponentStory<typeof AnomalyChart> = (
  options
) => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart
          {...options}
          viewport={{
            start: new Date(1714409978348),
            end: new Date(1714999073631),
          }}
        />
      </div>
    </div>
  );
};
