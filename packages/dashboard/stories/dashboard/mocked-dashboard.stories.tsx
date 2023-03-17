import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createMockSiteWiseSDK, createMockIoTEventsSDK } from '@iot-app-kit/testing-util';

import Dashboard from '../../src/components/dashboard';
import { DashboardClientConfiguration } from '../../src/types';

export default {
  title: 'Dashboard/Mocked data',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;

const dashboardClientConfiguration: DashboardClientConfiguration = {
  iotSiteWiseClient: createMockSiteWiseSDK(),
  iotEventsClient: createMockIoTEventsSDK(),
};

export const Empty: ComponentStory<typeof Dashboard> = () => (
  <Dashboard
    {...{
      dashboardClientConfiguration,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      onSave: () => {},
    }}
  />
);

export const SingleWidget: ComponentStory<typeof Dashboard> = () => (
  <Dashboard
    {...{
      dashboardClientConfiguration,
      dashboardConfiguration: {
        widgets: [
          {
            componentTag: 'iot-line-chart',
            height: 15,
            width: 27,
            x: 5,
            y: 5,
            z: 0,
            assets: [],
          },
        ],
        viewport: { duration: '5m' },
      },
      onSave: () => {},
    }}
  />
);
