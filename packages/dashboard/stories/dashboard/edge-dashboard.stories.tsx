import { useState } from 'react';
import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { registerPlugin } from '@iot-app-kit/core';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';

import { Dashboard, DashboardView } from '../../src';

import {
  type DashboardClientConfiguration,
  type DashboardConfiguration,
} from '../../src/types';

import { getEnvCredentials } from '../../testing/getEnvCredentials';
import { getEndpoints } from '../../testing/getEndpoints';

const DASHBOARD_STORAGE_NAMESPACE = 'edge-dashboard';

const DEFAULT_DASHBOARD_CONFIG = {
  displaySettings: {
    numColumns: 100,
    numRows: 100,
  },
  widgets: [],
  viewport: { duration: '10m' },
};

const getClientConfig = () => {
  const clientConfig = {
    endpoint: getEndpoints().edgeGatewayEndpoint,
    credentials: getEnvCredentials(),
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
    window.localStorage.setItem(
      DASHBOARD_STORAGE_NAMESPACE,
      JSON.stringify(dashboard)
    );
    return new Promise(() => setDashboardConfig(dashboard)) as Promise<void>;
  };

  const clientConfig = getClientConfig();

  return (
    <Dashboard
      clientConfiguration={clientConfig}
      onSave={onSave}
      initialViewMode={initialViewMode}
      dashboardConfiguration={dashboardConfig}
      edgeMode='enabled'
    />
  );
};

export const View: ComponentStory<typeof DashboardView> = () => {
  const clientConfig = getClientConfig();
  return (
    <DashboardView
      clientConfiguration={clientConfig}
      dashboardConfiguration={getInitialDashboardConfig()}
      edgeMode='enabled'
    />
  );
};

export default {
  title: 'Dashboard/Edge Connected',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;
