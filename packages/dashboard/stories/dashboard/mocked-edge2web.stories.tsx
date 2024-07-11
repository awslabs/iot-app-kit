import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Dashboard } from '../../src/index';
import {
  DashboardClientConfiguration,
  DashboardConfiguration,
} from '../../src/types';
import { DEFAULT_REGION } from '~/msw/constants';
import { useWorker } from '~/msw/useWorker';
import { RefreshRate } from '~/components/refreshRate/types';

const clientConfiguration: DashboardClientConfiguration = {
  awsCredentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  awsRegion: DEFAULT_REGION,
};

export default {
  title: 'Dashboard/Edge2Web Mocked Dashboard',
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

const displaySettings = {
  numColumns: 100,
  numRows: 100,
};

const defaultViewport = { duration: '10m' };
const querySettings = { refreshRate: 5000 as RefreshRate };
const emptyDashboardConfiguration = {
  clientConfiguration,
};

export const EditableDashboard: ComponentStory<typeof Dashboard> = () => {
  const [dashboardConfiguration, setDashboardConfiguration] =
    useState<DashboardConfiguration>({
      displaySettings,
      defaultViewport,
      widgets: [],
      querySettings,
    });

  const onConfigChange = (config: DashboardConfiguration) => {
    console.log('### onConfigChange', config);
    setDashboardConfiguration(config);
  };

  return (
    <Dashboard
      {...emptyDashboardConfiguration}
      dashboardConfiguration={dashboardConfiguration}
      onDashboardConfigurationChange={onConfigChange}
    />
  );
};
