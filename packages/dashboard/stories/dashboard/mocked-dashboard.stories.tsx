import { registerPlugin } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import DashboardView from '~/dashboard/view';
import { RefreshRate } from '~/features/refresh-rate/types';
import { DEFAULT_REGION } from '~/msw/constants';
import { useWorker } from '~/msw/useWorker';
import { Dashboard, DashboardProperties } from '../../src';
import { DashboardClientConfiguration } from '../../src/types';
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
  name: 'Dashboard Name',
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings,
    defaultViewport,
    widgets: [],
    querySettings,
  },
  onSave: () => new Promise((resolve) => setTimeout(() => resolve(), 1000)),
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

const style1 = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const style = {
  height: '1000px',
  width: '1480px',
};

export const Empty: ComponentStory<typeof Dashboard> = () => (
  <div style={style1}>
    <div style={style}>
      <Dashboard {...emptyDashboardConfiguration} />
    </div>
  </div>
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
