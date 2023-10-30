import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createMockSiteWiseSDK, createMockIoTEventsSDK } from '@iot-app-kit/testing-util';

import Dashboard from '../../src/components/dashboard';
import { DashboardClientConfiguration } from '../../src/types';

const clientConfiguration: DashboardClientConfiguration = {
  iotSiteWiseClient: createMockSiteWiseSDK() as IoTSiteWiseClient,
  iotEventsClient: createMockIoTEventsSDK(),
  iotTwinMakerClient: new IoTTwinMakerClient({}),
};

const displaySettings = {
  numColumns: 10,
  numRows: 10,
};

const viewport = { duration: '5m' };

const emptyDashboardConfiguration = {
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings,
    viewport,
    widgets: [],
    name: '',
  },
  onSave: () => Promise.resolve(),
};

const widgetDashboardConfiguration = {
  clientConfiguration,
  dashboardConfiguration: {
    displaySettings,
    viewport,
    widgets: [
      {
        type: 'iot-line-chart',
        id: 'some id',
        height: 15,
        width: 27,
        x: 5,
        y: 5,
        z: 0,
        properties: {},
      },
    ],
    name: 'EC2 test dashboard',
  },
  onSave: () => Promise.resolve(),
};

export default {
  title: 'Dashboard/Mocked data',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;

export const Empty: ComponentStory<typeof Dashboard> = () => <Dashboard {...emptyDashboardConfiguration} />;

export const SingleWidget: ComponentStory<typeof Dashboard> = () => <Dashboard {...widgetDashboardConfiguration} />;
