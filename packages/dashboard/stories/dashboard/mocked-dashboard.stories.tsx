import React from 'react';
import { registerPlugin } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Dashboard, DashboardProperties } from '../../src';
import { DashboardClientConfiguration } from '../../src/types';
import { DEFAULT_REGION } from '~/msw/constants';
import { useWorker } from '~/msw/useWorker';
import { RefreshRate } from '~/components/refreshRate/types';
import DashboardView from '~/components/dashboard/view';
import { MOCK_DASHBOARD_CONFIG } from './mockData';

/**
 * Data is mocked by the service worker started above.
 * No need for real credentials, but the region must match.
 */
const clientConfiguration: DashboardClientConfiguration = {
  awsCredentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  awsRegion: DEFAULT_REGION,
};

const displaySettings = {
  numColumns: 100,
  numRows: 100,
};

const defaultViewport = { duration: '10m' };
const querySettings = { refreshRate: 5000 as RefreshRate };

const emptyDashboardConfiguration: DashboardProperties = {
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings,
    defaultViewport,
    widgets: [],
    querySettings,
  },
  onSave: () => Promise.resolve(),
  timeZone: 'Asia/Hong_Kong',
};

const noOptionalPropsDashboardConfiguration: DashboardProperties = {
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings,
    widgets: [],
  },
  onSave: () => Promise.resolve(),
  onDashboardConfigurationChange: (config) => {
    console.log('dashboard config changed to: ', config);
  },
  timeZone: 'Asia/Hong_Kong',
};

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

export default {
  title: 'Dashboard/Mocked data',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  // Applies to all stories under Mocked data
  decorators: [
    (Story) => {
      useWorker();
      return <Story />;
    },
  ],
} as ComponentMeta<typeof Dashboard>;

export const Empty: ComponentStory<typeof Dashboard> = () => (
  <Dashboard {...emptyDashboardConfiguration} />
);

export const NoOptionalProps: ComponentStory<typeof Dashboard> = () => (
  <Dashboard {...noOptionalPropsDashboardConfiguration} />
);

export const ViewOnly: ComponentStory<typeof Dashboard> = () => (
  <DashboardView
    {...emptyDashboardConfiguration}
    dashboardConfiguration={MOCK_DASHBOARD_CONFIG}
  />
);

export const ViewOnlyWithTimezone: ComponentStory<typeof Dashboard> = () => (
  <DashboardView
    {...emptyDashboardConfiguration}
    dashboardConfiguration={MOCK_DASHBOARD_CONFIG}
    timeZone='Asia/Tokyo'
  />
);
