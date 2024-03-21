import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../../src/queries';
import { AnomalyWidget } from '../../src/components/anomaly-widget';
import { MOCK_DATA_VIEWPORT, mockDatasource } from './mockData';
import { getEnvCredentials, getRegion } from '../utils/query';
import { TimeSelection, TimeSync } from '../../src';
import { ConnectedAnomalyWidget } from './connected-anomaly-widget';
// import {
//   colorTextHeadingDefault,
//   colorTextButtonNormalActive
// } from '@cloudscape-design/design-tokens';

export default {
  title: 'Widgets/Anomaly',
  component: AnomalyWidget,
  argTypes: {
    assetId: {
      control: { type: 'text' },
      defaultValue: '4a89a6b3-4a85-4ece-a598-a1ca4661d466',
    },
    predictionDefinitionId: {
      control: { type: 'text' },
      defaultValue: 'a85b0fb2-b259-441c-aacc-d7d7495214f5',
    },
    title: {
      control: { type: 'text' },
      defaultValue: 'Prediction Model 1',
    },
    decimalPlaces: { control: { type: 'number', defaultValue: undefined } },
    tooltipSort: {
      control: { type: 'text' },
      defaultValue: undefined,
    },
    mode: {
      control: 'select',
      options: ['light', 'dark'],
      defaultValue: 'light',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof AnomalyWidget>;

export const MockDataAnomalyWidget: ComponentStory<typeof AnomalyWidget> = (
  options
) => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyWidget
          {...options}
          datasources={[mockDatasource]}
          viewport={MOCK_DATA_VIEWPORT}
        />
      </div>
    </div>
  );
};

export const SiteWiseConnectedAnomalyWidget: ComponentStory<
  typeof ConnectedAnomalyWidget
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
      <ConnectedAnomalyWidget
        {...options}
        assetId={assetId}
        predictionDefinitionId={predictionDefinitionId}
      />
    </TimeSync>
  );
};
