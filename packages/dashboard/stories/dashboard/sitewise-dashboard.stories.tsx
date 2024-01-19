import React, { useState } from 'react';
import { registerPlugin } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Dashboard from '../../src/components/dashboard';
import { REGION } from '../../testing/siteWiseQueries';

import { getEnvCredentials } from '../../testing/getEnvCredentials';
import {
  DashboardClientConfiguration,
  DashboardConfiguration,
} from '../../src/types';
import { DashboardView } from '~/index';

const DEFAULT_DASHBOARD_CONFIG = {
  displaySettings: {
    numColumns: 100,
    numRows: 100,
  },
  widgets: [],
  viewport: { duration: '10m' },
};

const CLIENT_CONFIGURATION: DashboardClientConfiguration = {
  awsCredentials: getEnvCredentials(),
  awsRegion: REGION,
};

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

const getInitialDashboardConfig = (): DashboardConfiguration => {
  const cachedDashboardConfiguration = window.localStorage.getItem('dashboard');
  const dashboardConfiguration = cachedDashboardConfiguration
    ? JSON.parse(cachedDashboardConfiguration)
    : {};

  return {
    ...DEFAULT_DASHBOARD_CONFIG,
    ...dashboardConfiguration,
  };
};

export const Main: ComponentStory<typeof Dashboard> = () => {
  const [dashboardConfig, setDashboardConfig] = useState(
    getInitialDashboardConfig()
  );
  const [initialViewMode, setInitialViewMode] = useState<'preview' | 'edit'>(
    'edit'
  );

  // on save not only updates local storage but forces the dashboard to reload given the updated config
  // this is done to more realistically match the dashboard implementation in iot-application
  const onSave = async (
    dashboard: DashboardConfiguration,
    viewModeOnSave?: 'preview' | 'edit'
  ) => {
    console.log(dashboard);
    viewModeOnSave && setInitialViewMode(viewModeOnSave);
    window.localStorage.setItem('dashboard', JSON.stringify(dashboard));
    return new Promise(() => setDashboardConfig(dashboard)) as Promise<void>;
  };

  return (
    <Dashboard
      clientConfiguration={CLIENT_CONFIGURATION}
      onSave={onSave}
      initialViewMode={initialViewMode}
      dashboardConfiguration={dashboardConfig}
    />
  );
};

export const View: ComponentStory<typeof DashboardView> = () => (
  <DashboardView
    clientConfiguration={CLIENT_CONFIGURATION}
    dashboardConfiguration={getInitialDashboardConfig()}
  />
);

export default {
  title: 'Dashboard/SiteWise Connected',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;
