import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { registerPlugin } from '@iot-app-kit/core';
import {
  Dashboard,
  type DashboardClientConfiguration,
  type DashboardConfiguration,
} from '@iot-app-kit/dashboard';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

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
  viewport: { duration: '10m' },
};

const DASHBOARD_STORAGE_NAMESPACE = 'edge-dashboard';

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

const getClientConfig = () => {
  const clientConfig = {
    awsCredentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
    },
    endpoint: import.meta.env.VITE_EDGE_GATEWAY_ENDPOINT,
    region: 'edge',
    disableHostPrefix: true,
  };
  const iotSiteWiseClient = new IoTSiteWiseClient(clientConfig);
  const iotEventsClient = new IoTEventsClient(clientConfig);
  const iotTwinMakerClient = new IoTTwinMakerClient(clientConfig);
  const iotSiteWise = new IoTSiteWise(clientConfig);

  const CLIENT_CONFIGURATION: DashboardClientConfiguration = {
    iotSiteWiseClient,
    iotEventsClient,
    iotTwinMakerClient,
    iotSiteWise,
  };

  return CLIENT_CONFIGURATION;
};

export default {
  title: 'Dashboard/Edge Connected',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    clientConfiguration: getClientConfig(),
    dashboardConfiguration: getInitialDashboardConfig(),
    edgeMode: 'enabled',
  },
} as Meta<typeof Dashboard>;

type Story = StoryObj<typeof Dashboard>;

export const Main: Story = {
  render: (_story, { args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dashboardConfig, setDashboardConfig] = useState(
      args.dashboardConfiguration
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [initialViewMode, setInitialViewMode] = useState<'preview' | 'edit'>(
      'edit'
    );

    // on save not only updates local storage but forces the dashboard to reload given the updated config
    // this is done to more realistically match the dashboard implementation in iot-application
    const onSave = async (
      dashboard: DashboardConfiguration,
      viewModeOnSave?: 'preview' | 'edit'
    ) => {
      viewModeOnSave && setInitialViewMode(viewModeOnSave);
      window.localStorage.setItem(
        DASHBOARD_STORAGE_NAMESPACE,
        JSON.stringify(dashboard)
      );
      return new Promise(() => setDashboardConfig(dashboard)) as Promise<void>;
    };

    return (
      <Dashboard
        {...args}
        onSave={onSave}
        initialViewMode={initialViewMode}
        dashboardConfiguration={dashboardConfig}
      />
    );
  },
};

export const View: Story = {};
