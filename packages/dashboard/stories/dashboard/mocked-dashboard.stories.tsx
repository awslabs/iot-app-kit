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

const clientConfiguration: DashboardClientConfiguration = {
  iotSiteWiseClient: createMockSiteWiseSDK(),
  iotEventsClient: createMockIoTEventsSDK(),
};

export const Empty: ComponentStory<typeof Dashboard> = () => (
  <Dashboard
    {...{
      clientConfiguration,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      onSave: () => Promise.resolve(),
    }}
  />
);

export const SingleWidget: ComponentStory<typeof Dashboard> = () => (
  <Dashboard
    {...{
      clientConfiguration,
      dashboardConfiguration: {
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
        viewport: { duration: '5m' },
      },
      onSave: () => Promise.resolve(),
    }}
  />
);
