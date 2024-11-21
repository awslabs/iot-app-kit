import { registerPlugin } from '@iot-app-kit/core';
import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';
import { Dashboard } from '../../src';
import { type DashboardConfiguration } from '../../src/types';

registerPlugin('metricsRecorder', {
  provider: () => ({
    record: (...args) => console.log('record metric:', ...args),
  }),
});

const DEFAULT_DASHBOARD_CONFIG = {
  displaySettings: {
    numColumns: 100,
    numRows: 100,
  },
  widgets: [],
  defaultViewport: { duration: '10m' },
};

const DASHBOARD_STORAGE_NAMESPACE = 'connected-dashboard';

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

export default {
  title: 'Dashboard/Assistant Connected',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    dashboardConfiguration: getInitialDashboardConfig(),
    clientConfiguration: {
      awsCredentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
      },
      awsRegion: import.meta.env.VITE_AWS_REGION,
    },
    assistantConfiguration: { state: 'PASSIVE' },
  },
} as Meta<typeof Dashboard>;

type Story = StoryObj<typeof Dashboard>;

export const Main: Story = {
  render: (_story, { args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [initialViewMode, setInitialViewMode] = useState<'preview' | 'edit'>(
      'edit'
    );

    // on save not only updates local storage but forces the dashboard to reload given the updated config
    // this is done to more realistically match the dashboard implementation in iot-application
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Dashboard {...args} onSave={onSave} initialViewMode={initialViewMode} />
    );
  },
};

export const View: Story = {};
