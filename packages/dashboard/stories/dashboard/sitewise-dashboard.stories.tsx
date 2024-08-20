import React, { useCallback, useState } from 'react';
import { registerPlugin } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Dashboard, DashboardView } from '../../src';
import { REGION } from '../../testing/siteWiseQueries';

import { getEnvCredentials } from '../../testing/getEnvCredentials';
import {
  DashboardClientConfiguration,
  DashboardConfiguration,
} from '../../src/types';

const DASHBOARD_STORAGE_NAMESPACE = 'connected-dashboard';

const DEFAULT_DASHBOARD_CONFIG = {
  displaySettings: {
    numColumns: 100,
    numRows: 100,
  },
  widgets: [],
  defaultViewport: { duration: '10m' },
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
  const cachedDashboardConfiguration = window.localStorage.getItem(
    DASHBOARD_STORAGE_NAMESPACE
  );
  const dashboardConfiguration = cachedDashboardConfiguration
    ? JSON.parse(cachedDashboardConfiguration)
    : {};

  return {
    ...DEFAULT_DASHBOARD_CONFIG,
    ...dashboardConfiguration,
  };
};

export const Main: ComponentStory<typeof Dashboard> = () => {
  const dashboardConfig = getInitialDashboardConfig();
  const [initialViewMode, setInitialViewMode] = useState<'preview' | 'edit'>(
    'edit'
  );

  // on save not only updates local storage but forces the dashboard to reload given the updated config
  // this is done to more realistically match the dashboard implementation in iot-application
  const onSave = useCallback(
    async (
      dashboard: DashboardConfiguration,
      viewModeOnSave?: 'preview' | 'edit'
    ) => {
      viewModeOnSave && setInitialViewMode(viewModeOnSave);
      window.localStorage.setItem(
        DASHBOARD_STORAGE_NAMESPACE,
        JSON.stringify(dashboard)
      );
    },
    [setInitialViewMode]
  );

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

export const AssistantEnabled: ComponentStory<typeof DashboardView> = () => (
  <DashboardView
    clientConfiguration={CLIENT_CONFIGURATION}
    dashboardConfiguration={getInitialDashboardConfig()}
  />
);

export const AssistantWithDoubleScroll: ComponentStory<
  typeof DashboardView
> = () => (
  <div style={{ height: '600px', overflow: 'scroll' }}>
    <DashboardView
      clientConfiguration={CLIENT_CONFIGURATION}
      dashboardConfiguration={getInitialDashboardConfig()}
    />
  </div>
);

export default {
  title: 'Dashboard/SiteWise Connected',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;
